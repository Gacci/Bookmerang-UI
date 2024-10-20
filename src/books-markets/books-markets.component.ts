import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { AuthService } from '../services/auth.service';
import { ISBN13Pipe } from '../pipes/isbn13.pipe';

import ISO6391 from 'iso-639-1';
import * as ISBN from 'isbn3';
import * as Hash from 'crypto-hash';
import { Subject, takeUntil } from 'rxjs';

console.log(Hash);
@Component({
  selector: 'books-market',
  standalone: true,
  imports: [
    CommonModule,

    BookPostCardComponent,
    BooksPricingComponent,
    ISBN13Pipe,
    ReactiveFormsModule,
    RouterModule,

    InfiniteScrollDirective
  ],
  templateUrl: './books-markets.component.html',
  styleUrl: './books-markets.component.scss'
})
export class BooksMarketsComponent extends InfiniteScrollView<any> implements OnDestroy {  
  private route = inject(ActivatedRoute);

  private router = inject(Router);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  private filtersHashedValue!: string;

  protected filtersHashChanged!: boolean;

  protected isLoadingMetrics!: boolean;

  protected metrics!: any;

  protected book!: any;

  protected pricingViewState!: boolean;

  protected filters: FormGroup<any> = new FormGroup({
    tradeable: new FormControl('all'),
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
    this.loadingOverlayService.$isLoading.subscribe({
      next: (isLoadingNext) => (this.isLoadingNext = isLoadingNext)
    });

    this.route.data.subscribe({
      next: (resolved: any) => {
        this.data = resolved.posts;
        this.book = {
          ...resolved.book,
          language: ISO6391.getName(resolved.book.language) 
            ?? resolved.book.language
        };
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      }
    });

    this.route.queryParams.subscribe({
      next: async (query: any) => {
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
          ...(/^true|false$/.test(query.tradeable)
            ? { tradeable: JSON.parse(query.tradeable) }
            : {})
        };

        this.filters.patchValue(patch);
        this.filtersHashedValue = await Hash.sha256(JSON.stringify(this.filters.value));
        console.log(this.filters.value, patch);
      }
    });

    this.filters.valueChanges.subscribe((async(filter: any) => {
      this.filtersHashChanged = this.filtersHashedValue !== await Hash.sha256(JSON.stringify(this.filters.value));
    }))
  }

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const { state, tradeable } = this.params;
    const params = {
      isbn13: ISBN.asIsbn13(this.params.isbn13),
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

    this.bookMarketService.search(params)      
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: any) => {
      this.data = this.data.concat(data);
      this.hasNextPage = !!this.data?.length && !(data.length % this.pageSize);
      this.pageNumber += 1;
    });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  protected onSubmit(e: Event) {
    const { state, tradeable } = this.filters.value;
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
        ...(/^true|false$/.test(tradeable) ? { tradeable } : {})
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
