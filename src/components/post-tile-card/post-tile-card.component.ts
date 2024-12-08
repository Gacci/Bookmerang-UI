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

import { Unsubscribable } from '../../classes/unsubscribable';

import { AuthService } from '../../services/auth.service';

import { DropdownDirective } from '../../directives/dropdown.directive';
import { ISBN13Pipe } from '../../pipes/isbn13.pipe';

export enum ActionEvent {
  Delete = 1,
  Details = 2,
  Edit = 3,
  Like = 4,
  Share = 5,
  Unlike = 6
}

export interface PostTile {
  bookOfferId: number;
}

export interface PostTileEvent {
  type: ActionEvent;
  post: any;
}

@Component({
  selector: 'post-tile-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DropdownDirective, ISBN13Pipe],
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
  isProcessingEdit!: boolean;

  @Input()
  isProcessingDelete!: boolean;

  @Input()
  isProcessingLike!: boolean;

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

  protected isSelfOwned!: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this.isSelfOwned = this.post.userId === this.auth.getAuthId();
      this.deletePostEnabled = this.post.userId === this.auth.getAuthId();
      this.editPostEnabled = this.post.userId === this.auth.getAuthId();
    }
  }

  onEditBookPost(event: Event) {
    if (!this.isProcessingDelete && !this.isProcessingEdit) {
      this.action.emit({
        post: this.post,
        type: ActionEvent.Edit
      });
    }
  }

  onDeleteBookPost(event: Event) {
    if (!this.isProcessingDelete && !this.isProcessingEdit) {
      this.action.emit({
        post: this.post,
        type: ActionEvent.Delete
      });
    }
  }

  onToggleBookPostLike(event: Event) {
    this.action.emit({
      post: this.post,
      type: this.post.userRefSavedBookOfferId
        ? ActionEvent.Unlike
        : ActionEvent.Like
    });
  }

  onShowBookPostDetails(event: Event) {
    this.action.emit({
      post: this.post,
      type: ActionEvent.Details
    });
  }

  onShareBookPost(event: Event) {
    this.action.emit({
      post: this.post,
      type: ActionEvent.Share
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
