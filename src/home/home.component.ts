import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostOfferService } from '../services/book-post-offer.service';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    RouterOutlet,
    BookPostCardComponent,
    LoadingOverlayComponent,
    NavigationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent extends InfiniteScrollView<Data> {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookPostOfferService);

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.data.subscribe((data: any) => this.data = data.posts);
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
