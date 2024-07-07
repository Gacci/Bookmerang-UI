import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from "@angular/forms";

import { InputMaskModule } from '@ngneat/input-mask';
// import { SwiperModule } from 'swiper/angular';

import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    InputMaskModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    RouterOutlet, 
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
