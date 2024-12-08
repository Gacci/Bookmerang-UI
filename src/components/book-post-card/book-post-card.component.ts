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

import { ISBN13Pipe } from '../../pipes/isbn13.pipe';

import { AuthService } from '../../services/auth.service';
import { Unsubscribable } from '../../classes/unsubscribable';

export enum ActionEvent {
  Like = 1,
  Message = 2,
  Share = 3,
  Unlike = 4
}

export interface BookPostEvent {
  type: ActionEvent;
  data: any;
}

@Component({
  selector: 'book-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ISBN13Pipe],
  styleUrl: './book-post-card.component.scss',
  templateUrl: './book-post-card.component.html'
})
export class BookPostCardComponent extends Unsubscribable implements OnDestroy {
  private readonly auth = inject(AuthService);

  protected _post!: any;

  protected isSelfOwned!: boolean;

  @Input()
  set post(_post: any) {
    this._post = _post;
    this.isSelfOwned = this._post.userId === this.auth.getAuthId();
    this.deletePostEnabled = this._post.userId === this.auth.getAuthId();
    this.editPostEnabled = this._post.userId === this.auth.getAuthId();
    this.likePostEnabled = this._post.userId !== this.auth.getAuthId();
    this.userChatEnabled = this._post.userId !== this.auth.getAuthId();
  }

  @Input()
  isProcessingEdit!: boolean;

  @Input()
  isProcessingDelete!: boolean;

  @Input()
  isProcessingLike!: boolean;

  @Input()
  editPostEnabled!: boolean;

  @Input()
  likePostEnabled!: boolean;

  @Input()
  userChatEnabled!: boolean;

  @Input()
  deletePostEnabled!: boolean;

  @Input()
  link!: string | string[];

  @Input()
  query!: any;

  @Input()
  userRouterLink!: string | string[];

  @Input()
  userQueryParams!: any;

  @Output() action: EventEmitter<BookPostEvent> =
    new EventEmitter<BookPostEvent>();

  async onToggleLikeBookPost(event: Event) {
    if (!this.isProcessingEdit && !this.isProcessingDelete) {
      this.action.emit({
        data: this.post,
        type: this._post.userRefSavedBookOfferId
          ? ActionEvent.Unlike
          : ActionEvent.Like
      });
    }
  }

  onMessageSeller(event: Event) {
    this.action.emit({
      type: ActionEvent.Message,
      data: this.post
    });
  }

  onSharePost(event: Event) {
    this.action.emit({
      type: ActionEvent.Share,
      data: this.post
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
