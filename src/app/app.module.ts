
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WidgetUtils } from './shared/widget.util';
import { HcProvider } from './services/hc.provider';
import { StorageProvider } from './services/storage.provider';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { LoginPageModule } from './pages/login/login.module';
import { LoginPage } from './pages/login/login';
import { LoggerModule } from 'ngx-logger';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HomePage } from './pages/home/home';
import { HomePageModule } from './pages/home/home.module';
import { IonicStorageModule } from '@ionic/storage';
import { ShoppingCartProvider } from './services/shopping-cart.provider';
import { ShoppingCartPageModule } from './pages/shopping-cart/shopping-cart.module';
import { OrderFulfillmentPageModule } from './pages/order-fulfillment/order-fulfillment.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ProductProvider } from './services/product.provider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentProvider } from './services/payment.provider';
import { CustomerDataProvider } from './services/customerdata.provider';
import { PipesModule } from './pipes/pipes.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AgmCoreModule } from '@agm/core';
import { CacheModule } from 'ionic-cache';
import { Network } from '@ionic-native/network/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ClovergoProvider } from './services/clovergo.provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhoneNumberPipe } from './pipes/phone-number/phone-number';
// import {
//   CustomerAnalyticsModule,
//   CustomerAnalyticsProvider,
// } from 'customer-analytics';
import { NgxsModule } from '@ngxs/store';
import { AuthProvider } from './services/auth.provider';
import { AuthState } from './shared/store/auth/auth.state';
import { CustomerState } from './shared/store/customer/customer.state';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ShoppingCartState } from './shared/store/shopping-cart/shopping-cart.state';
import { ProductState } from './shared/store/product/product.state';
import { SoldItemState } from './shared/store/sold-item/sold-item.state';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { FirebaseProvider } from './services/firebase.provider';
import {
  L10nConfig,
  L10nLoader,
  L10nTranslationModule,
  L10nIntlModule
} from 'angular-l10n';
import { l10nConfig, initL10n, HttpTranslationLoader } from './l10n-config';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SearchProvider } from './services/search.provider'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    // CustomerAnalyticsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoginPageModule,
    HomePageModule,
    IonicStorageModule.forRoot(),
    // LoggerModule.forRoot({
    //   serverLoggingUrl: '/api/logs',
    //   level: NgxLoggerLevel.DEBUG,
    //   serverLogLevel: NgxLoggerLevel.ERROR,
    // }),
    ShoppingCartPageModule,
    OrderFulfillmentPageModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAnq77dGC4KbyW5qYiNUgH20SK9Iv972qU',
      libraries: ['places'],
    }),
    CacheModule.forRoot(),
    NgxsModule.forRoot([AuthState, ProductState, ShoppingCartState, CustomerState, SoldItemState]),
    NgxsStoragePluginModule.forRoot({
      key: ['auth', 'cart', 'customer', 'soldItems'],
    }),
    L10nTranslationModule.forRoot(l10nConfig, {translationLoader: HttpTranslationLoader}),
    L10nIntlModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent, LoginPage, HomePage],
  providers: [
    SplashScreen,
    HcProvider,
    // CustomerAnalyticsProvider,
    StorageProvider,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true
    },
    WidgetUtils,
    Geolocation,
    ShoppingCartProvider,
    BarcodeScanner,
    ProductProvider,
    PaymentProvider,
    CustomerDataProvider,
    CallNumber,
    SMS,
    Network,
    StatusBar,
    ClovergoProvider,
    PhoneNumberPipe,
    AuthProvider,
    FirebaseX,
    FirebaseProvider,
    AppVersion,
    SearchProvider
  ]
})
export class AppModule {
  constructor() {
  }
}
