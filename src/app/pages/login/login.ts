import { Component, Inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from '../../shared/store/auth/auth.actions';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  companyLogo: string;

  constructor(private store: Store, @Inject(L10N_LOCALE) public locale: L10nLocale) {
    this.companyLogo = 'assets/imgs/hc.png';
  }

  login(username, password) {
    let params = { USERNAME: username, PASSWORD: password };
    this.store.dispatch(new Login(params));
  }
}
