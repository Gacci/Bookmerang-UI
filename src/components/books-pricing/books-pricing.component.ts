import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  inject
} from '@angular/core';

import { BookMarketService } from '../../services/book-market.service';

import { Swiper, SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';

import * as ISBN from 'isbn3';
import { Subject, takeUntil } from 'rxjs';
import { Unsubscribable } from '../../classes/unsubscribable';

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
  implements OnInit, OnDestroy
{
  @ViewChild('swiper', { read: ElementRef<SwiperContainer> })
  private swiperRefElem!: ElementRef<SwiperContainer>;

  private swiper!: Swiper;

  private bookMarketService = inject(BookMarketService);

  private cdr = inject(ChangeDetectorRef);

  @Input()
  scope!: number;

  @Input()
  isbn13!: string;

  @Output()
  protected loaded: EventEmitter<any> = new EventEmitter<any>();

  protected groups: any = {};

  protected selectedSlideObject: any = {};

  protected config: SwiperOptions = {
    autoHeight: true
  };

  protected loading: boolean = true;

  ngOnInit() {
    console.log(this.scope, this.isbn13);
    this.bookMarketService
      .metrics({ scope: this.scope, isbn13: ISBN.asIsbn13(this.isbn13) })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((groups: any) => {
        this.groups = groups.map((group: any) => ({
          ...group,
          tradeables: group.metrics.reduce(
            (sum: number, metrics: any) => (sum += metrics.tradeable),
            0
          ),
          metrics: group.metrics.map((metric: any) => ({
            ...metric,
            ...(metric.total
              ? metric.minPrice !== metric.maxPrice
                ? {
                    range:
                      'from $' +
                      [
                        ...(metric.minPrice
                          ? [metric.minPrice.toFixed(2)]
                          : []),
                        ...(metric.maxPrice ? [metric.maxPrice.toFixed(2)] : [])
                      ].join(' to $')
                  }
                : { range: 'from $' + metric.minPrice }
              : {}),
            state: metric.state.replace('_', ' ')
          }))
        }));

        this.loading = false;
        this.loaded.emit(groups);

        this.cdr.detectChanges();
        this.selectedSlideObject = this.groups.find(() => true);

        if (!this.swiperRefElem) {
          return;
        }

        this.swiper = <Swiper>(
          (<unknown>this.swiperRefElem.nativeElement.swiper)
        );

        this.swiper.on('slideChange', (swiper: Swiper) => {
          this.selectedSlideObject = this.groups[swiper.activeIndex];
          this.cdr.detectChanges();
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
