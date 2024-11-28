import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Unsubscribable } from '../../classes/unsubscribable';
import { ISBN13Pipe } from '../../pipes/isbn13.pipe';

@Component({
  selector: 'book-tile-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ISBN13Pipe],
  templateUrl: './book-tile-card.component.html',
  styleUrl: './book-tile-card.component.scss'
})
export class BookTileCardComponent extends Unsubscribable {
  @Input()
  book!: any;

  @Input()
  query!: any;

  @Input()
  link!: string | string[];
}
