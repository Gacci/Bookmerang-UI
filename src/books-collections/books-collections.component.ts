import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookTileCardComponent } from '../components/book-tile-card/book-tile-card.component';
import { InstitutionsDropdownComponent } from '../components/institutions-dropdown/institutions-dropdown.component';

import { InfiniteScrollView } from '../classes/infinite-scroll-view';

import { LoadingOverlayService } from '../services/loading-overlay.service';
import { BookMarketService } from '../services/book-market.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'books-collection',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InfiniteScrollDirective,
    BookTileCardComponent,
    InstitutionsDropdownComponent
  ],
  templateUrl: './books-collections.component.html',
  styleUrl: './books-collections.component.scss'
})
export class BooksCollectionsComponent extends InfiniteScrollView<any> {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly loadingOverlayService = inject(LoadingOverlayService);

  protected filter = new FormGroup({
    sorting: new FormControl('price:desc'),
    institution: new FormControl(0)
  });

  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: any) => (this.params = { title: params.title }));

    this.loadingOverlayService.$isLoading
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoadingNext => (this.isLoadingNext = isLoadingNext));

    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((resolved: any) => {
        this.data = resolved.books.data;
        this.hasNextPage =
          !!this.data?.length && !(this.data?.length % this.pageSize);
      });
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
      .collections(params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response: any) => {
        this.data = this.data.concat(response.data);
        this.hasNextPage =
          !!this.data.length && !(this.data.length % this.pageSize);
        this.pageNumber += 1;
      });
  }

  override onScrollUp(): void {}

  protected onSubmit(e: Event) {
    const { institution, sorting } = this.filter.value;
    this.router.navigate(['books', 'collections'], {
      queryParams: {
        title: this.params.title,
        ...(institution ? { institution } : {}),
        ...(sorting ? { sorting } : {})
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
