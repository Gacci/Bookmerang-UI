import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../../classes/infinite-scroll-view';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../navigation/navigation.component';

import { BookPostOfferService } from '../../services/book-post-offer.service';



@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    
    BookPostCardComponent,
    LoadingOverlayComponent,
    NavigationComponent,
    
    InfiniteScrollDirective,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent extends InfiniteScrollView<Data>{
  private route = inject(ActivatedRoute);
  
  private bookMarketService = inject(BookPostOfferService);


  ngOnInit(): void {
    this.pageNumber += 1;
    this.route.data.subscribe((data: any) => {
      this.data = data.posts; 
    });
    this.route.params.subscribe((params: any) => {
      this.params = { userId: params.userId };
    });
  }

  onScrollUp() {
    console.log('Scrolling up');
  }

  async onScrollDown() {
    if ( this.isLoadingNext || !this.hasNextPage ) {
      return;
    }

    this.isLoadingNext = true;
    const params = {
      ...this.params,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    await this.pause(1000);
    return this.bookMarketService.search(params)
      .subscribe({
        next: (data: any) => {
          this.data = this.data.concat(data);
          this.hasNextPage = !(data.length % this.pageSize);
          this.pageNumber += 1;
          this.isLoadingNext = false;

          console.log(data);
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
