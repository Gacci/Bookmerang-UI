import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { BookCollectionService } from '../services/book-collection.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { Subject, takeUntil } from 'rxjs';
import { BookMarketService } from '../services/book-market.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule, RouterModule, InfiniteScrollDirective],
  templateUrl: './books-collections.component.html',
  styleUrl: './books-collections.component.scss'
})
export class BooksCollectionsComponent extends InfiniteScrollView<any> {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: any) => (this.params = { title: params.title }));

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resolved: any) => {
        this.data = resolved.books.data;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      });
  }

  override async onScrollDown() {
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

  ngOnDestroy() {
    this.unsubscribe();
  }
}
