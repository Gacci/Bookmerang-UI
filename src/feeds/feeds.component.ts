import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import {
  ActionEvent,
  BookPostCardComponent,
  BookPostEvent
} from '../components/book-post-card/book-post-card.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

import { AuthService } from '../services/auth.service';
import { BookMarketService } from '../services/book-market.service';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { SurveyService } from '../services/survey.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'feeds',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    RouterModule,
    ConfirmDialogComponent,
    BookPostCardComponent
    // BookTileCardComponent
  ],
  templateUrl: './feeds.component.html',
  styleUrl: './feeds.component.scss'
})
export class FeedsComponent extends InfiniteScrollView<any> {
  private readonly auth = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  private readonly surveyService = inject(SurveyService);

  protected cheaps: any[] = [];

  protected survey: any = this.surveyService.getAcademicSurveyQuestion();

  // protected SwiperModules: SwiperModule[] = [ Virtual ];

  protected config: SwiperOptions = {
    // slidesPerView: 3,
    // spaceBetween: 50,
    // navigation: true,
    // pagination: { clickable: true },
    // scrollbar: { draggable: true },
  };

  ngOnInit(): void {
    // this.pageNumber += 1;
    this.params = { scope: <number>this.auth.getPrimaryScope() };
    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    /*
    this.bookMarketService
      .search({ institutionId: this.params.scope, sorting: 'price:desc' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        console.log(response);
        this.cheaps = response.data;
      });

    */

    this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (resolved: any) => {
        this.data = resolved.posts;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      }
    });

    // this.onScrollDown();
  }

  override onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const params = {
      institutionId: this.params.scope,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.bookMarketService
      .search(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.data = this.data.concat(data);
        this.hasNextPage = !!this.data.length && !(data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  override onScrollUp() {
    console.log('Scrolling up');
  }

  onActionClicked(event: BookPostEvent, item: any) {
    if (ActionEvent.Like === event.type) {
      this.onLikeBookPost(item);
    } else if (ActionEvent.Unlike === event.type) {
      this.onUnlikeBookPost(item);
    }
  }

  onLikeBookPost(item: any) {
    item.isProcessingLike = true;
    this.bookMarketService
      .likeBookPost(item.bookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          item.savedBookOfferId = response.savedBookOfferId;
          item.isProcessingLike = false;
        },
        error: (error: any) => {
          item.isProcessingLike = false;
        }
      });
  }

  onUnlikeBookPost(item: any) {
    this.bookMarketService
      .unlikeBookPost(item.savedBookOfferId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: any) => {
          item.savedBookOfferId = null;
          item.isProcessingLike = false;
        },
        error: (error: any) => {
          item.isProcessingLike = false;
        }
      });
  }

  onSurveySelection(selection: boolean | null) {
    setTimeout(() => {
      this.survey = this.surveyService.getAcademicSurveyQuestion();
      console.log(selection, this.survey);
    }, 3000);
  }

  trackBy(index: number, item: any) {
    return item.bookOfferId;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
