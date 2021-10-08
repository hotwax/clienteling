import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { map, catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { HttpStatusCode } from '../shared/HttpStatusCode';
import { NGXLogger } from 'ngx-logger';
import { StorageProvider } from '../services/storage.provider';
import { environment } from '../../environments/environment';
import { Store, Select } from '@ngxs/store';
import { AuthState } from '../shared/store/auth/auth.state';
import { Logout } from '../shared/store/auth/auth.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  public logger: NGXLogger;
  @Select(AuthState.getToken) token$: Observable<any>;
  private authenticationToken: string;
  constructor(private storageProvider: StorageProvider, private store: Store) {
    // In NGXS 2.0 we don't have Snapshot feature
    // https://www.ngxs.io/concepts/select#snapshot-selects
    // Hence used memoized selector and stored the token in local variable
    // https://github.com/ngxs/store/blob/v2.0.0/docs/concepts/select.md
    this.token$.subscribe(token => {
      this.authenticationToken = token;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let cloneRequest = req.clone();
    if (this.authenticationToken) {
      cloneRequest = cloneRequest.clone({
        headers: req.headers
          .set('api_key', this.authenticationToken)
          .append('Content-Type', 'application/json')
          .append('Accept', 'application/json'),
      });
    }
    if (req.url.includes('mybusiness.googleapis')) {
      let googleAccessToken = this.storageProvider.getLocalStorageItem(
        'googleAccessToken',
      );
      if (googleAccessToken !== null) {
        cloneRequest = cloneRequest.clone({
          headers: req.headers
            .set('Authorization', 'Bearer ' + googleAccessToken)
            .append('Content-Type', 'application/json'),
        });
      }
    }
    /* 
      TODO: will improve the below condition once SSO is implemented. 
      This is only for development purpose
     */
    if (req.url.includes(environment.OMS_URL)) {
      let omsToken =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyTG9naW5JZCI6ImFkbWluIiwiaXNzIjoiQXBhY2hlT0ZCaXoiLCJleHAiOjE2NDgxMjk3NjMsImlhdCI6MTYxNjU5Mzc2M30.xQAJr3UjBWTyeW_dSOXoY2SRxWcwd29qfqKyeRYkganRn8sUdVLrHqWha7J8W0nnfm_FNIfP8U8ah_r5pxTCJQ';
      cloneRequest = cloneRequest.clone({
        headers: req.headers
          .set('Authorization', 'Bearer ' + omsToken)
          .append('Content-Type', 'application/json'),
      });
    }

    return next.handle(cloneRequest).pipe(
      map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              // TODO
          }
          return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === HttpStatusCode.UNAUTHORIZED &&
          req.url.includes(environment.BASE_URL)
        ) {
          this.store.dispatch(new Logout());
        }
          return throwError(error);
      }), finalize(() => {}
    ));
  }
}
