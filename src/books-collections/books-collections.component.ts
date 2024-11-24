import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntil, tap } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookTileCardComponent } from '../components/book-tile-card/book-tile-card.component';
import { InstitutionsDropdownComponent } from '../components/institutions-dropdown/institutions-dropdown.component';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { LoadingOverlayService } from '../services/loading-overlay.service';
import { BookMarketService } from '../services/book-market.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    BookTileCardComponent,
    InstitutionsDropdownComponent,

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

  protected filters = new FormGroup<BookCollectionFilter>({
    keyword: new FormControl(),
    scope: new FormControl(),
    sorting: new FormControl('price:desc')
  });

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((query: any) => {
        this.filters.patchValue({
          ...(query.keyword ? { keyword: query.keyword } : {}),
          ...(query.scope
            ? { scope: +query.scope }
            : { scope: this.auth.getPrimarySearchScopeId() }),
          ...(['price:desc'].includes(query.sorting)
            ? { sorting: query.sorting }
            : {})
        });
      });

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ books }) => {
        this.data = books.data;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      });
  }

  override onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const params = {
      institutionId: this.filters.value.scope,
      keyword: this.filters.value.keyword,
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

  protected onSubmit(e: Event) {
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
