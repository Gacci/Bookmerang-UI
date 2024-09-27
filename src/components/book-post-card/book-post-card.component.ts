import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'book-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: `
    .post-card {
      @apply relative block w-128 mx-auto my-8 shadow-md bg-white rounded-md;
    }
    .post-card-header {
      @apply px-4 py-2;
    }
    .post-card-user-pic {
      @apply w-11 h-11 rounded-full;
    }
    .post-card-user-name {
      @apply font-bold text-gray-700 text-ellipsis whitespace-nowrap overflow-hidden;
    }
    .post-card-main {
      @apply flex items-center justify-between space-x-2;
    }
    .post-card-titling {
      @apply grow pr-4;
    }
    .post-card-titling *,
    .post-card-info * {
      @apply block;
    }
    .post-card-info {
      @apply flex justify-between items-center p-4 border-b;

      .post-card-info-left {
        @apply flex space-x-2;
      }

      .post-card-price {
        @apply font-bold text-green-600;
      }
      .post-card-type {
        @apply font-bold text-gray-600 whitespace-nowrap;
      }
    }
    .post-card-body {
      @apply border-y overflow-hidden;
    }
    .post-card-book {
      @apply w-64 mx-auto my-10;

      .post-card-book-title {
        @apply block leading-5 font-medium text-blue-700;
      }
      .post-card-book-isbn {
        @apply block my-1;
      }
    }
    .post-card-book-cover-box {
      @apply relative block z-0 aspect-2/3;

      .post-card-book-cover {
        @apply absolute top-0 left-0 w-full h-full;
      }
      &:hover {
        @apply opacity-75;
      }
    }
    .post-card-chat {
      @apply p-2 bg-gray-100 rounded-full;

      &:hover {
        @apply bg-gray-200;
      }
    }
    .post-card-footer {
      @apply px-8 py-4;
    }
    .post-card-desc {
      @apply text-gray-500;
    }
  `,
  template: `
    <div class="post-card">
      <div class="post-card-header">
        <div class="post-card-main">
          <img
            class="post-card-user-pic"
            src="https://pictures.abebooks.com/isbn/9780745647791-us.jpg"
          />
          <div class="post-card-titling">
            <a
              class="post-card-user-name"
              [routerLink]="['/', 'books', 'inventories', post.userId]"
              >{{ post.user.firstName }} {{ post.user.lastName }}</a
            >
            <span class="post-card-date-time">{{
              post.postedOn | date: 'MMM d, Y HH:mm'
            }}</span>
          </div>
        </div>
      </div>
      <div class="post-card-body">
        <div class="post-card-book">
          <a
            class="post-card-book-cover-box"
            [routerLink]="['/', 'books', 'markets', post.book.isbn13]"
          >
            <img class="post-card-book-cover" [src]="post.book.thumbnail" />
          </a>
          <a
            class="post-card-book-title"
            [routerLink]="['/', 'books', 'markets', post.book.isbn13]"
            >{{ post.book.title }} {{ post.book.subtitle }}</a
          >
          <span class="post-card-book-isbn">{{ post.book.isbn13 }}</span>
        </div>
      </div>
      <div class="post-card-info">
        <div class="post-card-info-left">
          <span class="post-card-price">{{
            post.price | currency: 'USD'
          }}</span>
          <span class="post-card-type">{{ post.state }}</span>
        </div>
        <div class="post-card-info-right">
          <button class="post-card-chat">
            <svg
              class="size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="post-card-footer">
        <p class="post-card-desc" *ngIf="post.notes">
          {{ post.notes }}
        </p>
      </div>
    </div>
  `,
})
export class BookPostCardComponent {
  @Input()
  post!: any;
}
