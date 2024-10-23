import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookMarketService } from '../services/book-market.service';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    RouterOutlet,
    BookPostCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends InfiniteScrollView<Data> {
  private auth = inject(AuthService);

  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  ngOnInit(): void {
    // this.pageNumber += 1;
    this.onScrollDown();
    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (isLoadingNext) => (this.isLoadingNext = isLoadingNext)
      });

    // this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe({
    //   next: (resolved: any) => {
    //     this.data = resolved.posts;
    //     this.hasNextPage =
    //       !!this.data?.length && !(this.data?.length % this.pageSize);
    //   }
    // });
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

    this.bookMarketService
      .search(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data: any) => {
          this.data = this.data.concat(data);
          this.hasNextPage = !(data.length % this.pageSize);
          this.pageNumber += 1;
        },
        error: (e) => {},
        complete: () => {}
      });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
