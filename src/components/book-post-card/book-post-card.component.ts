import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'book-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrl: './book-post-card.component.scss',
  templateUrl: './book-post-card.component.html'
})
export class BookPostCardComponent {
  @Input()
    post!: any;

  @Input()
    listBookCtrl!: boolean;

  @Input()
    userChatCtrl!: boolean;

  @Input()
    editPostCtrl!: boolean;

  
  @Output()
    action: EventEmitter<any> = new EventEmitter<any>();


  showMenuOptions(e: Event) {
    this.action.emit({ e });
  }
}
