import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styles: []
})
export class AboutComponent {}
