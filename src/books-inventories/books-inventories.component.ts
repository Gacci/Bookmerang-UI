import {
  Component,
  inject,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';

import {
  CreateHotToastRef,
  HotToastClose,
  HotToastService
} from '@ngneat/hot-toast';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import {
  ActionEvent,
  PostTile,
  PostTileCardComponent,
  PostTileEvent
} from '../components/post-tile-card/post-tile-card.component';

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
  @ViewChild('undoRemoveOfferTemplate')
  private undoRemoveOfferTemplate!: TemplateRef<any>;

  private readonly route = inject(ActivatedRoute);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly alerts = inject(HotToastService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  private hotToastRef!: CreateHotToastRef<any>;

  protected user!: any;

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.params = {
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

  onActionClicked(event: PostTileEvent, item: PostTile) {
    console.log(this.undoRemoveOfferTemplate);
    if (ActionEvent.Delete !== event.type) {
      return;
    }

    if (this.hotToastRef) {
      this.hotToastRef.close();
    }

    const indexOfRemoved = this.data.findIndex(
      post => post.bookOfferId === item.bookOfferId
    );
    if (!~indexOfRemoved) {
      return;
    }

    this.hotToastRef = this.alerts.show(this.undoRemoveOfferTemplate, {
      autoClose: true,
      className: 'text-xs',
      data: {
        ...(~indexOfRemoved ? { index: indexOfRemoved } : {}),
        ...(~indexOfRemoved ? this.data[indexOfRemoved] : {}),
        undo: false
      },
      duration: 5000,
      dismissible: true,
      position: 'bottom-center'
    });

    this.data.splice(indexOfRemoved, 1);
    this.hotToastRef.afterClosed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: HotToastClose) => {
        if (!this.hotToastRef.data.undo) {
          this.bookMarketService
            .remove(item.bookOfferId)
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
      });
  }

  undoRemoveOffer(e: any) {
    this.hotToastRef.data = {
      ...this.hotToastRef.data,
      undo: true
    };

    this.data.splice(e.data.index, 0, e.data);
    this.hotToastRef.close();
  }

  onUnlikeBookOffer(item: any) {
    // await this.pause(3000);
    this.bookMarketService
      .unlikeBookPost(item.userRefSavedBookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          item.userRefSavedBookOfferId = null;
          item.isProcessingLike = false;
        },
        error: (error: any) => {
          item.isProcessingLike = false;
        }
      });
  }

  // onActionClicked(e: PostTileEvent) {
  // console.log(e);
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
  // }

  trackBy(index: number, item: any) {
    return item.bookOfferId;
  }

  ngOnDestroy() {
    const { undo, index, ...item } = this.hotToastRef?.data ?? {};
    if (!undo && !!index) {
      this.onUnlikeBookOffer(item);
    }

    this.unsubscribe();
  }
}
