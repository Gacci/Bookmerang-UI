import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  @Output()
    protected onEnterKeyUp: EventEmitter<Event> = new EventEmitter<Event>();

  constructor() {
    console.log('NavigationComponent');
  }

  handleEnterKeyUp(e: Event) {
    console.log(e);
  }
}
