import { Routes } from '@angular/router';
// import { SigningComponent } from '../../src/components/signing/signing.component';

import { PasswordRecoveryStartComponent } from '../auth/password-recovery-start/password-recovery-start.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';

import { HomeComponent } from '../home/home.component';
import { BooksCollectionsComponent } from '../books-collections/books-collections.component';
import { BooksInventoriesComponent } from '../books-inventories/books-inventories.component';
import { BooksMarketsComponent } from '../books-markets/books-markets.component';

import { BookPostComponent } from '../book-post/book-post.component';
import { isbnGuard } from '../guards/isbn.guard';

import { bookResolver } from '../resolvers/book.resolver';
import { inventoryResolver } from '../resolvers/inventory.resolver';
import { bookMarketResolver } from '../resolvers/book-market.resolver';
import { booksCollectionResolver } from '../resolvers/books-collection.resolver';

export const routes: Routes = [
  {
    component: PasswordRecoveryStartComponent,
    path: 'password/recovery/start'
  },
  {
    component: SignUpComponent,
    path: 'sign-up'
  },
  {
    component: SignInComponent,
    path: 'sign-in'
  },
  {
    component: HomeComponent,
    path: 'home',
    resolve: {
      posts: bookMarketResolver
    }
  },
  {
    component: BooksCollectionsComponent,
    path: 'books/collections',
    resolve: {
      books: booksCollectionResolver
    },
    runGuardsAndResolvers: 'always'
  },
  {
    component: BooksInventoriesComponent,
    path: 'books/inventories/:userId',
    resolve: {
      posts: inventoryResolver
    }
  },
  {
    canActivate: [isbnGuard],
    component: BooksMarketsComponent,
    path: 'books/markets',
    runGuardsAndResolvers: 'always',
    resolve: {
      posts: bookMarketResolver,
      book: bookResolver
    }
  },
  {
    canActivate: [isbnGuard],
    component: BookPostComponent,
    path: 'books/markets/:isbn13',
    resolve: {
      book: bookResolver
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/home'
  }
];
