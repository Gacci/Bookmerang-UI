import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { combineLatest, takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookTileCardComponent } from '../components/book-tile-card/book-tile-card.component';
import {
  AccordionComponent,
  AccordionViewComponent
} from '../components/accordion/accordion.component';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { AuthService } from '../services/auth.service';
import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

import { NgxPopperjsModule, NgxPopperjsPlacements } from 'ngx-popperjs';

@Component({
  selector: 'books-collection',
  standalone: true,
  imports: [
    AccordionComponent,
    AccordionViewComponent,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    BookTileCardComponent,
    InfiniteScrollDirective,
    NgxPopperjsModule
  ],
  templateUrl: './books-collections.component.html',
  styleUrl: './books-collections.component.scss'
})
export class BooksCollectionsComponent extends InfiniteScrollView<any> {
  private readonly auth = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  protected readonly placement = NgxPopperjsPlacements.BOTTOMEND;

  protected readonly sorting = [
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
    },
    {
      key: 'authors:asc',
      value: 'Authors: A - Z'
    },
    {
      key: 'authors:desc',
      value: 'Authors: Z - A'
    }
  ];

  protected sortByText!: string;

  ngOnInit(): void {
    this.pageNumber += 1;

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    combineLatest([this.route.data, this.route.queryParams])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async ([resolved, query]: [any, any]) => {
        this.data = resolved.books.data;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);

        const sortKeyValues = Object.fromEntries(
          this.sorting.map(o => [o.key, o.value])
        );

        this.params = {
          ...(query.keyword ? { keyword: query.keyword } : {}),
          ...(query.sorting in sortKeyValues
            ? { sorting: query.sorting }
            : { sorting: 'price:asc' })
        };

        this.sortByText = sortKeyValues[this.params.sorting];
      });
  }

  override onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const params = {
      ...this.params,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.bookMarketService
      .collections(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        this.data = this.data.concat(response.data);
        this.hasNextPage =
          !!this.data.length && !(this.data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  override onScrollUp(): void {}

  trackBy(index: number, item: any) {
    return item.isbn13;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
