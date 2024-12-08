import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { combineLatest, takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookTileCardComponent } from '../components/book-tile-card/book-tile-card.component';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { LoadingOverlayService } from '../services/loading-overlay.service';
import { BookMarketService } from '../services/book-market.service';

import {
  AccordionComponent,
  AccordionViewComponent
} from '../components/accordion/accordion.component';
import { AuthService } from '../services/auth.service';

type BookCollectionFilter = {
  keyword: FormControl<string | null>;
  scope: FormControl<number | null>;
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

  protected institutions: any[] = [];

  protected filters = new FormGroup<BookCollectionFilter>({
    keyword: new FormControl(null),
    scope: new FormControl(null),
    sorting: new FormControl('price:desc')
  });

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ books, institutions }) => {});

    combineLatest([this.route.data, this.route.queryParams])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([resolved, query]: [any, any]) => {
        this.data = resolved.books.data;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);

        this.institutions = this.auth.getAuthCampuses();
        this.filters.patchValue({
          ...(query.keyword ? { keyword: query.keyword } : {}),
          ...(query.scope ? { scope: +query.scope } : {}),
          ...(['price:desc'].includes(query.sorting)
            ? { sorting: query.sorting }
            : {})
        });
      });

    this.filters.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(filters => {
        this.router.navigate(['books', 'collections'], {
          queryParams: filters
        });
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
      institutionId: this.filters.value.scope,
      keyword: this.filters.value.keyword,
      sorting: this.filters.value.sorting,
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
