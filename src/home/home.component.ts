import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookMarketService } from '../services/book-market.service';

import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import {
  ActionEvent,
  BookPostCardComponent,
  BookPostEvent
} from '../components/book-post-card/book-post-card.component';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { AuthService } from '../services/auth.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { SurveyService } from '../services/survey.service';

// import { SwiperContainer } from 'swiper/element';
// import { Swiper } from 'swiper';
import { SwiperModule, SwiperOptions } from 'swiper/types';
// import SwiperCore, { Virtual } from 'swiper/modules';

// SwiperCore.Virtual
@Component({
  selector: 'app-home',
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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends InfiniteScrollView<any> {
  private readonly auth = inject(AuthService);

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
    this.params = { scope: <number>this.auth.getPrimarySearchScopeId() };
    this.bookMarketService
      .collections({ institutionId: this.params.scope, sorting: 'price:desc' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        console.log(response);
        this.cheaps = response.data;
      });

    this.onScrollDown();
    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    // this.route.data.pipe(takeUntil(this.unsubscribe$)).subscribe({
    //   next: (resolved: any) => {
    //     this.data = resolved.posts;
    //     this.hasNextPage =
    //       !!this.data?.length && !(this.data?.length % this.pageSize);
    //   }
    // });
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
