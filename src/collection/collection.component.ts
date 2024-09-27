import { Component, inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { BookPostCardComponent } from '../components/book-post-card/book-post-card.component';
import { InfiniteScrollView } from '../classes/infinite-scroll-view';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { NavigationComponent } from '../components/navigation/navigation.component';


@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [
    CommonModule,
    
    LoadingOverlayComponent,
    NavigationComponent,
    
    InfiniteScrollDirective,
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss'
})
export class CollectionComponent extends InfiniteScrollView<any> {
  override onScrollDown(): void {

  }
  override onScrollUp(): void {

  }
}
