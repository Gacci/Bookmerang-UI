import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingOverlayService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public $isLoading = this.loadingSubject.asObservable();

  private activeRequestCount: number = 0;

  show() {
    this.activeRequestCount++;
    if ( this.activeRequestCount === 1 ) {
      this.loadingSubject.next(true);
    }
  }

  hide() {
    if (this.activeRequestCount > 0) {
      this.activeRequestCount--;
    }

    if ( this.activeRequestCount === 0 ) {
      this.loadingSubject.next(false); 
    }
  }
}
