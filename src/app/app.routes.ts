import { Routes } from '@angular/router';
// import { SigningComponent } from '../../src/components/signing/signing.component';

import { PasswordRecoveryStartComponent } from '../auth/password-recovery-start/password-recovery-start.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';

import { HomeComponent } from '../home/home.component';
import { BooksCollectionsComponent } from '../books-collections/books-collections.component';
import { BooksInventoriesComponent } from '../books-inventories/books-inventories.component';
import { BooksMarketsComponent } from '../books-markets/books-markets.component';

import { BookPostResolver } from '../resolvers/book-post-resolver.service';
import { BooksCollectionResolver } from '../resolvers/books-collection-resolver.service';
import { BookResolverService } from '../resolvers/book-resolver.service';
import { BookPostComponent } from '../book-post/book-post.component';

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
      posts: BookPostResolver,
    },
  },
  {
    component: BooksCollectionsComponent,
    path: 'books/collections',
    resolve: {
      books: BooksCollectionResolver,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    component: BooksInventoriesComponent,
    path: 'books/inventories/:userId',
    resolve: {
      posts: BookPostResolver,
    },
  },
  {
    component: BooksMarketsComponent,
    path: 'books/markets',
    runGuardsAndResolvers: 'always',
    resolve: {
      posts: BookPostResolver,
      book: BookResolverService,
    },
  },
  {
    component: BookPostComponent,
    path: 'books/markets/:isbn13',
    resolve: {
      book: BookResolverService,
    },
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
