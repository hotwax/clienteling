import { Component, Inject, OnInit } from '@angular/core';
import {
  AlertController,
} from '@ionic/angular';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { PaymentProvider } from '../../services/payment.provider';
import { ShoppingCartProvider } from '../../services/shopping-cart.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { HcProvider } from '../../services/hc.provider';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ShoppingCartState } from "../../shared/store/shopping-cart/shopping-cart.state";
import { Select, Store } from '@ngxs/store';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { UpdateCart, PrepareEmptyCart } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'page-review-order',
  templateUrl: 'review-order.html',
})
export class ReviewOrderPage implements OnInit {
  customerEmailList = [];
  selectedOption: String = '';
  cart: ShoppingCart;
  cartSubscription: any;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  constructor(
    private translation: L10nTranslationService,
    public paymentProvider: PaymentProvider,
    public shoppingCartProvider: ShoppingCartProvider,
    private widget: WidgetUtils,
    private hcProvider: HcProvider,
    private alertCtrl: AlertController,
    private store: Store,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.cartSubscription = this.cart$.subscribe(cart => {
      this.cart = cart;
      this.customerEmailList =
      this.cart.billToCustomerPartyId !==
        '_NA_' &&
        this.cart.customer.emailAddress
        ? [
            this.cart.customer.emailAddress,
            this.translation.translate('Use a different email'),
            this.translation.translate(`Don't send receipt`),
          ]
        : [
            this.translation.translate(`Don't send receipt`),
            this.translation.translate('Use a different email'),
          ];
      this.selectedOption = this.customerEmailList[0];

    });
    
  }

  ngOnInit() {
    this.cart$.pipe(take(1)).subscribe(cart => {
      cart.orderPaymentInfo.push(
        ...this.paymentProvider.payment,
      );
      this.store.dispatch(new UpdateCart({ cart: cart }));

    })
    
  }
  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  placeOrder() {
    // TODO
    // We cannot move the below code as state action.
    // With current version of Ionic/Angular only NGXS 2.0 is compatible
    // We do not have the support of action handler in NGXS 2.0
    // https://www.ngxs.io/advanced/action-handlers
    // Also there are some issues with action dispatcher due to which
    // error detection is not possible in NGXS 2.0
    // https://github.com/ngxs/store/issues/430
    this.widget.showLoading('');
    this.cart$.pipe(take(1)).subscribe(cart => {

    // TODO Need to check why address is deleted
    delete cart.address;
    let params = { cart: cart };
    this.hcProvider.callRequest('post', 'placeOrder', params).subscribe(
      (data: any) => {
        if (data.body.cart.orderId != null) {
          if (
            this.selectedOption &&
            this.selectedOption !== this.translation.translate(`Don't send receipt`)
          ) {
            this.hcProvider.callRequest('post', 'email/receipt', {
              orderId: data.body.cart.orderId,
              emailAddress: this.selectedOption,
            }).subscribe();
          }
          this.widget.showToast(
            this.translation.translate('Order placed') + data.body.cart.orderId,
          );
          this.router.navigate(['/tabs/home']);
          this.store.dispatch(new PrepareEmptyCart({}));
        } else {
          this.widget.showToast(this.translation.translate('Error while creating order'));
        }
        this.widget.hideLoading();
      },
      err => {
        this.widget.hideLoading();
        this.widget.showToast(this.translation.translate('Something went wrong'));
      },
    );
  })
  }

  getTotalPaidAmount(): any[] {
    // Used to get total paid amount corresponding to paymentMethodName
    let payment = [
      { paymentMethodName: 'Cash', totalAmount: 0 },
      { paymentMethodName: 'Credit Card', totalAmount: 0 },
      { paymentMethodName: 'Return Credit', totalAmount: 0 },
    ];
    for (let i in payment) {
      this.paymentProvider.payment
        .filter(ele => ele.paymentMethodName == payment[i].paymentMethodName)
        .map(item => (payment[i].totalAmount += parseFloat(item.maxAmount)));
    }
    return payment;
  }

  async checkSelectedOption() {
    if (this.selectedOption === this.translation.translate('Use a different email')) {
      let alert = await this.alertCtrl.create({
        header: this.translation.translate('Email Receipt'),
        inputs: [
          {
            name: 'email',
            placeholder: 'john.doe@example.com',
          },
        ],
        buttons: [
          {
            text: this.translation.translate('Cancel'),
            role: 'cancel',
            handler: data => {
              this.selectedOption = this.customerEmailList[0];
            },
          },
          {
            text: this.translation.translate('Confirm'),
            handler: data => {
              if (
                data.email.match(
                  '[A-Za-z0-9._%+-]{2,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})',
                )
              ) {
                this.customerEmailList.push(data.email);
                this.selectedOption = data.email;
              } else {
                this.selectedOption = this.customerEmailList[0];
                this.widget.showToast(
                  this.translation.translate('Incorrect email'),
                );
              }
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
