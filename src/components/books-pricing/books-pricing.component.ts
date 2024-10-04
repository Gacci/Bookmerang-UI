import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BookMarketService } from '../../services/book-market.service';

@Component({
  selector: 'books-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books-pricing.component.html',
  styleUrl: './books-pricing.component.scss'
})
export class BooksPricingComponent implements OnInit {
  @Input()
  isbn13!: string;

  @Output()
  protected loaded: EventEmitter<any> = new EventEmitter<any>();

  protected metrics: any = { trade: {}, sale: [] };

  protected loading: boolean = true;

  constructor(private bookMarketService: BookMarketService) {}

  ngOnInit() {
    this.bookMarketService.metrics(this.isbn13).subscribe((metrics: any) => {
      this.metrics.sale = metrics.map((metric: any) => ({
        ...metric,
        state: metric.state.replace('_', ' '),
        range:
          'from $' +
          [
            ...(metric._min ? [metric._min] : []),
            ...(metric._max ? [metric._max] : [])
          ].join(' to $')
      }));

      this.metrics.trade = metrics.reduce(
        (count: number, metric: any) => (count += metric._count),
        0
      );

      this.loaded.emit(metrics);
      this.loading = false;

      // console.log('BookMetrics.params: ', metrics, this.metrics);
      // console.log('Metrics: ', this.metrics);
    });
  }
}
