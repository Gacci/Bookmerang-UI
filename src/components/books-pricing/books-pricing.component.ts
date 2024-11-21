import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  inject,
  OnDestroy,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { takeUntil } from 'rxjs';

import { BookMarketService } from '../../services/book-market.service';

import { Unsubscribable } from '../../classes/unsubscribable';

import * as ISBN from 'isbn3';

@Component({
  selector: 'books-pricing',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './books-pricing.component.html',
  styleUrl: './books-pricing.component.scss'
})
export class BooksPricingComponent
  extends Unsubscribable
  implements OnInit, OnChanges, OnDestroy
{
  private bookMarketService = inject(BookMarketService);

  @Input()
  scope!: number;

  @Input()
  isbn13!: string;

  @Output()
  protected loaded: EventEmitter<any> = new EventEmitter<any>();

  protected loading: boolean = true;

  protected data!: any;

  ngOnInit() {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scope'] || changes['isbn13']) {
      this.load();
    }
  }

  private load() {
    this.loading = true;
    this.data = {};
    
    this.bookMarketService
      .metrics({ scope: this.scope, isbn13: ISBN.asIsbn13(this.isbn13) })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([data]) => {
        if ( data ) {
          const minPrice = Math.min(
            ...data.metrics
              ?.filter((metric: any) => !!metric.total)
              .map((metric: any) => metric.minPrice)
          );
          const maxPrice = Math.max(
            ...data.metrics
              ?.filter((metric: any) => !!metric.total)
              .map((metric: any) => metric.maxPrice)
          );
          const total = data.metrics?.reduce(
            (sum: number, metric: any) => sum + metric.total,
            0
          );
          const tradeables = data.metrics?.reduce(
            (sum: number, metric: any) => sum + metric.tradeable,
            0
          );
  
          this.data = {
            ...data,
            ...(total ? { range: this.getPriceRange(minPrice, maxPrice) } : {}),
            minPrice,
            maxPrice,
            total,
            tradeables,
            metrics: data.metrics?.map((metric: any) => ({
              ...metric,
              ...(metric.total
                ? {
                    range: this.getPriceRange(metric.minPrice, metric.maxPrice)
                  }
                : {}),
              state: metric.state.replace('_', ' ')
            }))
          };
        }

        this.loading = false;
        this.loaded.emit(data);
      });
  }

  private getPriceRange(minPrice: number, maxPrice: number) {
    return minPrice !== maxPrice
      ? 'from $' +
          [
            ...(minPrice ? [minPrice.toFixed(2)] : []),
            ...(maxPrice ? [maxPrice.toFixed(2)] : [])
          ].join(' - $')
      : 'from $' + minPrice;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
