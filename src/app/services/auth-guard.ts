import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AuthState } from '../shared/store/auth/auth.state';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<any>;
  private token;
  constructor() {
    this.isAuthenticated$.pipe(take(1)).subscribe(state => {
      this.token = state
    })
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>|Promise<boolean>|boolean {
    if(this.token) {
      return true;
    } else {
      return false;
    }
  }
}
