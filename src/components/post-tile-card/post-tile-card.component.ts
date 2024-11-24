import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { Unsubscribable } from '../../classes/unsubscribable';

import { AuthService } from '../../services/auth.service';
import { BookMarketService } from '../../services/book-market.service';

import { DropdownDirective } from '../../directives/dropdown.directive';

export enum ActionEvent {
  Delete = 1,
  Details = 2,
  Edit = 3,
  Like = 4,
  Share = 5,
  Unlike = 6
}

export interface PostTileEvent {
  type: ActionEvent;
  data: any;
}

@Component({
  selector: 'post-tile-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownDirective],
  templateUrl: './post-tile-card.component.html',
  styleUrl: './post-tile-card.component.scss'
})
export class PostTileCardComponent
  extends Unsubscribable
  implements OnChanges, OnDestroy
{
  @HostBinding('class')
  className = 'relative';

  @Input()
  post!: any;

  @Input()
  deletePostEnabled!: boolean;

  @Input()
  editPostEnabled!: boolean;

  @Input()
  likePostEnabled!: boolean;

  @Input()
  link!: string | string[];

  @Input()
  query!: any;

  @Output()
  action: EventEmitter<PostTileEvent> = new EventEmitter<PostTileEvent>();

  private readonly auth = inject(AuthService);

  private readonly bookMarketService = inject(BookMarketService);

  protected isProcessingEdit!: boolean;

  protected isProcessingDelete!: boolean;

  protected isProcessingLike!: boolean;

  protected isSelfOwned!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this.isSelfOwned = this.post.userId === this.auth.getUserId();
      this.deletePostEnabled = this.post.userId === this.auth.getUserId();
      this.editPostEnabled = this.post.userId === this.auth.getUserId();
    }
  }

  onEditBookPost(event: Event) {
    if (this.isProcessingDelete || this.isProcessingEdit) {
      return;
    }

    this.isProcessingEdit = true;
    this.action.emit({
      type: ActionEvent.Edit,
      data: this.post
    });

    this.bookMarketService
      .update(this.post)
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
      type: ActionEvent.Delete,
      data: this.post
    });

    this.bookMarketService
      .remove(this.post.bookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          this.isProcessingDelete = false;
        },
        error: (error: any) => {
          this.isProcessingDelete = false;
        }
      });
  }

  onToggleBookPostLike(event: Event) {
    this.action.emit({
      data: this.post,
      type: this.post.userRefSavedBookOfferId
        ? ActionEvent.Unlike
        : ActionEvent.Like
    });
  }

  onShowBookPostDetails(event: Event) {
    this.action.emit({
      data: this.post,
      type: ActionEvent.Details
    });
  }

  onShareBookPost(event: Event) {
    this.action.emit({
      data: this.post,
      type: ActionEvent.Share
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
