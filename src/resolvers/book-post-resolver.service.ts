import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { BookMarketService } from '../services/book-market.service';

@Injectable({
  providedIn: 'root',
})
export class BookPostResolver implements Resolve<any> {
  constructor(private bookPostOfferService: BookMarketService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    console.log(route.params);
    console.log(route.queryParams);

    const params: any = { ...route.params, ...route.queryParams };
    return this.bookPostOfferService.search({
      ...(params.isbn13 ? { isbn13: [ params.isbn13 ] } : {}),
      ...(params.userId ? { userId: [ +params.userId ] } : {}),
      ...(params.state ? { state: [].concat(params.state) } : {})
    });
  }
}
