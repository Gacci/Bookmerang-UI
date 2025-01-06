// accordion.component.ts
import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input
} from '@angular/core';

@Component({
  selector: 'accordion-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-t">
      <div
        class="flex justify-between items-center py-5 cursor-pointer"
        (click)="onToggleVisibility($event)"
      >
        <span class="font-semibold text-gray-800 select-none">{{ title }}</span>
        <button type="button" class="text-gray-500">
          <svg
            class="w-3 h-3 shrink-0 transition-transform duration-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
            [class.rotate-180]="!isOpen"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </div>

      <div
        class="overflow-hidden transition-max-height duration-300"
        [class.max-h-0]="!isOpen"
        [class.max-h-[999px]="isOpen"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class AccordionViewComponent {
  @Input()
  title!: string;

  @Input()
  isOpen = false;

  onToggleVisibility(e: Event) {
    this.isOpen = !this.isOpen;
  }
}

@Component({
  selector: 'accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full space-y-2">
      <ng-content></ng-content>
    </div>
  `
})
export class AccordionComponent implements AfterContentInit {
  @ContentChildren(AccordionViewComponent)
  accordionViews!: QueryList<AccordionViewComponent>;

  ngAfterContentInit() {}

  private closeOtherPanels(activeView: AccordionViewComponent) {
    this.accordionViews.forEach(view => {
      if (view !== activeView) {
        view.isOpen = false;
      }
    });
  }
}
