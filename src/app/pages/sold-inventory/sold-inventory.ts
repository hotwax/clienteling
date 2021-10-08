import { Component, Inject } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { WidgetUtils } from '../../shared/widget.util';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { Store, Select } from '@ngxs/store';
import { catchError, take } from 'rxjs/operators';
import { AddSoldItem, ClearRegisteredItems, RemoveSoldItem } from '../../shared/store/sold-item/sold-item.action';
import { SoldItemState } from '../../shared/store/sold-item/sold-item.state';
import { AuthState } from '../../shared/store/auth/auth.state';
import { forkJoin, Observable } from 'rxjs';
import { HcProvider } from '../../services/hc.provider';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'page-sold-inventory',
  templateUrl: 'sold-inventory.html',
})
export class SoldInventoryPage {

  @Select(SoldItemState.getSoldItems) productList$: Observable<any>;
  @Select(AuthState.getCurrentStore) currentStoreData$: Observable<any>;

  productListSubscription: any;
  currentStoreData: any;
  productSku: string = '';
  constructor(
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private widget: WidgetUtils,
    private translation: L10nTranslationService,
    private store: Store,
    public hcProvider: HcProvider,
    private alertCtrl: AlertController,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.currentStoreData$.subscribe(currentStoreData => {
      this.currentStoreData = currentStoreData;
    });
  }

  public scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
        this.getProduct(barcodeData.text);
    }).catch(err => {
      console.log('Error', err);
    });
  }

  private getProduct(sku) {
    if (sku) {
      this.widget.showLoading(this.translation.translate('Getting product details'));
      this.store.dispatch(new AddSoldItem({ productSku: sku }));
    }
  }

  searchProduct(event) {
    if (event && event.key === "Enter") {
      this.productSku = event.target.value;
      this.getProduct(this.productSku);
    }
  }

  async removeProduct(product) {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('Remove Item'),
      message: this.translation.translate('Are you sure you want to remove this item?'),
      buttons: [
        {
          text: this.translation.translate('Cancel'),
        },
        {
          text: this.translation.translate('Remove'),
          handler: () => {
            this.store.dispatch(new RemoveSoldItem({ product: product }));
          },
        },
      ],
    });
    await alert.present();
  }

  async registerOfflineSales() {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('Confirm Sale'),
      message: this.translation.translate('Are you sure these items are correct? You can not change these items after proceeding.'),
      buttons: [
        {
          text: this.translation.translate('Edit'),
        },
        {
          text: this.translation.translate('Proceed'),
          handler: () => {
            this.widget.showLoading('')
            this.productList$.pipe(take(1)).subscribe(products => {
              /** We have used JSON parse and stringify to ensure we do not change the orignal value.
               * If we use the original object it breaks the code when revisiting as we are modifying the quantity data. */
              let items = JSON.parse(JSON.stringify(products)).reduce(function(acc, product) {
                /** If same product added multiple time then instead of calling the API multiple time,
                 * We will update the quantity as per the occurences to avoid server side error */
                if (acc[product.sku] ) acc[product.sku].quantity += -1
                else acc[product.sku] =  product;
                return acc;
              }, {});
              this.createProductVariance(items).subscribe(responses => {
                let error = responses.some(response => response.body._ERROR_MESSAGE_ || response.body._ERROR_MESSAGE_LIST_)
                let msg = error ? this.translation.translate("Some products weren't uploaded. Please try again.") : this.translation.translate("Offline sale logged")
                this.widget.showToast(msg)
                let registeredItems = responses.filter(response => !(response.body._ERROR_MESSAGE_ || response.body._ERROR_MESSAGE_LIST_)).map(item => item.body.payload.sku)
                if(registeredItems) this.store.dispatch(new ClearRegisteredItems({ products: registeredItems }));
              })
              this.widget.hideLoading();
            })
          }
        }
      ]
    });
    await alert.present();
  }

  createProductVariance(products): Observable<any> {
    let productVariances = Object.keys(products).map((sku: any) => {
      let params = {
        payload: {
          facilityId: this.currentStoreData.externalFacilityId,
          reason: environment.SALE_REASON,
          quantity: products[sku].quantity,
          sku: sku
        }
      }
      return this.hcProvider.callRequest('post', 'createProductVariance', params, '', '', 'OMS_URL').pipe(
        catchError(err => {
          throw 'error ' + err;
        })
      )
    });
    return forkJoin(productVariances);
  }

}