import { Component, OnInit, Inject } from '@angular/core';
import { WidgetUtils } from '../../shared/widget.util';
import createApp from '@shopify/app-bridge';

import { Redirect } from '@shopify/app-bridge/actions';
import { ActivatedRoute, Router } from '@angular/router';
import { L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { environment } from '../../../environments/environment';
import { AuthState } from './../../shared/store/auth/auth.state';
import { Store } from '@ngxs/store';


@Component({
  selector: 'app-shopify',
  templateUrl: './shopify.page.html',
})
export class ShopifyPage implements OnInit {
  shopOrigin: string = 'hc-sandbox.myshopify.com';
  apiKey: string = '';
  companyLogo = 'assets/imgs/hc.png'
  isInstallRequest = false;

  constructor(
    private widgetUtils: WidgetUtils,
    private activatedRoute: ActivatedRoute,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    public router: Router,
    private store: Store,
    ) {
    this.apiKey = environment.SHOPIFY_API_KEY;
    this.activatedRoute.queryParams.subscribe(params => {
      this.init(params);
    });
  }

  ngOnInit() {
  }

  init(params) {
    const hmac = params['hmac'];
    const host = params['host'];
    const shop = params['shop'];
    const locale = params['locale'];
    const session = params['session'];
    const timestamp = params['timestamp'];
    const code = params['code'];

    if ( session ) {
      // The app is loaded inside the Shopify
      const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
      // TODO Find a better way. Currently, authenticated user is not handled for the "/" path when navigated manually
      const navPath = isAuthenticated ? "/tabs/order-fulfillment" : "/";
      this.router.navigate([navPath]);
      // TODO Define flow to get user information and autheticate
    } else if ( code ) {
      // Callback URL to generate access token and redirect to app
      // TODO Generate Access token
      const appURL = `https://${shop}/admin/apps/${this.apiKey}`;
      window.location.assign(appURL);
    } else if (shop || host) {
      this.authorise(shop, host, this.apiKey);
    } else {
      // Show Install page
      this.isInstallRequest = true;
    }
  }

  install(shopOrigin) {
    this.authorise(shopOrigin, undefined, this.apiKey);
  }

  authorise(shop, host, apiKey) {
    const redirectUri = environment.SHOPIFY_REDIRECT_URI;
    const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`;
    // If the current window is the 'parent', change the URL by setting location.href  
    if (window.top == window.self) {
      window.location.assign(permissionUrl);
      // If the current window is the 'child', change the parent's URL with Shopify App Bridge's Redirect action
    } else {  
      const app = createApp({
        apiKey: apiKey,
        host  
      });
      Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
    }
  }
}
