// import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { Data, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from "ngx-infinite-scroll";


import { MarketingComponent } from '../components/marketing/marketing.component';
import { NavigationComponent } from '../components/navigation/navigation.component';

import { BookPostOfferService } from '../services/book-post-offer.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    InfiniteScrollDirective,
    // BrowserAnimationsModule,
    // BrowserModule,
    CommonModule,
    // ReactiveFormsModule,
    MarketingComponent,
    NavigationComponent,
    RouterOutlet
  ],
  providers: [
    // provideNgxMask(),
    BookPostOfferService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';

  protected posts: any [] = [];

  protected pageNumber: number = 1;

  protected pageSize: number = 50;

  protected isLoadingNext: boolean = false;

  protected hasNextPage: boolean = true;

  protected params: Data = {};

  constructor(private bookMarketService: BookPostOfferService) {
    setTimeout(() => this.onScrollDown(), 2500)
  }

  onScrollDown() {
    if ( !this.isLoadingNext && this.hasNextPage ) {
      this.search({
        ...this.params,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      });
    }
  }

  onScrollUp() {
    console.log('Scrolling up');
  }

  onSearch(event: Event) {
    this.posts = [];
    this.pageNumber = 1;
    this.params = { 
      keyword: (event.target as HTMLInputElement).value
    };

    this.search(this.params)
  }

  async search(params: Data) {
    this.isLoadingNext = true;
    await this.pause(1000);
    
    return this.bookMarketService.search(params)
      .subscribe({
        next: (data: any) => {
          this.posts = this.posts.concat(data);
          this.hasNextPage = !(data.length % this.pageSize);
          this.pageNumber += 1;
          this.isLoadingNext = false;
        },
        error: (e) => {

        },
        complete: () => {

        }
       });
  }

  async pause(delay: number){
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
