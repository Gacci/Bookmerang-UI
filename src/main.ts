import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
