import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type ContentType = 'html' | 'text';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'confirm-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-center">
      <div class="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 class="text-xl font-bold text-gray-800 mb-4">{{ title }}</h1>

        <div id="survey-question">
          <!-- Yes/No Question -->
          <div class="mb-6">
            <p class="text-lg text-gray-700" *ngIf="contentType === 'text'">
              {{ content }}
            </p>
            <p
              class="text-lg text-gray-700"
              *ngIf="contentType === 'html'"
              [innerHtml]="content"
            ></p>
            <div class="flex flex-row mt-4 space-x-4">
              <label
                class="flex flex-1 items-center border px-4 py-4 rounded-lg cursor-pointer"
              >
                <input
                  type="radio"
                  name="remote-work"
                  value="true"
                  class="form-radio text-blue-600 h-5 w-5"
                  [(ngModel)]="value"
                  (change)="selection.emit(true)"
                />
                <span class="ml-3 text-gray-700">{{ yesLabel }}</span>
              </label>
              <label
                class="flex flex-1 items-center border px-4 py-4 rounded-lg cursor-pointer"
              >
                <input
                  type="radio"
                  name="remote-work"
                  value="false"
                  class="form-radio text-blue-600 h-5 w-5"
                  [(ngModel)]="value"
                  (change)="selection.emit(false)"
                />
                <span class="ml-3 text-gray-700">{{ noLabel }}</span>
              </label>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" style="width: 20%"></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">{{ note }}</p>
        </div>

        <!-- Next Button -->
        <div class="mt-6 flex justify-between">
          <button
            class="text-gray-500 hover:text-gray-700"
            (click)="selection.emit()"
          >
            Skip
          </button>
          <button
            class="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none"
            (click)="selection.emit()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ConfirmDialogComponent {
  @Output()
  public selection = new EventEmitter<boolean | null>();

  @Input()
  public title!: string;

  @Input()
  public content!: string;

  @Input()
  public yesLabel: string = 'Yes';

  @Input()
  public noLabel: string = 'No';

  @Input()
  public note: string = '';

  @Input()
  public contentType: ContentType = 'text';

  @Input()
  public value!: string | null;
}
