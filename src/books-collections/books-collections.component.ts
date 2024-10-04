import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { BookCollectionService } from '../services/book-collection.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    NavigationComponent,
    RouterModule,
    InfiniteScrollDirective
  ],
  templateUrl: './books-collections.component.html',
  styleUrl: './books-collections.component.scss'
})
export class BooksCollectionsComponent extends InfiniteScrollView<any> {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookCollectionService);

  private loadingOverlayService = inject(LoadingOverlayService);

  ngOnInit(): void {
    this.pageNumber = 1;
    this.route.queryParams.subscribe((params: any) => {
      this.params = { title: params.title };
      this.pageNumber += 1;
    });

    this.loadingOverlayService.$isLoading.subscribe(
      (isLoadingNext) => (this.isLoadingNext = isLoadingNext)
    );

    this.route.data.subscribe((data: any) => (this.data = data.books.data));
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
      next: (response: any) => {
        this.data = this.data.concat(response.data);
        this.hasNextPage = !(this.data.length % this.pageSize);
        this.pageNumber += 1;
        this.isLoadingNext = false;
      },
      error: (e) => {},
      complete: () => {}
    });
  }

  override onScrollUp(): void {}
}
