import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { BookPostOfferService } from '../services/book-post-offer.service';

@Component({
  selector: 'app-books-market',
  standalone: true,
  imports: [
    CommonModule,

    BookPostCardComponent,
    LoadingOverlayComponent,
    NavigationComponent,

    InfiniteScrollDirective,
  ],
  templateUrl: './books-markets.component.html',
  styleUrl: './books-markets.component.scss',
})
export class BooksMarketsComponent extends InfiniteScrollView<any> {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookPostOfferService);

  protected metrics: any = {};

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.data.subscribe((data: any) => {
      this.data = data.posts;
    });
    this.route.params.subscribe((params: any) => {
      this.params = { isbn13: params.isbn13 };
      this.bookMarketService.metrics(params.isbn13)
        .subscribe({
          next: (metrics: any) => {
            this.metrics = metrics.map((metric: any) => ({
              ...metric,
              range: 'from $' + [
                ...(metric._min ? [ metric._min ] : []), 
                ...(metric._max ? [ metric._max ] : [])
              ].join(' to $')
            }));

            console.log('Metrics: ', this.metrics);
          },
          error: (e) => {

          },
          complete: () => {

          }
        });
    });
  }

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    this.isLoadingNext = true;
    const params = {
      ...this.params,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };

    await this.pause(1000);
    this.bookMarketService.search(params).subscribe({
      next: (data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage = !(data.length % this.pageSize);
        this.pageNumber += 1;
        this.isLoadingNext = false;

        console.log(data);
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  async pause(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
