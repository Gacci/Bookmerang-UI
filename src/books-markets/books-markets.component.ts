import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import {
  BookPostCardComponent,
  BookPostEvent
} from '../components/book-post-card/book-post-card.component';

import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { SurveyService } from '../services/survey.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { ISBN13Pipe } from '../pipes/isbn13.pipe';

import * as ISBN from 'isbn3';
import * as Hash from 'crypto-hash';

console.log(Hash);
@Component({
  selector: 'books-market',
  standalone: true,
  imports: [
    CommonModule,

    BookPostCardComponent,
    BooksPricingComponent,
    ConfirmDialogComponent,
    ISBN13Pipe,
    ReactiveFormsModule,
    RouterModule,

    InfiniteScrollDirective
  ],
  templateUrl: './books-markets.component.html',
  styleUrl: './books-markets.component.scss'
})
export class BooksMarketsComponent
  extends InfiniteScrollView<any>
  implements OnDestroy
{
  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  private surveyService = inject(SurveyService);

  private filtersHashedValue!: string;

  protected filtersHashChanged!: boolean;

  protected isLoadingMetrics!: boolean;

  protected metrics!: any;

  protected book!: any;

  protected pricingViewState!: boolean;

  protected survey!: any;

  protected filters: FormGroup<any> = new FormGroup({
    tradeable: new FormControl('all'),
    sorting: new FormControl('price:desc'),
    state: new FormGroup({
      new: new FormControl(false),
      likeNew: new FormControl(false),
      veryGood: new FormControl(false),
      good: new FormControl(false),
      acceptable: new FormControl(false)
    })
  });

  ngOnInit(): void {
    this.pageNumber += 1;
    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resolved: any) => {
        this.book = resolved.book;
        this.data = resolved.posts;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);

        console.log(this);
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (query: any) => {
        this.params = { ...query };
        const patch = {
          ...(query.state
            ? {
                state: {
                  new: !!(+query.state & (1 << 0)),
                  likeNew: !!(+query.state & (1 << 1)),
                  veryGood: !!(+query.state & (1 << 2)),
                  good: !!(+query.state & (1 << 3)),
                  acceptable: !!(+query.state & (1 << 4))
                }
              }
            : {}),
          ...(['posted-on', 'review', 'price:asc', 'price:desc'].includes(
            query.sorting
          )
            ? { sorting: query.sorting }
            : { sorting: 'posted-on' }),
          ...(/^true|false$/.test(query.tradeable)
            ? { tradeable: JSON.parse(query.tradeable) }
            : {})
        };

        this.filters.patchValue(patch);
        this.filtersHashedValue = await Hash.sha256(
          JSON.stringify(this.filters.value)
        );
      });

    this.filters.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (filter: any) => {
        this.filtersHashChanged =
          this.filtersHashedValue !==
          (await Hash.sha256(JSON.stringify(this.filters.value)));
      });

    this.survey = this.surveyService.getAcademicSurveyQuestion();
  }

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    console.log('onScrollDown');
    const { state, tradeable, sorting, institution } = this.params;
    const params = {
      isbn13: ISBN.asIsbn13(this.params.isbn13),
      ...(/^true|false$/.test(tradeable) ? { tradeable } : {}),
      ...(['posted-on', 'review', 'price:asc', 'price:desc'].includes(sorting)
        ? { sorting }
        : {}),
      ...(+state
        ? {
            'state[]': [
              ...(!!(+state & (1 << 0)) ? ['NEW'] : []),
              ...(!!(+state & (1 << 1)) ? ['LIKE_NEW'] : []),
              ...(!!(+state & (1 << 2)) ? ['VERY_GOOD'] : []),
              ...(!!(+state & (1 << 3)) ? ['GOOD'] : []),
              ...(!!(+state & (1 << 4)) ? ['ACCEPTABLE'] : [])
            ]
          }
        : {}),
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.bookMarketService
      .search(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage = !!data?.length && !(data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  protected onSubmit(e: Event) {
    console.log(this.filters.value);
    const { state, tradeable, sorting } = this.filters.value;
    const encoded =
      (state.new ? 1 : 0) +
      (state.likeNew ? 2 : 0) +
      (state.veryGood ? 4 : 0) +
      (state.good ? 8 : 0) +
      (state.acceptable ? 16 : 0);

    this.router.navigate(['books', 'markets'], {
      queryParams: {
        isbn13: this.book.isbn13,
        ...(encoded ? { state: encoded } : {}),
        ...(/^true|false$/.test(tradeable) ? { tradeable } : {}),
        ...(sorting ? { sorting } : {})
      }
    });
  }

  onSurveySelection(selection: boolean | null) {
    setTimeout(() => {
      this.survey = this.surveyService.getAcademicSurveyQuestion();
      console.log(selection, this.survey);
    }, 3000);
  }

  onActionClicked(event: BookPostEvent) {
    console.log(event);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
