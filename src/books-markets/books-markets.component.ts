import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { BookMarketService } from '../services/book-market.service';
import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';

@Component({
  selector: 'books-market',
  standalone: true,
  imports: [
    CommonModule,

    BookPostCardComponent,
    BooksPricingComponent,
    LoadingOverlayComponent,
    NavigationComponent,
    ReactiveFormsModule,
    RouterModule,

    InfiniteScrollDirective,
  ],
  templateUrl: './books-markets.component.html',
  styleUrl: './books-markets.component.scss',
})
export class BooksMarketsComponent extends InfiniteScrollView<any> {
  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private bookMarketService = inject(BookMarketService);

  protected isLoadingMetrics!: boolean;

  protected metrics!: any;

  protected book!: any;

  protected pricingViewState!: boolean;

  protected filters: FormGroup<any> = new FormGroup({
    state: new FormGroup({
      new: new FormControl(false),
      likeNew: new FormControl(false),
      veryGood: new FormControl(false),
      good: new FormControl(false),
      acceptable: new FormControl(false),
    }),
  });

  ngOnInit(): void {
    // this.book = {};
    // this.isLoadingMetrics = true;
    // this.metrics = { trade: {}, sale: [] };
    // this.pageNumber += 1;


    this.route.data.subscribe((data: any) => {
      this.book = data.book;
      this.data = data.posts;
      this.hasNextPage = !(data.posts?.length % this.pageSize);
    });

    this.route.queryParams.subscribe({
      next: (query: any) => {
        console.log('BooksMarkets.QueryParams: ', query);
        this.params = { isbn13: query.isbn13 };
        this.filters.patchValue(
          query.state
            ? {
                state: {
                  new: query.state.includes('NEW'),
                  likeNew: query.state.includes('LIKE_NEW'),
                  veryGood: query.state.includes('VERY_GOOD'),
                  good: query.state.includes('GOOD'),
                  acceptable: query.state.includes('ACCEPTABLE'),
                },
              }
            : {},
        );
      },
    });
  }

  override async onScrollDown() {
    const params = {
      ...this.params,
      state: this.filters.value.state
      ? [
          ...(this.filters.value.state.new ? ['NEW'] : []),
          ...(this.filters.value.state.likeNew ? ['LIKE_NEW'] : []),
          ...(this.filters.value.state.veryGood ? ['VERY_GOOD'] : []),
          ...(this.filters.value.state.good ? ['GOOD'] : []),
          ...(this.filters.value.state.acceptable ? ['ACCEPTABLE'] : []),
        ]
      : [],
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    console.log(this);
  
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

  
    this.isLoadingNext = true;


    await this.pause(1000);
    this.bookMarketService.search(params).subscribe({
      next: (data: any) => {
        console.log(data.length % this.pageSize);
        this.data = this.data.concat(data);
        this.hasNextPage = !(data.length % this.pageSize);
        this.pageNumber += 1;
        this.isLoadingNext = false;

        console.log(data);
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  async pause(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  protected onSubmit(e: Event) {
    const { state } = this.filters.value;
    console.log('STATE: ', state);
    const body = {
      state: state
        ? [
            ...(state.new ? ['NEW'] : []),
            ...(state.likeNew ? ['LIKE_NEW'] : []),
            ...(state.veryGood ? ['VERY_GOOD'] : []),
            ...(state.good ? ['GOOD'] : []),
            ...(state.acceptable ? ['ACCEPTABLE'] : []),
          ]
        : [],
    };

    console.log(this.book, body, [
      '/',
      'books',
      'markets',
      this.book.isbn13,
    ]);
    this.router.navigate(['books', 'markets'], {
      queryParams: { ...body, isbn13: this.book.isbn13 },
    });
  }
}
