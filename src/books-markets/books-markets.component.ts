import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import {
  ActionEvent,
  BookPostCardComponent,
  BookPostEvent
} from '../components/book-post-card/book-post-card.component';

import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
// import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { InstitutionsDropdownComponent } from '../components/institutions-dropdown/institutions-dropdown.component';
import { SurveyService } from '../services/survey.service';

import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { ISBN13Pipe } from '../pipes/isbn13.pipe';

import * as ISBN from 'isbn3';
import * as Hash from 'crypto-hash';

type BookMarketsFilters = {
  tradeable: FormControl;
  sorting: FormControl;
  scope: FormControl;
  state: FormGroup<{
    new: FormControl;
    likeNew: FormControl;
    veryGood: FormControl;
    good: FormControl;
    acceptable: FormControl;
  }>;
};

@Component({
  selector: 'books-market',
  standalone: true,
  imports: [
    CommonModule,
    BookPostCardComponent,
    BooksPricingComponent,
    // ConfirmDialogComponent,
    ISBN13Pipe,
    ReactiveFormsModule,
    RouterModule,
    InfiniteScrollDirective,
    InstitutionsDropdownComponent
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

  protected pricingQueryParams: any = {};

  protected survey!: any;

  protected filters: FormGroup<BookMarketsFilters> =
    new FormGroup<BookMarketsFilters>({
      tradeable: new FormControl<string>('all'),
      sorting: new FormControl<string>('price:desc'),
      scope: new FormControl<number>(0),
      state: new FormGroup({
        new: new FormControl<boolean>(false),
        likeNew: new FormControl<boolean>(false),
        veryGood: new FormControl<boolean>(false),
        good: new FormControl<boolean>(false),
        acceptable: new FormControl<boolean>(false)
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
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (query: any) => {
        this.pricingQueryParams = {
          scope: query.scope,
          isbn13: query.isbn13
        };

        this.filters.patchValue({
          ...(/^\d+$/.test(query.scope) ? { scope: +query.scope } : {}),
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
            : {}),
          ...(['true', 'false'].includes(query.tradeable)
            ? { tradeable: JSON.parse(query.tradeable) }
            : {})
        });

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

  override onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const { state, tradeable, sorting, scope } = this.filters.value;
    const params = {
      institutionId: scope,
      isbn13: ISBN.asIsbn13(this.book.isbn13),
      ...(tradeable && ['true', 'false'].includes(tradeable)
        ? { tradeable }
        : {}),
      ...(sorting &&
      ['posted-on', 'review', 'price:asc', 'price:desc'].includes(sorting)
        ? { sorting }
        : {}),
      ...(state?.new ||
      state?.likeNew ||
      state?.veryGood ||
      state?.good ||
      state?.acceptable
        ? {
            'state[]': [
              ...(state.new ? ['NEW'] : []),
              ...(state.likeNew ? ['LIKE_NEW'] : []),
              ...(state.veryGood ? ['VERY_GOOD'] : []),
              ...(state.good ? ['GOOD'] : []),
              ...(state.acceptable ? ['ACCEPTABLE'] : [])
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
    const { state, tradeable, sorting, scope } = this.filters.value;
    const encoded =
      (state?.new ? 1 : 0) +
      (state?.likeNew ? 2 : 0) +
      (state?.veryGood ? 4 : 0) +
      (state?.good ? 8 : 0) +
      (state?.acceptable ? 16 : 0);

    this.router.navigate(['books', 'markets'], {
      queryParams: {
        scope,
        isbn13: this.book.isbn13,
        ...(encoded ? { state: encoded } : {}),
        tradeable,
        sorting
      }
    });
  }

  onActionClicked(event: BookPostEvent, item: any) {
    if (ActionEvent.Like === event.type) {
      this.onLikeBookPost(item);
    } else if (ActionEvent.Unlike === event.type) {
      this.onUnlikeBookPost(item);
    }
  }

  onLikeBookPost(item: any) {
    item.isProcessingLike = true;
    this.bookMarketService
      .likeBookPost(item.bookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          item.savedBookOfferId = response.savedBookOfferId;
          item.isProcessingLike = false;
        },
        error: (error: any) => {
          item.isProcessingLike = false;
        }
      });
  }

  onUnlikeBookPost(item: any) {
    this.bookMarketService
      .unlikeBookPost(item.savedBookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          item.savedBookOfferId = null;
          item.isProcessingLike = false;
        },
        error: (error: any) => {
          item.isProcessingLike = false;
        }
      });
  }

  onSurveySelection(selection: boolean | null) {
    setTimeout(() => {
      this.survey = this.surveyService.getAcademicSurveyQuestion();
      console.log(selection, this.survey);
    }, 3000);
  }

  trackBy(index: number, item: any) {
    return item.bookOfferId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
