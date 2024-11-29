import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, takeUntil } from 'rxjs';

import {
  CreateHotToastRef,
  HotToastClose,
  HotToastService
} from '@ngneat/hot-toast';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import {
  ActionEvent,
  PostTileCardComponent,
  PostTileEvent
} from '../components/post-tile-card/post-tile-card.component';

import { LoadingOverlayService } from '../services/loading-overlay.service';
import { BookMarketService } from '../services/book-market.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

interface BookOffer {
  bookOfferId: number;
  userId: number;
  isbn13: string;
  notes: string | null;
  tradeable: boolean;
  price: number;
  state: 'NEW' | 'LIKE NEW' | 'VERY GOOD' | 'GOOD' | 'ACCEPTABLE';
  binding: 'BROKEN' | 'DAMAGED' | 'INTACT' | 'WEAK';
  cover:
    | 'CREASED'
    | 'CUT'
    | 'DISCOLORED'
    | 'FADED'
    | 'INTACT'
    | 'RIPPED'
    | 'SCRATCHED'
    | 'STAINED';
  pages:
    | 'CREASED'
    | 'FOLDED'
    | 'INTACT'
    | 'MARKED'
    | 'STAINED'
    | 'TORN'
    | 'WARPED'
    | 'YELLOWED';
  markings: 'EXTENSIVE' | 'HIGHLIGHTER' | 'MINIMAL' | 'NONE' | 'PEN' | 'PENCIL';
  extras: 'ACCESS_CODE' | 'CD';
  postedOn: Date;
  updatedOn: Date;
}

interface Likeable {
  userRefSavedBookOfferId: number;
}

@Component({
  selector: 'books-favorites',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, PostTileCardComponent],
  templateUrl: './books-favorites.component.html',
  styleUrl: './books-favorites.component.scss'
})
export class BooksFavoritesComponent extends InfiniteScrollView<any> {
  @ViewChild('undoRemoveLikeTemplate')
  private undoRemoveLikeTemplate!: TemplateRef<any>;

  private readonly route = inject(ActivatedRoute);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  private readonly alerts = inject(HotToastService);

  private hotToastRef!: CreateHotToastRef<any>;

  ngOnInit() {
    this.pageNumber += 1;

    combineLatest([this.route.params, this.route.queryParams])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([params, query]) => {
        this.params = {
          scope: +query['scope'],
          userId: +params['userId']
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
      .favorites(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        this.data = this.data.concat(response);
        this.hasNextPage =
          !!this.data.length && !(this.data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  override onScrollUp(): void {}

  /**
   * If items state is "Liked" clicking will cause to immeditely remove element from view
   * but request is not sent to server. Instead, the request will be delayed or cancelled.
   * An alert will appear to provide user an action to undo the action (making the element
   * appear back on screen)
   *
   * The proopt will stay for 5 secs, after that time it will disappear and it will send
   * the request to "unlike" the item removed from screen
   *
   * @param event
   * @param item
   * @returns
   */
  onActionClicked(event: PostTileEvent, item: BookOffer & Likeable) {
    if (ActionEvent.Unlike !== event.type) {
      return;
    }

    if (this.hotToastRef) {
      this.hotToastRef.close();
    }

    const indexOfUnliked = this.data.findIndex(
      post => post.bookOfferId === item.bookOfferId
    );
    if (!~indexOfUnliked) {
      return;
    }

    this.hotToastRef = this.alerts.show(this.undoRemoveLikeTemplate, {
      autoClose: true,
      className: 'text-xs',
      data: {
        ...(~indexOfUnliked ? { index: indexOfUnliked } : {}),
        ...(~indexOfUnliked ? this.data[indexOfUnliked] : {}),
        undo: false
      },
      duration: 5000,
      dismissible: true,
      position: 'bottom-center'
    });

    this.data.splice(indexOfUnliked, 1);
    this.hotToastRef.afterClosed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: HotToastClose) => {
        if (!this.hotToastRef.data.undo) {
          this.onUnlikeBookOffer(item);
        }
      });
  }

  undoRemoveLike(e: any) {
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

  trackBy(index: number, item: any) {
    return item.bookOfferId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
