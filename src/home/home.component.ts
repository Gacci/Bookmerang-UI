import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AboutComponent } from '../about/about.component';
import { FeedsComponent } from '../feeds/feeds.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, AboutComponent, FeedsComponent],
  template: `
    <feeds *ngIf="auth.isAuthenticated()"></feeds>
    <about *ngIf="!auth.isAuthenticated()"></about>
  `,
  styles: []
})
export class HomeComponent {
  protected readonly auth = inject(AuthService);
}
