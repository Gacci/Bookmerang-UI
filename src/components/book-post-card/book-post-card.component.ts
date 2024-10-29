import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { ISBN13Pipe } from '../../pipes/isbn13.pipe';
import { DropdownDirective } from '../../directives/dropdown.directive';

import { BookMarketService } from '../../services/book-market.service';
import { AuthService } from '../../services/auth.service';
import { Unsubscribable } from '../../classes/unsubscribable';

export enum ActionEvent {
  Chat = 1,
  Like = 2,
  Unlike = 3
}

export interface BookPostEvent {
  event: Event;
  post: {
    type: ActionEvent;
    data: any;
  };
}

@Component({
  selector: 'book-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownDirective, ISBN13Pipe],
  styleUrl: './book-post-card.component.scss',
  templateUrl: './book-post-card.component.html'
})
export class BookPostCardComponent extends Unsubscribable implements OnDestroy {
  private readonly auth = inject(AuthService);

  private readonly bookMarketService = inject(BookMarketService);

  protected _post!: any;

  protected isProcessingEdit!: boolean;

  protected isProcessingDelete!: boolean;

  protected isProcessingLike!: boolean;

  protected isSelfOwned!: boolean;

  @Input()
  set post(_post: any) {
    this._post = _post;
    this.isSelfOwned = this._post.userId === this.auth.getUserId();
    this.deletePostEnabled = this._post.userId === this.auth.getUserId();
    this.editPostEnabled = this._post.userId === this.auth.getUserId();
    this.likePostEnabled = this._post.userId !== this.auth.getUserId();
    this.userChatEnabled = this._post.userId !== this.auth.getUserId();
  }

  @Input()
  editPostEnabled!: boolean;

  @Input()
  likePostEnabled!: boolean;

  @Input()
  userChatEnabled!: boolean;

  @Input()
  deletePostEnabled!: boolean;

  @Input()
  routerLink!: string | string[];

  @Input()
  queryParams!: any;

  @Input()
  userRouterLink!: string | string[];

  @Input()
  userQueryParams!: any;

  @Output() action: EventEmitter<BookPostEvent> =
    new EventEmitter<BookPostEvent>();

  async onToggleLikeBookPost(event: Event) {
    this._post.savedBookOfferId
      ? this.onUnlikeBookPost(event)
      : this.onLikeBookPost(event);
  }

  async onLikeBookPost(event: Event) {
    if (
      this._post.savedBookOfferId ||
      this.isProcessingDelete ||
      this.isProcessingEdit
    ) {
      return;
    }

    this.isProcessingLike = true;
    this.action.emit({
      event,
      post: { data: this.post, type: ActionEvent.Like }
    });

    await this.pause(3000);
    this.bookMarketService
      .likeBookPost({
        bookOfferId: this._post.bookOfferId,
        userId: this.auth.getUserId()
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this._post.savedBookOfferId = response.savedBookOfferId;
          this.isProcessingLike = false;
        },
        error: (error: any) => {
          console.error('Error saving post:', error);
          this.isProcessingLike = false;
        }
      });
  }

  async onUnlikeBookPost(event: Event) {
    if (
      !this._post.savedBookOfferId ||
      this.isProcessingDelete ||
      this.isProcessingEdit
    ) {
      return;
    }

    this.isProcessingLike = true;
    this.action.emit({
      event,
      post: { data: this.post, type: ActionEvent.Unlike }
    });

    await this.pause(3000);
    this.bookMarketService
      .unlikeBookPost(this._post.savedBookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this._post.savedBookOfferId = null;
          this.isProcessingLike = false;
        },
        error: (error: any) => {
          console.error('Error deleting post:', error);
          this.isProcessingLike = false;
        }
      });
  }

  onMessageSeller(event: Event) {
    this.action.emit({
      event,
      post: { type: ActionEvent.Chat, data: this.post }
    });
  }

  onSharePost(event: Event) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  async pause(timeout: number) {
    await new Promise(resolve => setTimeout(resolve, timeout));
  }
}
