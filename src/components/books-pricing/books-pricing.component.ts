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
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { BookMarketService } from '../../services/book-market.service';

import { Swiper, SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';

import * as ISBN from 'isbn3';

@Component({
  selector: 'books-pricing',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule],
  templateUrl: './books-pricing.component.html',
  styleUrl: './books-pricing.component.scss'
})
export class BooksPricingComponent implements OnInit {
  @ViewChild('swiper', { read: ElementRef<SwiperContainer> })
  swiperRefElem!: ElementRef<SwiperContainer>;

  private swiper!: Swiper;

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

  constructor(
    private bookMarketService: BookMarketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.bookMarketService
      .metrics(ISBN.asIsbn13(this.isbn13))
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
                        ...(metric.minPrice ? [metric.minPrice] : []),
                        ...(metric.maxPrice ? [metric.maxPrice] : [])
                      ].join(' to $')
                  }
                : { range: 'from $' + metric.minPrice }
              : {}),
            state: metric.state.replace('_', ' ')
          }))
        }));
        console.log(this.groups);

        this.loading = false;

        this.loaded.emit(groups);
        this.cdr.detectChanges();

        this.swiper = <Swiper>(
          (<unknown>this.swiperRefElem.nativeElement.swiper)
        );
        this.swiper.update();

        this.selectedSlideObject = this.groups.find(() => true);
        console.log(this.selectedSlideObject);
        this.swiper.on('slideChange', (swiper: Swiper) => {
          this.selectedSlideObject = this.groups[swiper.activeIndex];

          console.log(this.selectedSlideObject);
          this.cdr.detectChanges();
        });
      });
  }
}
