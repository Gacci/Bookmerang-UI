import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';


import { BookPostOfferService } from '../services/book-post-offer.service';

@Injectable({
  providedIn: 'root'
})
export class BookPostResolver implements Resolve<any> {

  constructor(private bookPostOfferService: BookPostOfferService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    console.log(route.params);
    return this.bookPostOfferService.search({ 
      ...(route.params['isbn13'] ? { isbn13: [ route.params['isbn13'] ] } : {}),
      ...(route.params['userId'] ? { userId: [ +route.params['userId'] ] } : {})
    }); 
  }
}
