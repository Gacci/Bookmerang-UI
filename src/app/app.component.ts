// import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // BrowserAnimationsModule, 
    // BrowserModule,
    CommonModule, 
    // ReactiveFormsModule,
    RouterOutlet, 
  ],
  providers: [
    // provideNgxMask(),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
