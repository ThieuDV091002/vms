import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@abp/ng.core';
import { PrivateMessageSignalrService } from '../services/private-message-signalr.service';


@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private signalRService: PrivateMessageSignalrService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {

          // this.signalRService.stopConnection();

          // return from(this.authService.refreshToken()).pipe(
          //   () => {
          //     this.signalRService.startConnection();
          //     const newRequest = request.clone({
          //       setHeaders: {
          //         Authorization: `Bearer ${this.authService.getAccessToken()}`
          //       }
          //     });
          //     return next.handle(newRequest);
          //   },
          //   err => throwError(err)
          // );
        }
        return throwError(error);
      })
    );
  }
}
