import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
} from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { ProductProvider } from '../../services/product.provider';
import { HcProvider } from '../../services/hc.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { environment } from '../../../environments/environment';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { Select, Store } from '@ngxs/store';
import { RemoveCartItem, SyncCart, UpdateCartItem } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-edit-cart-item',
  templateUrl: 'edit-cart-item.html',
})
export class EditCartItemPage implements OnInit {
  product: any;
  editProduct: any;
  @Input() data: any;
  public productFeatures: any;
  primaryFeature = environment.PRIMARY_FETURE;
  currencySubscription: any;
  currencyUom: any;
  @Select(ShoppingCartState.getCurrencyUom) cartCurrencyUom$: Observable<any>;

  constructor(
    private translation: L10nTranslationService,
    private modalCtrl: ModalController,
    public productProvider: ProductProvider,
    private hcProvider: HcProvider,
    private widget: WidgetUtils,
    private alertCtrl: AlertController,
    public customerDataProvider: CustomerDataProvider,
    private store: Store,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  ngOnInit() {
    // We have used JSON parse and stringify to ensure we do not change the orignal value
    // TODO Change the cart selector to deep clone the cart and remove below code
    this.editProduct = JSON.parse(JSON.stringify(this.data));
    this.widget.showLoading('');
    this.getProduct(this.editProduct.parentProductId);
    this.currencySubscription = this.cartCurrencyUom$.subscribe((currencyUom) => {
      this.currencyUom = currencyUom;
    });
  }

  ngOnDestroy() {
    if(this.currencySubscription) this.currencySubscription.unsubscribe();
  }

  closeModal(): void {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  private getProduct(productId): void {
    let endPoint = 'searchProducts/' + productId;
    this.hcProvider
      .callRequest('get', endPoint, '', 'searchProducts')
      .subscribe(
        (product: any) => {
          this.product = product;
          if (Object.keys(product).length > 0) {
            this.productFeatures = product.features;
            // To display all the variants of the product
            for (let key of Object.keys(this.productFeatures)) {
              this.productFeatures[key].map(ele => {
                ele.status = 'inactive';
                // To display the product which is already added into the cart along with active class
                this.editProduct.features.filter(item => {
                  if (item.description == ele.description)
                    ele.status = 'active';
                });
              });
            }
            this.widget.hideLoading();
          }
        },
        err => {
          this.widget.hideLoading();
          this.widget.showToast(this.translation.translate('Something went wrong'));
        },
      );
  }

  editCartItem(updatedQuantity, product) {
    if (updatedQuantity > 0) {
      this.store.dispatch(new UpdateCartItem({ item: product, quantity: updatedQuantity }));
      this.modalCtrl.dismiss('update');
      this.store.dispatch(new SyncCart());
    } else {
      this.removeItem('Quantity');
    }
  }

  async removeItem(message?) {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('Remove Item'),
      message: message
        ? this.translation.translate('Changing the quantity to less than 1 will remove this item from the cart.')
        : this.translation.translate('Are you sure you want to remove item from the cart?'),
      buttons: [
        {
          text: this.translation.translate('Cancel'),
        },
        {
          text: this.translation.translate('Remove'),
          handler: () => {
            this.store.dispatch(new RemoveCartItem({ item: this.editProduct }));
            this.closeModal();
            this.store.dispatch(new SyncCart());
          },
        },
      ],
    });
    await alert.present();
  }
}
