// import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketingComponent } from '../components/marketing/marketing.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // BrowserAnimationsModule,
    // BrowserModule,
    CommonModule,
    // ReactiveFormsModule,
    MarketingComponent,
    RouterOutlet,
  ],
  providers: [
    // provideNgxMask(),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
}
