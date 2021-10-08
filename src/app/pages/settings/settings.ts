import { Component, Inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale, L10N_CONFIG, L10nConfig, } from 'angular-l10n';
import { WidgetUtils } from '../../shared/widget.util';
import { ClovergoProvider } from '../../services/clovergo.provider';
import { Store } from '@ngxs/store';
import { Logout, SetCurrentLocale, SetCurrentStore } from '../../shared/store/auth/auth.actions';
import { Select } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { Observable } from 'rxjs';
import { PaymentProvider } from '../../services/payment.provider';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { take } from 'rxjs/operators';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  isDeviceEngaged: boolean = false;
  currentLocale;
  // The isDeviceEngaged flag will be used to disable
  // connect and disconnect button when some action is
  // already initiated. As we are not using the loading
  // element on screen, the flag disables the button.

  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;
  @Select(AuthState.getStores) stores$: Observable<any>;
  @Select(AuthState.getCurrentLocale) currentLocale$: Observable<any>;

  schema = this.l10nConfig.schema;

  public storeName: string = '';
  public currentStoreFacilityId: string = '';
  public app_version: string;
  constructor(
    private translation: L10nTranslationService,
    private alertCtrl: AlertController,
    private widget: WidgetUtils,
    public clovergoProvider: ClovergoProvider,
    private store: Store,
    public paymentProvider: PaymentProvider,
    public router: Router,
    public appVersion: AppVersion,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
  ) {
    this.currentStoreData$.subscribe(currentStoreData => {
      this.currentStoreFacilityId = currentStoreData.facilityId;
    });
    this.appVersion.getVersionNumber().then((versionNumber) => {
      this.app_version = versionNumber;
    },
      (error) => {
      console.log(error);
    });  
}
ionViewDidEnter() {
  this.currentLocale$.pipe(take(1)).subscribe(currentLocale => {
    // Instead of directly assigning we need to set the value from the schema list
    // because the ion select compares using ==== operator and the locale value is object
    // when comparing the object reference should be the same
    if (currentLocale) {
      this.currentLocale = this.schema.find((item: any) => item.locale.language === currentLocale.language).locale;
    }
  });
}

  async logout() {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('Logout'),
      message: this.translation.translate('Are you sure you want to logout?'),
      buttons: [
        {
          text: this.translation.translate('No'),
        },
        {
          text: this.translation.translate('Yes'),
          handler: () => {
            localStorage.clear();
            this.store.dispatch(new Logout());
          },
        },
      ],
    });
    await alert.present();
  }
  connect() {
    this.isDeviceEngaged = true;
    this.clovergoProvider
      .connect()
      .then(res => {
        this.isDeviceEngaged = false;
        this.widget.showToast(this.translation.translate('Payment device connected'));
      })
      .catch(err => {
        console.log('err', err);
        this.isDeviceEngaged = false;
        this.widget.showToast(this.translation.translate(err.message));
      });
  }
  disconnect() {
    this.isDeviceEngaged = true;
    this.clovergoProvider
      .disconnect()
      .then(res => {
        this.isDeviceEngaged = false;
        this.widget.showToast(
          this.translation.translate('Payment device disconnected'),
        );
      })
      .catch(err => {
        this.isDeviceEngaged = false;
        this.widget.showToast(this.translation.translate(err.message));
      });
  }
  /**
   * Method sets the current store for the logged in user
   *
   * @param {String} facilityId
   *
   *
   * @return {Observable<Response>} Returns instance of Observable<Response> returned by Http.post
   */
  setFacility() {
    this.store.dispatch(
      new SetCurrentStore({ facilityId: this.currentStoreFacilityId }),
    );
  }

  soldInventory() {
    this.router.navigate(['tabs/settings/sold-inventory']);
  }

  resetPassword() {
    this.router.navigate(['tabs/settings/reset-password']);
  }
  setLocale(locale: L10nLocale): void {
    this.translation.setLocale(locale);
    this.store.dispatch(
      new SetCurrentLocale({ locale }),
    );
  }
}
