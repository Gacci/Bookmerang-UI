import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { combineLatest, takeUntil } from 'rxjs';

import { DialogService } from '@ngneat/dialog';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { BookPostEvent } from '../components/book-post-card/book-post-card.component';

import { BookOfferEditSheetComponent } from '../components/book-offer-edit-sheet/book-offer-edit-sheet.component';
import { ActionEvent, PostTileCardComponent, PostTileEvent } from '../components/post-tile-card/post-tile-card.component';

import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

@Component({
  selector: 'books-inventory',
  standalone: true,
  imports: [
    CommonModule,
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
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([params, query]) => {
        this.params = {
          institutionId: query['scope'],
          userId: params['userId']
        };
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
      .search(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage =
          !!this.data?.length && !(data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  onActionClicked(e: PostTileEvent) {
    console.log(e);
    // const bottomSheetRef = this.ngDialogService.open(
    //   BookOfferEditSheetComponent,
    //   {}
    // );

    // bottomSheetRef.afterClosed$.subscribe(result => {
    //   if (result) {
    //     console.log('User confirmed:', result);
    //   } else {
    //     console.log('User dismissed the bottom sheet.');
    //   }
    // });

    /*
    if ( ActionEvent.Edit === e.type ) {
      this.bookMarketService
        .update(e.post)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response: any) => {
            // this.isProcessingEdit = false;
          },
          error: (error: any) => {
            // this.isProcessingEdit = false;
          }
        });
    }
    else if ( ActionEvent.Delete === e.type ) {
      this.bookMarketService
        .remove(e.post.bookOfferId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response: any) => {
            // this.isProcessingDelete = false;
          },
          error: (error: any) => {
            // this.isProcessingDelete = false;
          }
        });
    }
        */
  }

  trackBy(index: number, item: any) {
    return item.bookOfferId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
