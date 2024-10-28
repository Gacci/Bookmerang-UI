import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Unsubscribable } from '../../classes/unsubscribable';

@Component({
  selector: 'book-tile-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-tile-card.component.html',
  styleUrl: './book-tile-card.component.scss'
})
export class BookTileCardComponent extends Unsubscribable {
  @Input()
  book!: any;
}
