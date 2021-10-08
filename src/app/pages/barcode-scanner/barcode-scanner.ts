import { Component, Input } from '@angular/core';
import {
  ModalController,
} from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { WidgetUtils } from '../../shared/widget.util';
import { Store, Select } from '@ngxs/store';
import { ProductState } from '../../shared/store/product/product.state';
import { SetCurrent } from '../../shared/store/product/product.action';
import { Observable } from 'rxjs';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { NavigationExtras, Router } from '@angular/router';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage {

  productSubscription: any;
  @Select(ProductState.getCurrentProduct) product$: Observable<any>;
  @Input() page: any;

  constructor(private barcodeScanner: BarcodeScanner,
    private widget: WidgetUtils, private modalCtrl: ModalController,
    private translation: L10nTranslationService, private store: Store, public router: Router) {

    this.barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData.cancelled) {
        // If close the barcode scanner without scanning then modal will be dismiss and redirect to home page
        this.closeModal();
      } else {
        // If scan the product then call getProduct API and redirect to product page
        if (this.page === 'cart') {
          this.modalCtrl.dismiss({ sku: barcodeData.text });
        } else {
          this.getProduct(barcodeData.text);
        }
      }
    })
    .catch(err => {
      this.widget.showToast(err);
      this.closeModal();
    });
  }

  ngOnDestroy() {
    if(this.productSubscription) this.productSubscription.unsubscribe();
  }

  private getProduct(sku) {
    if (sku) {
      this.closeModal();
      this.widget.showLoading(this.translation.translate('Getting product details'));
      this.store.dispatch(new SetCurrent({productId: sku})).pipe(withLatestFrom(this.product$)).subscribe(([_, product]) => {
        if (product) {
          if(this.productSubscription) this.productSubscription.unsubscribe();
          if(product.productId !== sku) {
            let data = {
              variant: product.variants.find(el => el.productId === sku)
            }
            this.router.navigate(["tabs/home/product"], { state: {...data} });
          } else {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                productId: sku,
              }
            };
            this.router.navigate(["tabs/home/product"], navigationExtras);
          }
        } else if(product === null) {
          this.widget.hideLoading();
        }
      });
    }
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
