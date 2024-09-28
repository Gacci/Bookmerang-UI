import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { BookPostOfferService } from '../services/book-post-offer.service';



@Component({
  selector: 'books-market',
  standalone: true,
  imports: [
    CommonModule,

    BookPostCardComponent,
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

  private bookMarketService = inject(BookPostOfferService);

  protected isLoadingMetrics: boolean = true;

  protected metrics: any = { trade: {}, sale: [] };

  protected book: any = {};

  protected filters: FormGroup<any> = new FormGroup({
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
    this.route.data.subscribe((data: any) => {
      this.data = data.posts;
      this.book = data.book;
    });

    const order = ['NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE'];
    this.route.params.subscribe((params: any) => {
      
      this.params = { isbn13: params.isbn13 };
      this.bookMarketService.metrics(params.isbn13)
        .subscribe((metrics: any) => {
          this.metrics.sale = metrics
            .sort(
              (a: any, b: any) =>
                order.indexOf(a.state) - order.indexOf(b.state),
            )
            .map((metric: any) => ({
              ...metric,
              state: metric.state
                ?.split('_')
                .map(
                  (word: string) =>
                    word.charAt(0) + word.slice(1).toLowerCase(),
                )
                .join(' '),
              range:
                'from $' +
                [
                  ...(metric._min ? [metric._min] : []),
                  ...(metric._max ? [metric._max] : []),
                ].join(' to $'),
            }));

            console.log('BookMetrics.params: ', params);
          // console.log('Metrics: ', this.metrics);
        });
    });

    this.route.queryParams.subscribe({
      next: (query: any) => {
        console.log('BooksMarkets.QueryParams: ', query);
        this.filters.patchValue({
          state: {
            new: query.state.includes('NEW'),
            likeNew: query.state.includes('LIKE_NEW'),
            veryGood: query.state.includes('VERY_GOOD'),
            good: query.state.includes('GOOD'),
            acceptable: query.state.includes('ACCEPTABLE')
          }
        });
      }
    })
  }

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    this.isLoadingNext = true;
    const params = {
      ...this.params,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    await this.pause(1000);
    this.bookMarketService.search(params).subscribe({
      next: (data: any) => {
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
    const body = {
      state: [
        ...(state.new ? [ 'NEW' ] : []),
        ...(state.likeNew ? [ 'LIKE_NEW' ] : []),
        ...(state.veryGood ? [ 'VERY_GOOD' ] : []),
        ...(state.good ? [ 'GOOD' ] : []),
        ...(state.acceptable ? [ 'ACCEPTABLE' ] : []),
      ]
    };

    console.log(this.book, body, [ '/', 'books', 'markets', this.book.isbn13 ]);
    this.router.navigate([ 'books', 'markets', this.book.isbn13 ], { queryParams: body })
  }
}
