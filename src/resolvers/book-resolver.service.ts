import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BookCollectionService } from '../services/book-collection.service';
@Injectable({
  providedIn: 'root',
})
export class BookResolverService {
  constructor(private bookCollectionService: BookCollectionService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    console.log('BooksCollectionResolver', route.queryParams);
    const params: any = { ...route.params, ...route.queryParams };
    return this.bookCollectionService.read(params.isbn13);
  }
}
