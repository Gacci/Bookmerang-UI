import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { takeUntil } from 'rxjs';

import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
import { StringService } from '../services/string.service';

import { selectionValidator } from '../validators/selection.validator';
import { BookMarketService } from '../services/book-market.service';
import { BookValuatorService } from '../services/book-valuator.service';
import { ImageManagerService } from '../services/image-manager.service';
import { AuthService } from '../services/auth.service';

import { Unsubscribable } from '../classes/unsubscribable';

import { ISBN13Pipe } from '../pipes/isbn13.pipe';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

type FileBox = {
  base64: string;
  duplicate: boolean;
  file: File;
  id: string;
  isTooBig: boolean;
};

@Component({
  selector: 'book-post',
  standalone: true,
  imports: [
    CommonModule,
    NgxTippyModule,
    ReactiveFormsModule,
    RouterModule,
    BooksPricingComponent,
    ISBN13Pipe
  ],
  templateUrl: './book-post.component.html',
  styleUrl: './book-post.component.scss'
})
export class BookPostComponent extends Unsubscribable implements OnDestroy {
  private readonly route = inject(ActivatedRoute);

  private readonly auth = inject(AuthService);

  private readonly bookMarketService = inject(BookMarketService);

  private readonly bookValuator = inject(BookValuatorService);

  // private readonly imageManagerService: ImageManagerService,
  private readonly strings = inject(StringService);

  private pricings: { [key: string]: string }[] = [];

  protected book: any = {};

  protected images: FileBox[] = [];

  protected recommendedSellingPriceRange: any = {};

  protected scope = <number>this.auth.getPrimarySearchScopeId();

  protected institutions: any[] = [];

  protected payload = new FormGroup(
    {
      userId: new FormControl(),
      scope: new FormArray([]),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      state: new FormControl(null, [Validators.required]),
      tradeable: new FormControl<boolean>(false),
      binding: new FormControl('SELECT', [
        selectionValidator({ not: ['SELECT'] })
      ]),
      cover: new FormControl('SELECT', [
        selectionValidator({ not: ['SELECT'] })
      ]),
      pages: new FormControl('SELECT', [
        selectionValidator({ not: ['SELECT'] })
      ]),
      markings: new FormControl('SELECT', [
        selectionValidator({ not: ['SELECT'] })
      ]),
      notes: new FormControl(null, [Validators.required]),
      images: new FormControl(null, [Validators.min(1)]),
      isbn13: new FormControl(null)
    },
    {
      updateOn: 'submit'
    }
  );

  protected readonly tooltip = {
    price:
      "Use the pricing summary and your book's condition to help determine the optimal price for your book.",
    scope:
      'This will determine the "scope" of your post\'s visibility. Your post will be visible on the campuses you select.',
    notes:
      "Add any extra details about your book's charm! Mention highlights, unique features, or quirks—anything that might give it an edge in the buyer's eyes.",
    state:
      'The condition that best matches your book’s current state. Use the descriptions to find the closest fit for accurate pricing and buyer expectations.'
  };

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ book }: any) => {
        this.book = book;
        this.payload.patchValue({
          isbn13: book.isbn13
        });
      });

    this.payload.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: any) => {
        this.updateRecommendedSellingPrice(value);
      });

    this.auth
      .getUserInstitutions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((institutions: any[]) => {
        this.institutions = institutions;
        this.payload.patchValue({
          userId: this.auth.getUserId()
        });

        const scope = <FormArray>this.payload.get('scope');
        institutions.forEach((institution: any) =>
          scope.push(new FormControl(institution.institutionId))
        );
      });
  }

  onInputChange(e: Event) {
    const target = <HTMLInputElement>e.target;
    if (!target.files) {
      return;
    }

    const files: File[] = Array.from(target.files);
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = e => {
        const base64 = <string>e.target?.result;
        this.images.push({
          file,
          base64,
          duplicate: !!this.images.find(
            (box: FileBox) =>
              box.file.size === file.size &&
              box.base64.length === base64.length &&
              box.base64 === base64
          ),
          id: this.strings.getPseudoUUIDv4(),
          isTooBig: file.size > 2 * 1024 * 1024
        });
      };

      reader.readAsDataURL(file);
    }
  }

  onRemoveThumbnail(id: string) {
    this.images = this.images.filter((object: any) => object.id !== id);
  }

  onSubmit(e: Event) {
    this.payload.markAllAsTouched();
    if (this.payload.invalid) {
      return;
    }

    const { images, ...data } = this.payload.value;
    this.bookMarketService
      .create(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          console.log(response);

          // this.imageManagerService
          //   .upload(this.images.map((box: FileBox) => box.file))
          //   .subscribe({
          //     next: (response) => {},
          //     error: () => {},
          //     complete: () => {},
          //   });
        }
      });
  }

  onMetricsLoaded(metrics: any) {
    this.pricings = [].concat(metrics);
  }

  private updateRecommendedSellingPrice(value: any) {
    // console.log('updateRecommendedSellingPrice', this.pricings);
    if (!this.pricings || !value.state) {
      return;
    }

    console.log(
      this.pricings.map((pricing: any) => {
        const bookPricingStats = pricing.metrics.find(
          (metric: any) => metric.state === <string>value.state
        );

        if (!bookPricingStats) {
          return null;
        }

        return {
          ...pricing,
          recommended: this.bookValuator.computeEstimateRange(
            value,
            bookPricingStats.minPrice,
            bookPricingStats.maxPrice
          )
        };
      })
    );
  }

  trackBy(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
