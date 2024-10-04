import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    BookPostCardComponent,
    NavigationComponent,
    InfiniteScrollDirective
  ],
  templateUrl: './books-inventories.component.html',
  styleUrl: './books-inventories.component.scss'
})
export class BooksInventoriesComponent extends InfiniteScrollView<Data> {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.params.subscribe(
      (params: any) => (this.params = { userId: params.userId })
    );

    this.loadingOverlayService.$isLoading.subscribe(
      (isLoadingNext) => (this.isLoadingNext = isLoadingNext)
    );

    this.route.data.subscribe((data: any) => (this.data = data.posts));
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const params = {
      ...this.params,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.bookMarketService.search(params).subscribe({
      next: (data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage = !(data.length % this.pageSize);
        this.pageNumber += 1;
        this.isLoadingNext = false;
      },
      error: (e) => {},
      complete: () => {}
    });
  }
}
