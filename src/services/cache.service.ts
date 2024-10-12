import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, HttpResponse<any>>();

  constructor() {
    this.cache.clear();
  }

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    return this.cache.get(req.urlWithParams);
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    this.cache.set(req.urlWithParams, response);
  }

  has(req: HttpRequest<any>): boolean {
    return this.cache.has(req.urlWithParams);
  }
}
