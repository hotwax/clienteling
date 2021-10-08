import { Component, Inject } from '@angular/core';
import {
  ModalController,
  ActionSheetController,
  AlertController,
} from '@ionic/angular';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { EditCartItemPage } from '../edit-cart-item/edit-cart-item';
import { BarcodeScannerPage } from '../barcode-scanner/barcode-scanner';
import { ShoppingCartProvider } from '../../services/shopping-cart.provider';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { WidgetUtils } from '../../shared/widget.util';
import { HcProvider } from '../../services/hc.provider';
import { Observable } from 'rxjs';
import { ShoppingCartState } from "../../shared/store/shopping-cart/shopping-cart.state";
import { Select, Store } from '@ngxs/store';
import { AddToCart, SyncCart, ClearCartItems, ApplyCoupon } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { CustomerDataProvider } from '../../services/customerdata.provider';
import { PaymentProvider } from '../../services/payment.provider';
import { Router } from '@angular/router';
import { CustomerState } from '../../shared/store/customer/customer.state';

@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {
  cartTotal: number = 0;
  productSku: string = '';
  cart: ShoppingCart;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @Select(CustomerState.getPartyId) customerId$: Observable<any>;
  cartSubscription: any;
  totalPaymentCredit: number = 0;

  constructor(
    public shoppingCartProvider: ShoppingCartProvider,
    private translation: L10nTranslationService,
    private widget: WidgetUtils,
    private hcProvider: HcProvider,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private store: Store,
    public customerDataProvider: CustomerDataProvider,
    public paymentProvider: PaymentProvider,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.cartSubscription = this.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  ionViewWillEnter() {
    this.store.dispatch(new SyncCart());
    this.totalPaymentCredit = - this.paymentProvider.payment.reduce(function(sum, paymentItem) {
      return paymentItem.paymentMethodTypeId === 'PiOther' ? sum + paymentItem.maxAmount : sum;
    }, 0);
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  addProductInCart(sku) {
    let endPoint = 'searchProducts/' + sku;
    let params = {
      identificationType: 'SKU',
    };
    this.hcProvider
      .callRequest('get', endPoint, params, 'searchProducts')
      .subscribe(
        (product: any) => {
          let variantProduct =
            product.variants.find(el => el.productId === sku) || {};
          let variant = {
            orderItemSeqId: '',
            primaryProductCategoryId: product.primaryProductCategoryId,
            productId: variantProduct.productId || sku,
            brandName: product.brandName,
            productName: product.productName,
            parentProductId: product.productId,
            quantity: 1,
            listPrice: product.price.listPrice,
            unitPrice: product.price.basePrice,
            isSale: product.price.isSale,
            imageUrl: product.images.main.detail,
            mainFeat: '',
            features: [],
            alternateImage: '',
            secondaryFeat: '',
            itemAdjustments: [],
            orderItemPriceInfos: [],
            attributes: {},
            contactMechId: '',
            facilityId: [],
            productStock: 0,
          };
          if (variantProduct.COLOR) {
            variant.features.push(variantProduct.COLOR);
          }
          if (variantProduct.SIZE) {
            variant.features.push(variantProduct.SIZE);
          }
          if (
            (product.hasOwnProperty('isInventoryAvailable') &&
              product.isInventoryAvailable === 'Y') ||
            (Object.keys(variantProduct).length &&
              variantProduct.isInventoryAvailable === 'Y')
          ) {
            this.store.dispatch(new AddToCart({ item: variant}));
          } else {
            this.widget.showToast(this.translation.translate('Product not found'));
          }
        },
        error => {
          this.widget.showToast(
            error.error.errors || this.translation.translate('Product not found'),
          );
        },
      );
  }

  searchProduct(event) {
    if (event && event.key === "Enter") {
      this.productSku = event.target.value;
      this.addProductInCart(this.productSku);
    }
  }

  async scanBarcode() {
    const modal = await this.modalCtrl.create({
      component: BarcodeScannerPage,
      componentProps: {
        page: 'cart'
      }
    })
    modal.onDidDismiss().then((props: any) => {
      if (props.data && props.data.sku) {
        this.addProductInCart(props.data.sku);
      }
    });
    return await modal.present();
  }

  payment(): void {
    // TODO Discuss and find a better way to achieve it
    // Initially we had a condition where we check if there are in store items and all the items are in store
    // As we do not maintain the inStoreItems in a separate variables thus we implemented new logic such that
    // we first identify the instore shipgroup and then find if there is assoc record for any other ship group
    // With current implementation we delte shipgroup if there are not items we can also have the logic such that if there is not ship group other than 
    // the instore shipgroup the condition is met.
    let inStoreShipGroup = this.cart.orderItemShipGroupInfo.find(shipGroup => this.shoppingCartProvider.isInStoreShipGroup(shipGroup));
    let isInStore = inStoreShipGroup && !this.cart.orderItemShipGroupAssoc.some(assoc => assoc.shipGroupSeqId !== inStoreShipGroup.shipGroupSeqId);
    if(this.cart.billToCustomerPartyId !== '_NA_' || isInStore) {
      this.router.navigate(['/payment']);
    } else {
      this.router.navigate(['/create-customer']);
    }
  }

  async editCartItem(product) {
    const modal = await this.modalCtrl.create({
      component: EditCartItemPage,
      componentProps: {
        data: product
      }
    })
    return await modal.present();
  }

  async options() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translation.translate('Apply coupon'),
          icon: 'pricetag-outline',
          handler: () => {
            this.getCouponCode();
          },
        },
        {
          text: this.translation.translate('Clear cart'),
          icon: 'cart-outline',
          handler: async () => {
            // To display confirmation dialog for clearing the cart
            let alert = await this.alertCtrl.create({
              header: this.translation.translate('Clear cart'),
              message: this.translation.translate('Are you sure you want to clear this cart?'),
              buttons: [
                {
                  text: this.translation.translate('Cancel'),
                },
                {
                  text: this.translation.translate('Clear'),
                  handler: () => {
                    this.clearCart();
                  },
                },
              ],
            });
            await alert.present();
          },
        },
        {
          text: this.translation.translate('Cancel'),
          icon: 'close-outline',
        },
      ],
    });
    await actionSheet.present();
  }

  async getCouponCode() {
    let prompt = await this.alertCtrl.create({
      header: this.translation.translate('Coupon Code'),
      inputs: [
        {
          name: 'couponCode',
        },
      ],
      buttons: [
        {
          text: this.translation.translate('Cancel'),
          handler: () => {
            //close prompt
          },
        },
        {
          text: this.translation.translate('Apply'),
          handler: data => {
            if (data.couponCode) {
              this.store.dispatch(new ApplyCoupon({ couponCode: data.couponCode }));
            }
          },
        },
      ],
    });
    await prompt.present();
  }

  returnOrder() {
    this.router.navigate(['/return-order']);
  }

  clearCart() {
    this.store.dispatch(new ClearCartItems());
  }

  completeReturn() {
    if (
      this.customerDataProvider.returnOrder &&
      this.customerDataProvider.returnOrder.returnId
    ) {
      this.customerDataProvider.processReturn(
        this.customerDataProvider.returnOrder.returnId,
      );
      this.clearCart();
    }
  }
}
