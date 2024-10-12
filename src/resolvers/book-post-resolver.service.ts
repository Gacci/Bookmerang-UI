import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { BookMarketService } from '../services/book-market.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookPostResolver implements Resolve<any> {
  constructor(
    private auth: AuthService,
    private market: BookMarketService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const params: any = { ...route.params, ...route.queryParams };
    return this.market.search({
      ...(params.isbn13 ? { isbn13: [params.isbn13] } : {}),
      ...(/^true|false$/.test(params.tradeable)
        ? { tradeable: JSON.parse(params.tradeable) }
        : {}),
      ...(+params.state
        ? {
            'state[]': [
              ...(!!(+params.state & (1 << 0)) ? ['NEW'] : []),
              ...(!!(+params.state & (1 << 1)) ? ['LIKE_NEW'] : []),
              ...(!!(+params.state & (1 << 2)) ? ['VERY_GOOD'] : []),
              ...(!!(+params.state & (1 << 3)) ? ['GOOD'] : []),
              ...(!!(+params.state & (1 << 4)) ? ['ACCEPTABLE'] : [])
            ]
          }
        : {})
    });
  }
}
