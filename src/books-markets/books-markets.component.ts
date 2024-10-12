import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { BookMarketService } from '../services/book-market.service';
import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'books-market',
  standalone: true,
  imports: [
    CommonModule,

    BookPostCardComponent,
    BooksPricingComponent,
    NavigationComponent,
    ReactiveFormsModule,
    RouterModule,

    InfiniteScrollDirective
  ],
  templateUrl: './books-markets.component.html',
  styleUrl: './books-markets.component.scss'
})
export class BooksMarketsComponent extends InfiniteScrollView<any> {
  private auth = inject(AuthService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  protected isLoadingMetrics!: boolean;

  protected metrics!: any;

  protected book!: any;

  protected pricingViewState!: boolean;

  protected filters: FormGroup<any> = new FormGroup({
    tradeable: new FormControl('all'),
    state: new FormGroup({
      new: new FormControl(null),
      likeNew: new FormControl(null),
      veryGood: new FormControl(null),
      good: new FormControl(null),
      acceptable: new FormControl(null)
    })
  });

  ngOnInit(): void {
    this.pageNumber += 1;
    this.loadingOverlayService.$isLoading.subscribe({
      next: (isLoadingNext) => (this.isLoadingNext = isLoadingNext)
    });

    this.route.data.subscribe({
      next: (res: any) => {
        this.book = res.book;
        this.data = res.posts;
        this.hasNextPage = !(res.posts?.length % this.pageSize);
      }
    });

    this.route.queryParams.subscribe({
      next: (query: any) => {
        this.params = { ...query };
        this.filters.patchValue({
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
          ...(/^true|false$/.test(query.tradeable)
            ? { tradeable: JSON.parse(query.tradeable) }
            : {})
        });
      }
    });
  }

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const { state, tradeable } = this.params;
    const params = {
      isbn13: this.params.isbn13,
      ...(/^true|false$/.test(tradeable) ? { tradeable } : {}),
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

    this.bookMarketService.search(params).subscribe({
      next: (data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage = data?.length && !(data.length % this.pageSize);
        this.pageNumber += 1;
      },
      error: (e) => {},
      complete: () => {}
    });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  protected onSubmit(e: Event) {
    const { state, tradeable } = this.filters.value;
    console.log(state);
    this.router.navigate(['books', 'markets'], {
      queryParams: {
        isbn13: this.book.isbn13,
        state:
          (state.new ? 1 : 0) +
          (state.likeNew ? 2 : 0) +
          (state.veryGood ? 4 : 0) +
          (state.good ? 8 : 0) +
          (state.acceptable ? 16 : 0),
        ...(/^true|false$/.test(tradeable) ? { tradeable } : {})
      }
    });
  }
}
