import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';


import { BookMarketService } from '../../services/book-market.service';

import { Unsubscribable } from '../../classes/unsubscribable';

import * as ISBN from 'isbn3';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";

@Component({
  selector: 'book-offers-metrics',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingOverlayComponent
],
  template: `
    <ng-container *ngIf="loading">
      <div class="mx-auto w-full max-w-sm p-4">  <div class="flex animate-pulse space-x-4">    <div class="flex-1 space-y-6 py-1">      <div class="h-2 rounded bg-gray-200"></div>      <div class="space-y-3">        <div class="grid grid-cols-3 gap-4">          <div class="col-span-2 h-2 rounded bg-gray-200"></div>          <div class="col-span-1 h-2 rounded bg-gray-200"></div>        </div>        <div class="h-2 rounded bg-gray-200"></div>      </div>    </div>  </div></div>  
    </ng-container>

    <ng-container *ngIf="!loading && !!metrics">
        <div class="flex flex-wrap items-center border border-gray-300 rounded-lg"
        >
          <div class="w-full p-3">
              <div class="flex flex-row justify-between">
                <a
                  class="flex justify-between text-sm"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{ isbn13: isbn13, state: 1 }"
                >
                  <div class="space-x-1">
                    <strong>({{ metrics.new.total }}) New</strong>
                    <span *ngIf="metrics.new.total" class="text-blue-600">
                      from {{ metrics.new.range }}
                    </span>
                  </div>
                </a>

                <a
                *ngIf="metrics.new.tradeable"
                  class="flex items-center space-x-1"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{
                    isbn13: isbn13,
                    state: 1,
                    tradeable: true
                  }"
                >
                <label class="text-sm text-green-500 cursor-pointer">
                  {{ metrics.new.tradeable }} for trade
                </label>

                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        fill="#80D25B"
                        d="M42.1561026,48.217237 C50.904695,48.217237 59.3530187,39.6818331 59.3530187,30.9332407 C59.3530187,22.1846483 45.1894084,-1.74228695 45.1894084,-1.74228695 C45.1894084,-1.74228695 28.1191741,20.3680678 27.0857195,29.7665352 C26.0522649,39.1650025 33.4075102,48.217237 42.1561026,48.217237 Z"
                        transform="rotate(36 43.17 23.237)"
                      />
                      <path
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="3"
                        d="M49.7607359,15.8672252 C49.7607359,15.8672252 35.1835686,24.8145106 29.8825517,41.2933444 C24.5815349,57.7721783 8.88191352,55.9007026 8.88191352,55.9007026"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="41.946 36.659 32.202 36.245 27.486 27.936"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="44.938 27.965 38.294 26.606 36.16 21.188"
                      />
                    </g>
                  </svg>
                </a>
              </div>

            <span class="text-sm">
              Perfect condition, as if just purchased.
            </span>
          </div>

          <div class="w-full flex flex-col flex-grow items-stretch lg:flex-row">
            <div
              class="w-full border-t border-gray-300 p-3 lg:border-r lg:w-1/2"
            >
              <div class="flex flex-col justify-between md:flex-row xl:flex-col">
                <a
                  class="flex justify-between text-sm"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{ isbn13: isbn13, state: 2 }"
                >
                  <div class="space-x-1">
                    <strong>({{ metrics.like_new.total }}) Like New</strong>
                    <span *ngIf="metrics.like_new.total" class="text-blue-600">
                      from {{ metrics.like_new.range }}
                    </span>
                  </div>
                </a>

                <a
                *ngIf="metrics.like_new.tradeable"
                  class="flex items-center space-x-1"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{
                    isbn13: isbn13,
                    state: 2,
                    tradeable: true
                  }"
                >
                <label class="text-sm text-green-500 cursor-pointer">
                  {{ metrics.like_new.tradeable }} for trade
                </label>

                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        fill="#80D25B"
                        d="M42.1561026,48.217237 C50.904695,48.217237 59.3530187,39.6818331 59.3530187,30.9332407 C59.3530187,22.1846483 45.1894084,-1.74228695 45.1894084,-1.74228695 C45.1894084,-1.74228695 28.1191741,20.3680678 27.0857195,29.7665352 C26.0522649,39.1650025 33.4075102,48.217237 42.1561026,48.217237 Z"
                        transform="rotate(36 43.17 23.237)"
                      />
                      <path
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="3"
                        d="M49.7607359,15.8672252 C49.7607359,15.8672252 35.1835686,24.8145106 29.8825517,41.2933444 C24.5815349,57.7721783 8.88191352,55.9007026 8.88191352,55.9007026"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="41.946 36.659 32.202 36.245 27.486 27.936"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="44.938 27.965 38.294 26.606 36.16 21.188"
                      />
                    </g>
                  </svg>
                </a>
              </div>

              <span class="text-sm">Minimal wear, barely used.</span>
            </div>
            <div class="w-full border-t border-gray-300 p-3 lg:w-1/2">
              <div class="flex flex-col justify-between md:flex-row xl:flex-col">
                <a
                  class="flex justify-between text-sm"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{ isbn13: isbn13, state: 4 }"
                >
                  <div class="space-x-1">
                    <strong>({{ metrics.very_good.total }}) Very Good</strong>
                    <span *ngIf="metrics.very_good.total" class="text-blue-600">
                      from {{ metrics.very_good.range }}
                    </span>
                  </div>
                </a>

                <a
                *ngIf="metrics.very_good.tradeable"
                  class="flex items-center space-x-1"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{
                    isbn13: isbn13,
                    state: 4,
                    tradeable: true
                  }"
                >
                <label class="text-sm text-green-500 cursor-pointer">
                  {{metrics.very_good.tradeable}} for trade
                </label>

                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        fill="#80D25B"
                        d="M42.1561026,48.217237 C50.904695,48.217237 59.3530187,39.6818331 59.3530187,30.9332407 C59.3530187,22.1846483 45.1894084,-1.74228695 45.1894084,-1.74228695 C45.1894084,-1.74228695 28.1191741,20.3680678 27.0857195,29.7665352 C26.0522649,39.1650025 33.4075102,48.217237 42.1561026,48.217237 Z"
                        transform="rotate(36 43.17 23.237)"
                      />
                      <path
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="3"
                        d="M49.7607359,15.8672252 C49.7607359,15.8672252 35.1835686,24.8145106 29.8825517,41.2933444 C24.5815349,57.7721783 8.88191352,55.9007026 8.88191352,55.9007026"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="41.946 36.659 32.202 36.245 27.486 27.936"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="44.938 27.965 38.294 26.606 36.16 21.188"
                      />
                    </g>
                  </svg>
                </a>
              </div>

              <span class="text-sm">
                Minor signs of use, but overall excellent.
              </span>
            </div>
          </div>

          <div class="w-full flex flex-col flex-grow items-stretch lg:flex-row">
            <div
              class="w-full border-t border-gray-300 p-3 lg:border-r lg:w-1/2"
            >
              <div class="flex flex-col justify-between md:flex-row xl:flex-col">
                <a
                  class="flex justify-between text-sm"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{ isbn13: isbn13, state: 8 }"
                >
                  <div class="space-x-1">
                    <strong>({{metrics.good.total}}) New</strong>
                    <span *ngIf="metrics.good.total" class="text-blue-600">
                    from {{metrics.good.range}}
                    </span>
                  </div>
                </a>

                <a
                *ngIf="metrics.good.tradeable"
                  class="flex items-center space-x-1"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{
                    isbn13: isbn13,
                    state: 8,
                    tradeable: true
                  }"
                >
                <label class="text-sm text-green-500 cursor-pointer">
                  {{metrics.good.tradeable}} for trade
                </label>

                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        fill="#80D25B"
                        d="M42.1561026,48.217237 C50.904695,48.217237 59.3530187,39.6818331 59.3530187,30.9332407 C59.3530187,22.1846483 45.1894084,-1.74228695 45.1894084,-1.74228695 C45.1894084,-1.74228695 28.1191741,20.3680678 27.0857195,29.7665352 C26.0522649,39.1650025 33.4075102,48.217237 42.1561026,48.217237 Z"
                        transform="rotate(36 43.17 23.237)"
                      />
                      <path
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="3"
                        d="M49.7607359,15.8672252 C49.7607359,15.8672252 35.1835686,24.8145106 29.8825517,41.2933444 C24.5815349,57.7721783 8.88191352,55.9007026 8.88191352,55.9007026"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="41.946 36.659 32.202 36.245 27.486 27.936"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="44.938 27.965 38.294 26.606 36.16 21.188"
                      />
                    </g>
                  </svg>
                </a>
              </div>

              <span class="text-sm">
                Noticeable wear but still in decent shape.
              </span>
            </div>

            <!-- Acceptable -->
            <div class="w-full border-t border-gray-300 p-3 lg:w-1/2">
              <div class="flex flex-col justify-between md:flex-row xl:flex-col">
                <a
                  class="flex justify-between text-sm"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{ isbn13: isbn13, state: 16 }"
                >
                  <div class="space-x-1">
                    <strong>({{metrics.acceptable.total}}) Acceptable</strong>
                    <span *ngIf="metrics.acceptable.total" class="text-blue-600">
                      from {{metrics.acceptable.range}}
                    </span>
                  </div>
                </a>

                <a
                  *ngIf="metrics.acceptable.tradeable"
                  class="flex items-center space-x-1"
                  [routerLink]="['/', 'books', 'markets']"
                  [queryParams]="{
                    isbn13: isbn13,
                    state: 16,
                    tradeable: true
                  }"
                >
                <label class="text-sm text-green-500 cursor-pointer">
                  {{metrics.acceptable.tradeable}} for trade
                </label>

                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        fill="#80D25B"
                        d="M42.1561026,48.217237 C50.904695,48.217237 59.3530187,39.6818331 59.3530187,30.9332407 C59.3530187,22.1846483 45.1894084,-1.74228695 45.1894084,-1.74228695 C45.1894084,-1.74228695 28.1191741,20.3680678 27.0857195,29.7665352 C26.0522649,39.1650025 33.4075102,48.217237 42.1561026,48.217237 Z"
                        transform="rotate(36 43.17 23.237)"
                      />
                      <path
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="3"
                        d="M49.7607359,15.8672252 C49.7607359,15.8672252 35.1835686,24.8145106 29.8825517,41.2933444 C24.5815349,57.7721783 8.88191352,55.9007026 8.88191352,55.9007026"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="41.946 36.659 32.202 36.245 27.486 27.936"
                      />
                      <polyline
                        stroke="#22BA8E"
                        stroke-linecap="round"
                        stroke-width="2"
                        points="44.938 27.965 38.294 26.606 36.16 21.188"
                      />
                    </g>
                  </svg>
                </a>
              </div>

              <span class="text-sm">
                Noticeable wear, fully functional, may have flaws.
              </span>
            </div>
          </div>
        </div>
    </ng-container>
  `,
  styles: []
})
export class BookOffersMetricsComponent extends Unsubscribable implements OnInit {

  private readonly bookMarketService = inject(BookMarketService);
  
  protected loading!: boolean;

  @Input()
    metrics: any;

  @Input()
    scope!: number;

  @Input()
    isbn13!: string;

  ngOnInit() {
    this.loading = true;
    this.bookMarketService.metrics({
      isbn13: ISBN.asIsbn13(this.isbn13),
      ...(this.scope ? { scope: this.scope } : {})
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((response: any) => {
      this.metrics = Object.fromEntries(
        response.metrics.map((metric: any) => [
          metric.state.toLowerCase(),
          metric
        ])
      );

      console.log(this.metrics)
    });
  }
}
