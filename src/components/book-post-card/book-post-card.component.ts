import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'book-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrl: './book-post-card.component.scss',
  templateUrl: './book-post-card.component.html',
})
export class BookPostCardComponent {
  @Input()
  post!: any;
}
