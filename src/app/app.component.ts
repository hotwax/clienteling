import { Component, Inject, QueryList, ViewChildren } from '@angular/core';
import { Platform, IonRouterOutlet, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { CacheService } from 'ionic-cache';
import { environment } from '../environments/environment';
import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Select } from '@ngxs/store';
import { AuthState } from './shared/store/auth/auth.state';
import { Observable } from 'rxjs';
import { FirebaseProvider } from './services/firebase.provider';
import {
  L10N_CONFIG,
  L10nConfig,
  L10N_LOCALE,
  L10nLocale,
  L10nTranslationService
} from 'angular-l10n';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetCurrentLocale } from './shared/store/auth/auth.actions';
import { Location } from '@angular/common';
import * as moment from "moment-timezone";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  rootPage = 'LoginPage';
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList < IonRouterOutlet > ;
  // Used Memoized Selectors to improve performance
  // https://github.com/ngxs/store/blob/v2.0.0/docs/concepts/select.md#memoized-selectors
  @Select(AuthState.isAuthenticated) isAuthenticated$: Observable<any>;
  @Select(AuthState.getCurrentLocale) currentLocale$: Observable<any>;
  rootPageParams = {};

  constructor(
    private platform: Platform,
    splashScreen: SplashScreen,
    cache: CacheService,
    private toastCtrl: ToastController,
    private network: Network,
    private statusBar: StatusBar,
    private firebaseProvider: FirebaseProvider,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
    private translation: L10nTranslationService,
    public router: Router,
    private navCtrl: NavController,
    private store: Store,
    private location: Location
  ) {
    // Handles the logout and login actions
    this.isAuthenticated$.subscribe(state => {
      // shopify URLs should be accessed directly
      if (this.location.path().indexOf('/shopify') === -1) {
        if (state) {
          this.router.navigate(['tabs'])
        } else {
          this.router.navigate(['login'])
        }
      }
    });
    this.currentLocale$.pipe(take(1)).subscribe(currentLocale => {
      if (currentLocale)  {
        this.translation.setLocale(currentLocale);
      } else {
        this.store.dispatch(
          new SetCurrentLocale({ locale }),
        );
      }
    });
    platform.ready().then(() => {
      // Platform here you can do any higher level native things you might need.
      splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName('black');
      this.backButtonEvent();
      this.firebaseProvider.init()
      this.firebaseProvider.onNotificationOpen().subscribe(
        (data) => {
          this.isAuthenticated$.pipe(take(1)).subscribe(state => {
            if (state) {
              this.rootPage = 'TabsPage';
              // TODO Implement logic based upon the data
              this.rootPageParams = {
                'tab': 2,
              }
            } else {
              this.rootPage = 'LoginPage';
            }
          });
          
      });  
    });
    moment.locale('en', {
      relativeTime : {
          future: "in %s",
          past:   "%s ago",
          s  : 'a few seconds',
          ss : '%d seconds',
          m:  "a minute",
          mm: "%d minutes",
          h:  "an hour",
          hh: "%d hours",
          d:  "A day",
          dd: "%d days",
          w:  "A week",
          ww: "%d weeks",
          M:  "A month",
          MM: "%d months",
          y:  "a year",
          yy: "%d years"
      }
  });
    if (environment.hasOwnProperty('CACHE_DEFAULT_TTL'))
      cache.setDefaultTTL(environment.CACHE_DEFAULT_TTL);
  }
  // This function is used to localize/internationalize the app
  onDisconnect = this.network.onDisconnect().subscribe(async e => {
    let toast = await this.toastCtrl.create({
      message: `You're offline`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    await toast.present();
  });

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async(outlet: IonRouterOutlet) => {
        if (this.router.url != '/tabs/home') {
          this.navCtrl.back();
        } else {
          navigator['app'].exitApp();
        }
      });
    });
  }

}
