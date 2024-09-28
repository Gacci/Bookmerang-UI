import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { BookCollectionService } from '../services/book-collection.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,

    LoadingOverlayComponent,
    NavigationComponent,
    RouterModule,

    InfiniteScrollDirective,
  ],
  templateUrl: './books-collections.component.html',
  styleUrl: './books-collections.component.scss',
})
export class BooksCollectionsComponent extends InfiniteScrollView<any> {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookCollectionService);

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.data.subscribe((data: any) => this.data = data.books.data);
    this.route.queryParams.subscribe((params: any) => this.params = { title: params.title });
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
      next: (response: any) => {
        this.data = this.data.concat(response.data);
        this.hasNextPage = !(this.data.length % this.pageSize);
        this.pageNumber += 1;
        this.isLoadingNext = false;

        console.log(this.data);
      },
      error: (e) => {},
      complete: () => {},
    });
  }
  override onScrollUp(): void {}

  async pause(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
