import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { PostTileCardComponent } from '../components/post-tile-card/post-tile-card.component';

import { AuthService } from '../services/auth.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { BookMarketService } from '../services/book-market.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

@Component({
  selector: 'books-favorites',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, PostTileCardComponent],
  templateUrl: './books-favorites.component.html',
  styleUrl: './books-favorites.component.scss'
})
export class BooksFavoritesComponent extends InfiniteScrollView<any> {
  private auth = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  async ngOnInit() {
    this.pageNumber += 1;

    combineLatest([this.route.params, this.route.queryParams])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([params, query]) => {
        console.log('params:', params, 'query:', query);
        this.params = {
          scope: query['scope'],
          userId: params['userId']
        };
      });

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resolved: any) => {
        this.data = resolved.favorites;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      });

    await this.onScrollDown();
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
      .favorites(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        this.data = this.data.concat(response);
        this.hasNextPage =
          !!this.data.length && !(this.data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }
  override onScrollUp(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
