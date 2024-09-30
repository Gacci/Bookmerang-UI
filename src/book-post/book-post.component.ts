import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NavigationComponent } from '../components/navigation/navigation.component';
import { LoadingOverlayComponent } from '../components/loading-overlay/loading-overlay.component';
import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
import { StringService } from '../services/string.service';

import { selectionValidator } from '../validators/selection.validator';

type TempPreviewFile = File & {
  data: string;
  duplicate: boolean;
  id: string;
  isTooBig: boolean;
  name: string;
};

@Component({
  selector: 'app-book-post',
  standalone: true,
  imports: [
    BooksPricingComponent,
    CommonModule,
    LoadingOverlayComponent,
    NavigationComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './book-post.component.html',
  styleUrl: './book-post.component.scss',
})
export class BookPostComponent {
  protected book: any = {};

  protected selectedBase64Images: Array<TempPreviewFile> = [];

  protected recommendedSellingPriceRange: any = {};

  private metrics: any = {};

  protected payload = new FormGroup({
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    state: new FormControl(null, [Validators.required]),
    tradeable: new FormControl(0),
    binding: new FormControl('SELECT', [selectionValidator({ not: ['SELECT'] })]),
    cover: new FormControl('SELECT', [selectionValidator({ not: ['SELECT'] })]),
    pages: new FormControl('SELECT', [selectionValidator({ not: ['SELECT'] })]),
    markings: new FormControl('SELECT', [selectionValidator({ not: ['SELECT'] })]),
    notes: new FormControl(null, [Validators.required]),
    images: new FormControl(null, [Validators.min(1)]),
  });

  constructor(
    private route: ActivatedRoute,
    private strings: StringService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => (this.book = data.book));

    this.payload.controls.state
      .valueChanges.subscribe(this.updateRecommendedSellingPrice.bind(this));

    this.payload.controls.binding
      .valueChanges.subscribe(this.updateRecommendedSellingPrice.bind(this));

    this.payload.controls.cover
      .valueChanges.subscribe(this.updateRecommendedSellingPrice.bind(this));

    this.payload.controls.pages
      .valueChanges.subscribe(this.updateRecommendedSellingPrice.bind(this));

    this.payload.controls.markings
      .valueChanges.subscribe(this.updateRecommendedSellingPrice.bind(this));
  }


  onInputChange(e: Event) {
    const target = <HTMLInputElement>e.target;
    if (!target.files) {
      return;
    }

    const files: File[] = Array.from(target.files);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = <string>e.target?.result;
        this.selectedBase64Images.push({
          ...file,
          data: base64,
          duplicate: !!this.selectedBase64Images.find(
            (filex: TempPreviewFile) =>
              filex.size === file.size &&
              filex.data.length === base64.length &&
              filex.data === base64,
          ),
          id: this.strings.getPseudoUUIDv4(),
          isTooBig: file.size > 2 * 1024 * 1024,
        });
      };

      reader.readAsDataURL(file);
    }
  }

  onRemoveThumbnail(id: string) {
    this.selectedBase64Images = this.selectedBase64Images.filter(
      (object: any) => object.id !== id,
    );
  }

  onSubmit(e: Event) {
    console.log(this.payload.value);
  }

  trackBy(index: number, item: any) {
    return item.id;
  }

  onMetricsLoaded(metrics: any) {
    this.metrics = metrics.reduce((groups: any, metric: any) => ({
      ...groups,
      [metric.state]: metric
    }), {});

    console.log(
      metrics.map((metric: any) => metric.state + ': ' + metric._min + ' - ' + metric._max)
    );
  }



  private updateRecommendedSellingPrice(value: string | null) {
    console.log(value, this.metrics);

    const state = this.payload.value.state ?? '';

    const pricing = this.metrics[state];
    this.recommendedSellingPriceRange = 
      this.createPriceRange(this.payload.value, pricing._min, pricing._max);

    console.log(this.recommendedSellingPriceRange)
  }

  private createPriceRange(item: any, minPrice: number | null, maxPrice: number | null) {
      const adjustments: any = {
          // Base adjustments for each state
          state: {
              NEW: 0.5, // Increase by 50%
              LIKE_NEW: 0.3, // Increase by 30%
              VERY_GOOD: 0.2, // Increase by 20%
              GOOD: 0.1, // Increase by 10%
              ACCEPTABLE: 0, // No increase
          },
          // Additional adjustments for binding
          binding: {
              INTACT: 0, // No change
              WEAK: -0.05, // Decrease by 5%
              DAMAGED: -0.1, // Decrease by 10%
              BROKEN: -0.2, // Decrease by 20%
          },
          // Additional adjustments for cover condition
          cover: {
              INTACT: 0, // No change
              FADED: -0.05, // Decrease by 5%
              CREASED: -0.1, // Decrease by 10%
              RIPPED: -0.15, // Decrease by 15%
              DISCOLORED: -0.1, // Decrease by 10%
              SCRATCHED: -0.05, // Decrease by 5%
              CUT: -0.1, // Decrease by 10%
              STAINED: -0.15, // Decrease by 15%
          },
          // Additional adjustments for pages condition
          pages: {
              INTACT: 0, // No change
              YELLOWED: -0.05, // Decrease by 5%
              MARKED: -0.1, // Decrease by 10%
              FOLDED: -0.1, // Decrease by 10%
              CREASED: -0.1, // Decrease by 10%
              TORN: -0.15, // Decrease by 15%
              WARPED: -0.1, // Decrease by 10%
              STAINED: -0.15, // Decrease by 15%
          },
          // Additional adjustments for markings
          markings: {
              NONE: 0, // No change
              MINIMAL: -0.05, // Decrease by 5%
              PENCIL: -0.1, // Decrease by 10%
              HIGHLIGHTER: -0.1, // Decrease by 10%
              PEN: -0.15, // Decrease by 15%
              EXTENSIVE: -0.2, // Decrease by 20%
          },
          // Additional adjustments for extras
          extras: {
              ACCESS_CODE: 0.05, // Increase by 5%
              CD: 0.05, // Increase by 5%
          },
      };

      // Calculate total adjustment factor based on characteristics
      const totalAdjustment: number =
          (adjustments.state[item.state] ?? 0) +
          (adjustments.binding[item.binding] ?? 0) +
          (adjustments.cover[item.cover] ?? 0) +
          (adjustments.pages[item.pages] ?? 0) +
          (adjustments.markings[item.markings] || 0);// +
          // item.extras.reduce(
          //     (sum: number, extra: string) => (sum += adjustments.extras[extra] ?? 0),
          //     0
          // );

      // Calculate the final price based on available price information
      let calculatedPrice;
      if (minPrice !== null && maxPrice !== null) {
          // Both prices are available
          const minAdjusted = minPrice * (1 + totalAdjustment);
          const maxAdjusted = maxPrice * (1 + totalAdjustment);
          calculatedPrice = {
              minPrice: parseFloat(minAdjusted.toFixed(2)), // Round min price to two decimal places
              maxPrice: parseFloat(maxAdjusted.toFixed(2)), // Round max price to two decimal places
          };
      } else if (minPrice !== null) {
          // Only min price is available
          calculatedPrice = {
              minPrice: parseFloat(minPrice.toFixed(2)), // Round min price to two decimal places
              maxPrice: minPrice * (1 + totalAdjustment), // Calculate max based on min
          };
      } else if (maxPrice !== null) {
          // Only max price is available
          calculatedPrice = {
              minPrice: maxPrice * (1 + totalAdjustment), // Calculate min based on max
              maxPrice: parseFloat(maxPrice.toFixed(2)), // Round max price to two decimal places
          };
      } else {
          // If neither min nor max price is provided
          return {
              minPrice: null,
              maxPrice: null,
          };
      }

      return calculatedPrice;
  }

}
