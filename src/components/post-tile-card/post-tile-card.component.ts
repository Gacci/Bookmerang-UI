import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { Unsubscribable } from '../../classes/unsubscribable';

import { AuthService } from '../../services/auth.service';
import { BookMarketService } from '../../services/book-market.service';

import { DropdownDirective } from '../../directives/dropdown.directive';

export enum ActionEvent {
  Edit = 1,
  Delete = 2,
  Like = 3,
  Details = 4,
  Share = 5
}

export interface PostTileEvent {
  event: Event;
  post: {
    type: ActionEvent;
    data: any;
  };
}

@Component({
  selector: 'post-tile-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownDirective],
  templateUrl: './post-tile-card.component.html',
  styleUrl: './post-tile-card.component.scss'
})
export class PostTileCardComponent extends Unsubscribable {
  @HostBinding('class')
  className = 'relative';

  @Input()
  set post(_post: any) {
    this._post = _post;
    this.isSelfOwned = this._post.userId === this.auth.getUserId();
    this.deletePostEnabled = this._post.userId === this.auth.getUserId();
    this.editPostEnabled = this._post.userId === this.auth.getUserId();
  }

  @Input()
  deletePostEnabled!: boolean;

  @Input()
  editPostEnabled!: boolean;

  @Input()
  likePostEnabled!: boolean;

  @Input()
  routerLink!: string | string[];

  @Input()
  queryParams!: any;

  @Output()
  action: EventEmitter<PostTileEvent> = new EventEmitter<PostTileEvent>();

  private readonly auth = inject(AuthService);

  private readonly bookMarketService = inject(BookMarketService);

  protected isProcessingEdit!: boolean;

  protected isProcessingDelete!: boolean;

  protected isProcessingLike!: boolean;

  protected isSelfOwned!: boolean;

  protected _post!: any;

  onEditBookPost(event: Event) {
    if (this.isProcessingDelete || this.isProcessingEdit) {
      return;
    }

    this.isProcessingEdit = true;
    this.action.emit({
      event,
      post: { data: this.post, type: ActionEvent.Edit }
    });

    this.bookMarketService
      .update(this._post)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.isProcessingEdit = false;
        },
        error: (error: any) => {
          console.error('Error deleting post:', error);
          this.isProcessingEdit = false;
        }
      });
  }

  onDeleteBookPost(event: Event) {
    if (this.isProcessingDelete || this.isProcessingEdit) {
      return;
    }

    this.isProcessingDelete = true;
    this.action.emit({
      event,
      post: { type: ActionEvent.Delete, data: this.post }
    });

    this.bookMarketService
      .remove(this._post.bookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.isProcessingDelete = false;
        },
        error: (error: any) => {
          console.error('Error deleting post:', error);
          this.isProcessingDelete = false;
        }
      });
  }

  onToggleBookPostLike(event: Event) {
    this.action.emit({
      event,
      post: { type: ActionEvent.Delete, data: this.post }
    });
  }

  onShowBookPostDetails(event: Event) {
    this.action.emit({
      event,
      post: { type: ActionEvent.Details, data: this.post }
    });
  }

  onShareBookPost(event: Event) {
    this.action.emit({
      event,
      post: { type: ActionEvent.Share, data: this.post }
    });
  }
}
