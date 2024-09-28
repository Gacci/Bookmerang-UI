import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookPostOfferService } from '../services/book-post-offer.service';

@Component({
  selector: 'app-book-post',
  standalone: true,
  imports: [],
  templateUrl: './book-post.component.html',
  styleUrl: './book-post.component.scss'
})
export class BookPostComponent {
  private route = inject(ActivatedRoute);

  private bookMarketService = inject(BookPostOfferService);

  private book:any = {};

  protected metrics: any = { trade: {}, sale: [] };

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => this.book = data.book);

    const order = ['NEW', 'LIKE_NEW', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE'];
    this.route.params.subscribe((params: any) => {
      
      this.bookMarketService.metrics(params.isbn13)
        .subscribe((metrics: any) => {
          this.metrics.sale = metrics
            .sort(
              (a: any, b: any) =>
                order.indexOf(a.state) - order.indexOf(b.state),
            )
            .map((metric: any) => ({
              ...metric,
              state: metric.state
                ?.split('_')
                .map(
                  (word: string) =>
                    word.charAt(0) + word.slice(1).toLowerCase(),
                )
                .join(' '),
              range:
                'from $' +
                [
                  ...(metric._min ? [metric._min] : []),
                  ...(metric._max ? [metric._max] : []),
                ].join(' to $'),
            }));

            console.log('BookMetrics.params: ', params);
          // console.log('Metrics: ', this.metrics);
        });
    });
  }
}
