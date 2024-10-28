import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';

import { DialogService } from '@ngneat/dialog';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import {
  BookPostCardComponent,
  BookPostEvent
} from '../components/book-post-card/book-post-card.component';

import { BookOfferEditSheetComponent } from '../components/book-offer-edit-sheet/book-offer-edit-sheet.component';
import { PostTileCardComponent } from '../components/post-tile-card/post-tile-card.component';

import { AuthService } from '../services/auth.service';
import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

@Component({
  selector: 'books-inventory',
  standalone: true,
  imports: [
    CommonModule,
    BookPostCardComponent,
    BookOfferEditSheetComponent,
    RouterModule,
    InfiniteScrollDirective,
    PostTileCardComponent
  ],
  templateUrl: './books-inventories.component.html',
  styleUrl: './books-inventories.component.scss'
})
export class BooksInventoriesComponent
  extends InfiniteScrollView<any>
  implements OnDestroy
{
  private readonly route = inject(ActivatedRoute);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly ngDialogService = inject(DialogService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  protected user!: any;

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: any) => {
        this.params = { userId: params.userId };
      });

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resolved: any) => {
        this.data = resolved.posts;
        this.user = resolved.user;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      });
  }

  override onScrollUp() {
    console.log('Scrolling up');
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
      .search(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage =
          !!this.data?.length && !(data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  onActionClicked(e: BookPostEvent) {
    const bottomSheetRef = this.ngDialogService.open(
      BookOfferEditSheetComponent,
      {}
    );

    bottomSheetRef.afterClosed$.subscribe(result => {
      if (result) {
        console.log('User confirmed:', result);
      } else {
        console.log('User dismissed the bottom sheet.');
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
