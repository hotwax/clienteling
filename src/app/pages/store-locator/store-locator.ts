import { Component, Inject, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { ReservationFormPage } from '../reservation-form/reservation-form';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { HcProvider } from '../../services/hc.provider';
import { StorageProvider } from '../../services/storage.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { HttpStatusCode } from '../../shared/HttpStatusCode';
import { ProductProvider } from '../../services/product.provider';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '../../shared/store/auth/auth.state';
import { Observable } from 'rxjs';
import { AddToCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { take } from 'rxjs/operators';
import { CustomerState } from '../../shared/store/customer/customer.state';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'page-store-locator',
  templateUrl: 'store-locator.html',
})
export class StoreLocatorPage implements OnInit {
  data: any;
  productAvailability: any;
  isInStock: boolean;
  storeGroup: any;
  storeStates: any[];
  currentStoreData: any;

  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(CustomerState.getPartyId) customerId$: Observable<any>;

  constructor(
    private translation: L10nTranslationService,
    private actionSheetCtrl: ActionSheetController,
    private callNumber: CallNumber,
    private storageProvider: StorageProvider,
    private modalCtrl: ModalController,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    public productProvider: ProductProvider,
    private store: Store,
    private alertCtrl: AlertController,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    if(this.router.getCurrentNavigation().extras.state) this.data = this.router.getCurrentNavigation().extras.state
    this.currentStoreData$.subscribe(currentStoreData => {
      this.currentStoreData = currentStoreData;
    });
  }

  ngOnInit() {
    this.getStoreLocatorToken().then(
      (accessToken: any) => {
        if (accessToken) {
          this.getStore().subscribe(
            (store: any) => {},
            err => {
              this.widget.showLoading('');
              if (err.status === HttpStatusCode.UNAUTHORIZED) {
                this.refreshStoreLocatorToken().then(() => {
                  this.getStore();
                });
              } else {
                this.widget.hideLoading();
                this.widget.showToast(
                  this.translation.translate('Something went wrong'),
                );
              }
            },
          );
        }
      },
      err => {
        this.widget.hideLoading();
        this.widget.showToast(this.translation.translate('Something went wrong'));
      },
    );
  }

  getStoreLocatorToken() {
    return new Promise((resolve, reject) => {
      let googleAccessToken = this.storageProvider.getLocalStorageItem(
        'googleAccessToken',
      );
      if (!googleAccessToken) {
        this.hcProvider.callRequest('get', 'store/locator/token').subscribe(
          (data: any) => {
            if (data.accessToken) {
              this.storageProvider.setLocalStorageItem(
                'googleAccessToken',
                data.accessToken,
              );
              resolve(data.accessToken);
            }
          },
          err => {
            console.log(err);
          },
        );
      } else {
        resolve(googleAccessToken);
      }
    });
  }

  refreshStoreLocatorToken() {
    return new Promise((resolve, reject) => {
      this.storageProvider.removeLocalStorageItem('googleAccessToken');

      let refreshTokenSubscription = this.hcProvider.callRequest(
        'get',
        'store/locator/token?refresh=true',
      );
      refreshTokenSubscription.subscribe(
        (data: any) => {
          if (data.accessToken) {
            this.storageProvider.setLocalStorageItem(
              'googleAccessToken',
              data.accessToken,
            );
            resolve(data.accessToken);
          }
        },
        err => {
          reject(err);
          console.log(err);
        },
      );
    });
  }

  getStore(keyword?) {
    // TODO unsubscribe it appropriately
    let getStoreSubscription = this.hcProvider.getStore(keyword);
    getStoreSubscription.subscribe(
      (store: any) => {
        if (store.locations && store.locations.length > 0) {
          this.productAvailability = store.locations;
          this.productAvailability.map((ele: any) => {
            if (ele.storeCode !== undefined) {
              ele.atp = 0;
              let params = {
                sku: this.data.item.productId,
                facilityId: ele.storeCode,
              };
              this.hcProvider
                .callRequest('get', 'stock/check', params, 'stock/check', 'all')
                .subscribe(
                  (data: any) => {
                    if (data && data.result && data.result.qty) {
                      ele.atp = data.result.qty;
                    }
                  },
                  err => {
                    console.log(err);
                  },
                );
            }
          });
          this.groupStores(this.productAvailability);
        } else {
          this.storeGroup = {};
        }
        this.widget.hideLoading();
      },
      err => {
        console.error(err);
      },
    );
    return getStoreSubscription;
  }

  async reserveItem(store) {
    console.log("store", store)
    if (store.atp <= 0) {
      let alert = await this.alertCtrl.create({
        header: this.translation.translate('Product unavailable'),
        message: this.translation.translate('Currently this product is out of stock in this store.'),
        buttons: [
          {
            text: this.translation.translate('Dismiss'),
          }
        ],
      });
      await alert.present();
      return;
    }
    this.customerId$.pipe(take(1)).subscribe(async (customerId) => {
    if (
      customerId !==
      '_NA_'
    ) {
      const actionSheet = await this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Reserve for ' + this.data.partyName,
            icon: 'cart-outline',
            handler: async () => {
              const modal = await this.modalCtrl.create({
                component: ReservationFormPage,
                componentProps: {
                  data: {
                    selectedProduct: this.data.item,
                    facilityId: store.storeCode,
                    facilityName: store.locationName,
                  }
                }
              })
              return await modal.present();
            },
          },
          {
            text: 'Call store',
            icon: 'call-outline',
            handler: () => {
              this.callNumber.callNumber('18001010101', true);
            },
          },
          {
            text: 'Send store address to ' + this.data.partyName,
            icon: 'mail-outline',
            handler: () => {
              //ToDo: We will integrate SMS cordova plugin
            },
          },
        ],
      });
      await actionSheet.present();
    } else {
      this.store.dispatch(new AddToCart({ item: this.data.item, facilityId: store.storeCode, facilityName: store.locationName }));
    }
    });
  }
  getDistance(dist): number {
    return parseInt(dist);
  }

  getLocation(ev) {
    // Reset filteredLocation back to all of the locations i.e. productAvailability
    if (this.productAvailability == undefined) return;
    // set enteredLocation to the value of the ev target
    if (ev.key === 'Enter') {
      this.getStore(ev.target.value);
    }
  }

  filterInStock() {
    if (this.isInStock) {
      let instockStores = this.productAvailability.filter((el: any) => el.atp > 0);
      this.groupStores(instockStores);
    } else {
      this.groupStores(this.productAvailability);
    }
  }

  /*
   * groupStores function grouping the store on basis of respective states
   * This function takes a list stores as perameter and filtered states on
   * the bases of administrativeArea.
   */
  groupStores(stores: any) {
    this.storeGroup = {};
    this.storeGroup[stores[0].address.administrativeArea] = [];
    // storeGroup object takes state as key and store detail list as value {'NY': [{store1 detail},{store2}...]}
    for (let store of stores) {
      if (this.storeGroup[store.address.administrativeArea] !== undefined) {
        this.storeGroup[store.address.administrativeArea].push(store);
      } else {
        this.storeGroup[store.address.administrativeArea] = [];
        this.storeGroup[store.address.administrativeArea].push(store);
      }
    }
  }

  clearSearchbar() {
    // To get the default list of locations after clearing the searchbar
    this.getStore();
  }
}
