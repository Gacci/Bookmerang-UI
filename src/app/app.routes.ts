import { Routes } from '@angular/router';
// import { SigningComponent } from '../../src/components/signing/signing.component';

import { PasswordRecoveryStartComponent } from '../auth/password-recovery-start/password-recovery-start.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';

import { BooksCollectionsComponent } from '../books-collections/books-collections.component';
import { BooksInventoriesComponent } from '../books-inventories/books-inventories.component';
import { BooksMarketsComponent } from '../books-markets/books-markets.component';
import { BookPostComponent } from '../book-post/book-post.component';
import { HomeComponent } from '../home/home.component';

import { isbnGuard } from '../guards/isbn.guard';
import { isLoggedGuard } from '../guards/is-logged.guard';
import { isNotLoggedGuard } from '../guards/is-not-logged.guard';

import { bookMarketResolver } from '../resolvers/book-market.resolver';
import { bookResolver } from '../resolvers/book.resolver';
import { booksCollectionResolver } from '../resolvers/books-collection.resolver';
import { inventoryResolver } from '../resolvers/inventory.resolver';
import { userResolver } from '../resolvers/user.resolver';



export const routes: Routes = [
  {
    canActivate: [isNotLoggedGuard],
    component: PasswordRecoveryStartComponent,
    path: 'password/recovery/start'
  },
  {
    canActivate: [isNotLoggedGuard],
    component: SignUpComponent,
    path: 'sign-up'
  },
  {
    canActivate: [isNotLoggedGuard],
    component: SignInComponent,
    path: 'sign-in'
  },
  {
    canActivate: [isLoggedGuard],
    component: HomeComponent,
    path: 'home',
    resolve: {
      posts: bookMarketResolver
    }
  },
  {
    canActivate: [isLoggedGuard],
    component: BooksCollectionsComponent,
    path: 'books/collections',
    resolve: {
      books: booksCollectionResolver
    },
    runGuardsAndResolvers: 'always'
  },
  {
    canActivate: [isLoggedGuard],
    component: BooksInventoriesComponent,
    path: 'books/inventories/:userId',
    resolve: {
      posts: inventoryResolver,
      user: userResolver
    }
  },
  {
    canActivate: [isLoggedGuard, isbnGuard],
    component: BooksMarketsComponent,
    path: 'books/markets',
    runGuardsAndResolvers: 'always',
    resolve: {
      posts: bookMarketResolver,
      book: bookResolver
    }
  },
  {
    canActivate: [isLoggedGuard, isbnGuard],
    component: BookPostComponent,
    path: 'books/markets/:isbn13',
    resolve: {
      book: bookResolver
    }
  },
  {
    path: '**',
    // pathMatch: 'full',
    redirectTo: 'home'
  }
];
