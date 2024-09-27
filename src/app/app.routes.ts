import { Routes } from '@angular/router';
// import { SigningComponent } from '../../src/components/signing/signing.component';

import { PasswordRecoveryStartComponent } from '../auth/password-recovery-start/password-recovery-start.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';

import { BookMarketsComponent } from './book-markets/book-markets.component';
import { HomeComponent } from '../home/home.component';
import { InventoryComponent } from '../components/inventory/inventory.component';
// import { BooksComponent } from './books/books.component';

import { BookPostResolver } from '../resolvers/book-post-resolver.service';


export const routes: Routes = [
  {
    component: PasswordRecoveryStartComponent,
    path: 'password/recovery/start',
  },
  {
    component: SignUpComponent,
    path: 'sign-up',
  },
  {
    component: SignInComponent,
    path: 'sign-in',
  },
  {
    component: HomeComponent,
    path: 'home',
    resolve: {
      posts: BookPostResolver
    }
  },
  // {
  //   component: BooksComponent,
  //   path: 'books/collections/:userId',
  //   resolve: {
  //     posts: BookPostResolver
  //   }
  // },
  {
    component: InventoryComponent,
    path: 'books/inventory/:userId',
    resolve: {
      posts: BookPostResolver
    }
  },
  {
    component: BookMarketsComponent,
    path: 'books/markets/:isbn13',
    // runGuardsAndResolvers: 'always'
    resolve: {
      posts: BookPostResolver
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home'
  },
];
