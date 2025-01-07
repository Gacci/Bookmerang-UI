import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

import * as Hash from 'crypto-hash';


type BookCollectionFilter = {
  keyword: FormControl<string | null>;
  sorting: FormControl<string | null>;
};

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
    InfiniteScrollDirective
  ],
  templateUrl: './books-collections.component.html',
  styleUrl: './books-collections.component.scss'
})
export class BooksCollectionsComponent extends InfiniteScrollView<any> {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  protected filtersHashChanged!: boolean;

  protected filtersHashedValue!: string;

  protected filters = new FormGroup<BookCollectionFilter>({
    keyword: new FormControl(null),
    sorting: new FormControl(null)
  });

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ books, institutions }) => {});

    combineLatest([this.route.data, this.route.queryParams])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async ([resolved, query]: [any, any]) => {
        this.data = resolved.books.data;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);

        this.filters.patchValue({
          ...(query.keyword ? { keyword: query.keyword } : {}),
          ...(['price:asc'].includes(query.sorting)
            ? { sorting: query.sorting }
            : { sorting: 'price:asc' })
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

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));
  }

  override onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const params = {
      ...this.filters.value,
      institutionId: this.auth.getAuthScopeId(),
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

  onSubmit(e: Event) {
    this.router.navigate(['books', 'collections'], {
      queryParams: this.filters.value
    });
  }

  trackBy(index: number, item: any) {
    return item.isbn13;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
