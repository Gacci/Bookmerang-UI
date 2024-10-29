import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookMarketService } from '../services/book-market.service';

import { ConfirmDialogComponent } from '../components/confirm-dialog.component';
import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { LoadingOverlayService } from '../services/loading-overlay.service';
import { AuthService } from '../services/auth.service';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    RouterOutlet,
    ConfirmDialogComponent,
    BookPostCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends InfiniteScrollView<any> {
  private auth = inject(AuthService);

  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookMarketService);

  private loadingOverlayService = inject(LoadingOverlayService);

  private surveyService = inject(SurveyService);

  protected survey: any = this.surveyService.getAcademicSurveyQuestion();

  ngOnInit(): void {
    // this.pageNumber += 1;
    this.params = { scope: <number>this.auth.getPrimarySearchScopeId() };

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

  override async onScrollDown() {
    if (this.isLoadingNext || !this.hasNextPage) {
      return;
    }

    const params = {
      ...this.params,
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

  onSurveySelection(selection: boolean | null) {
    setTimeout(() => {
      this.survey = this.surveyService.getAcademicSurveyQuestion();
      console.log(selection, this.survey);
    }, 3000);
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
