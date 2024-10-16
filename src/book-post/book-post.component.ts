import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { NavigationComponent } from '../components/navigation/navigation.component';
import { BooksPricingComponent } from '../components/books-pricing/books-pricing.component';
import { StringService } from '../services/string.service';

import { selectionValidator } from '../validators/selection.validator';
import { BookMarketService } from '../services/book-market.service';
import { BookValuatorService } from '../services/book-valuator.service';
import { ImageManagerService } from '../services/image-manager.service';
import { AuthService } from '../services/auth.service';

import { ISBN13Pipe } from '../pipes/isbn13.pipe';

import ISO6391 from 'iso-639-1';

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
    BooksPricingComponent,
    CommonModule,
    ISBN13Pipe,
    NavigationComponent,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './book-post.component.html',
  styleUrl: './book-post.component.scss'
})
export class BookPostComponent {
  protected book: any = {};

  protected images: FileBox[] = [];

  protected recommendedSellingPriceRange: any = {};

  private pricings: { [key: string]: string }[] = [];

  protected payload = new FormGroup({
    price: new FormControl<number>(99, [Validators.required, Validators.min(1)]),
    state: new FormControl('LIKE_NEW', [Validators.required]),
    tradeable: new FormControl<boolean>(false),
    binding: new FormControl('INTACT', [selectionValidator({ not: ['SELECT'] })]),
    cover: new FormControl('INTACT', [selectionValidator({ not: ['SELECT'] })]),
    pages: new FormControl('INTACT', [selectionValidator({ not: ['SELECT'] })]),
    markings: new FormControl('NONE', [selectionValidator({ not: ['SELECT'] })]),
    notes: new FormControl(null, [Validators.required]),
    images: new FormControl(null, [Validators.min(1)]),
    isbn13: new FormControl(null)
  });

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private bookMarketService: BookMarketService,
    private bookValuator: BookValuatorService,
    // private imageManagerService: ImageManagerService,
    private strings: StringService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.book = {
        ...data.book,
        language: ISO6391.getName(data.book.language) ?? data.book.language
      };

      this.payload.patchValue({
        isbn13: this.book.isbn13
      });
    });

    this.payload.valueChanges.subscribe((value: any) => {
      console.log(value);
      this.updateRecommendedSellingPrice(value);
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
      reader.onload = (e) => {
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
    const { images, ...data } = this.payload.value;

    // const token = this.auth.getJwtToken();
    this.bookMarketService.create(data).subscribe({
      next: (response) => {
        console.log(response);

        // this.imageManagerService
        //   .upload(this.images.map((box: FileBox) => box.file))
        //   .subscribe({
        //     next: (response) => {},
        //     error: () => {},
        //     complete: () => {},
        //   });
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {}
    });
  }

  trackBy(index: number, item: any) {
    return item.id;
  }

  onMetricsLoaded(metrics: any) {
    this.pricings = [].concat(metrics);
  }

  private updateRecommendedSellingPrice(value: any) {
    console.log('updateRecommendedSellingPrice', this.pricings);
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
}
