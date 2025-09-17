import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderBarService {
  private loadingBarSubject = new BehaviorSubject<boolean>(true);

  loadingBarSubject$ = this.loadingBarSubject.asObservable();

  show() {
    this.loadingBarSubject.next(true);
  }

  hide() {
    this.loadingBarSubject.next(false);
  }
}