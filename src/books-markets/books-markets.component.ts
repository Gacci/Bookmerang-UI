import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NgxPopperjsModule, NgxPopperjsPlacements } from 'ngx-popperjs';

import {
  ActionEvent,
  BookPostCardComponent,
  BookPostEvent
} from '../components/book-post-card/book-post-card.component';

import { BookOffersMetricsComponent } from "../components/book-offers-metrics/book-offers-metrics.component";

import {
  AccordionComponent,
  AccordionViewComponent
} from '../components/accordion/accordion.component';

import { AuthService } from '../services/auth.service';
import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { SurveyService } from '../services/survey.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { Book } from '../interfaces/book.interface';
import { BookOffer, Likeable } from '../interfaces/book-offer.interface';
import { Scope } from '../interfaces/scope.interface';

import { ISBN13Pipe } from '../pipes/isbn13.pipe';

import * as Hash from 'crypto-hash';
import * as ISBN from 'isbn3';




type BookMarketsFilters = {
  tradeable: FormControl;
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
    AccordionComponent,
    AccordionViewComponent,
    BookPostCardComponent,
    // BooksPricingComponent,
    ISBN13Pipe,
    NgxPopperjsModule,
    ReactiveFormsModule,
    RouterModule,
    InfiniteScrollDirective,
    BookOffersMetricsComponent
],
  templateUrl: './books-markets.component.html',
  styleUrl: './books-markets.component.scss'
})
export class BooksMarketsComponent
  extends InfiniteScrollView<any>
  implements OnDestroy
{
  private readonly auth = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  private readonly surveyService = inject(SurveyService);

  private filtersHashedValue!: string;

  protected book!: Book;

  protected filtersHashChanged!: boolean;

  protected isLoadingMetrics!: boolean;

  protected institutions: Scope[] = [];

  protected metrics!: any;

  protected ngxPopperPlacement = NgxPopperjsPlacements.BOTTOMSTART;

  protected pricingViewState!: boolean;

  protected sortByText!: string;

  protected sorting = [
    {
      key: 'price:asc',
      value: 'Price: Lowest to Highest'
    },
    {
      key: 'price:desc',
      value: 'Price: Highest to Lowest'
    },
    {
      key: 'posted-on',
      value: 'Most Recently Listed'
    }
  ];

  protected survey!: any;

  protected filters: FormGroup<BookMarketsFilters> =
    new FormGroup<BookMarketsFilters>({
      tradeable: new FormControl<string>('all'),
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
        this.institutions = []; //this.auth.getAuthCampuses();
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      });

    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
      )
      .subscribe(async (query: any) => {
        this.params = {
          isbn13: query.isbn13,
          ...(query.scope ? { scope: query.scope } : {})
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

    const { state, tradeable, scope } = this.filters.value;
    const params = {
      institutionId: scope,
      isbn13: ISBN.asIsbn13(this.book.isbn13),
      ...(tradeable && ['true', 'false'].includes(tradeable)
        ? { tradeable }
        : {}),
      // ...(sorting &&
      // ['posted-on', 'review', 'price:asc', 'price:desc'].includes(sorting)
      //   ? { sorting }
      //   : {}),
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
    const { state, tradeable, scope } = this.filters.value;
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
        tradeable
        // sorting
      }
    });
  }

  onActionClicked(event: BookPostEvent, item: BookOffer & Likeable) {
    if (ActionEvent.Like === event.type) {
      this.onLikeBookPost(item);
    } else if (ActionEvent.Unlike === event.type) {
      this.onUnlikeBookPost(item);
    }
  }

  onLikeBookPost(item: BookOffer & Likeable) {
    item.isProcessingLike = true;
    this.bookMarketService
      .likeBookPost(+item.bookOfferId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          item.isProcessingLike = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          item.userRefSavedBookOfferId = response.userRefSavedBookOfferId;
        }
      });
  }

  onUnlikeBookPost(item: BookOffer & Likeable) {
    item.isProcessingLike = true;
    this.bookMarketService
      .unlikeBookPost(<number>item.userRefSavedBookOfferId)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {
          item.isProcessingLike = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          item.userRefSavedBookOfferId = null;
        }
      });
  }

  onSurveySelection(selection: boolean | null) {
    setTimeout(() => {
      this.survey = this.surveyService.getAcademicSurveyQuestion();
      console.log(selection, this.survey);
    }, 3000);
  }

  trackBy(index: number, item: BookOffer) {
    return item.bookOfferId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
