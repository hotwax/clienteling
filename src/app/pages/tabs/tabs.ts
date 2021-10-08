import { Component, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { WidgetUtils } from '../../shared/widget.util';
import { environment } from '../../../environments/environment';
import { ClovergoProvider } from '../../services/clovergo.provider';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1 = 'HomePage';
  tab2 = 'CustomerPage';
  tab3 = 'OrderFulfillmentPage';
  tab4 = 'ShoppingCartPage';
  tab5 = 'SettingsPage';
  @Select(ShoppingCartState.getItemCount) itemCount$: Observable<any>;
  // @ViewChild('rootTabs') rootTabsRef: Tabs;

  constructor(
    public navCtrl: NavController,
    private translateService: L10nTranslationService,
    private widget: WidgetUtils,
    private clovergoProvider: ClovergoProvider,
  ) {}

  ionViewWillEnter() {
    // if (this.navCtrl['rootParams'].tab) {
    //   this.rootTabsRef.select(this.navCtrl['rootParams'].tab);
    // }

    let cloverGoConfig = {
      appId: environment.hasOwnProperty('CLOVER_APP_ID')
        ? environment.CLOVER_APP_ID
        : '',
      appVersion: environment.hasOwnProperty('CLOVER_APP_VERSION')
        ? environment.CLOVER_APP_VERSION
        : '', // TODO Use current app version
      environment: environment.hasOwnProperty('CLOVER_ENVIRONMENT')
        ? environment.CLOVER_ENVIRONMENT
        : '',
      goApiKey: environment.hasOwnProperty('CLOVER_GO_API_KEY')
        ? environment.CLOVER_GO_API_KEY
        : '',
      goSecret: environment.hasOwnProperty('CLOVER_GO_SECRET')
        ? environment.CLOVER_GO_SECRET
        : '',
      accessToken: environment.hasOwnProperty('CLOVER_ACCESS_TOKEN')
        ? environment.CLOVER_ACCESS_TOKEN
        : '', // TODO Use backend API to get this token
      oAuthClientId: environment.hasOwnProperty('CLOVER_CLIENT_ID')
        ? environment.CLOVER_CLIENT_ID
        : '',
      oAuthClientSecret: environment.hasOwnProperty('CLOVER_CLIENT_SECRET')
        ? environment.CLOVER_CLIENT_SECRET
        : '',
      baseUrl: environment.hasOwnProperty('CLOVER_BASE_URL')
        ? environment.CLOVER_BASE_URL
        : '', // Handle for dev/production
    };
    this.clovergoProvider.init(cloverGoConfig);
  }
}
