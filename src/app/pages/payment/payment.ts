import { Component,Inject, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonBackButtonDelegate,
  Platform,
  ModalController,
  NavController,
} from '@ionic/angular';
import { AddPaymentPage } from '../add-payment/add-payment';
import { AddCardPaymentPage } from '../add-card-payment/add-card-payment';
import { L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { PaymentProvider } from '../../services/payment.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { ClovergoProvider } from '../../services/clovergo.provider';
import { cardAnimation } from '../../../animations';
import { Observable } from 'rxjs';
import { ShoppingCartState } from "../../shared/store/shopping-cart/shopping-cart.state";
import { Select, Store } from '@ngxs/store';
import { ApplyTax } from '../../shared/store/shopping-cart/shopping-cart.actions';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'payment.html',
  styleUrls: ['payment.scss'],
  animations: [cardAnimation],
})
export class PaymentPage implements OnInit {
  public totalPaymentCredit = 0;
  public payments = [];
  cart: ShoppingCart;
  cartSubscription: any;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private translation: L10nTranslationService,
    private modalCtrl: ModalController,
    public paymentProvider: PaymentProvider,
    private widget: WidgetUtils,
    private alertCtrl: AlertController,
    private clovergoProvider: ClovergoProvider,
    private store: Store,
    public router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {}

  ngOnInit() {
    this.paymentProvider.totalAmount = 0;
    // Remove all the payments except the return credits
    this.paymentProvider.payment = this.paymentProvider.payment.filter(paymentItem => paymentItem.paymentMethodTypeId === 'PiOther');
    this.totalPaymentCredit = this.paymentProvider.payment.reduce(function(sum, paymentItem) {
      // TODO Find better way
      return paymentItem.paymentMethodTypeId === 'PiOther' ? sum + paymentItem.maxAmount : sum;
    }, 0);
    this.payments = []

    // Deduct return credits from the tenderAmount
    this.paymentProvider.tenderAmount = this.paymentProvider.payment.reduce(function(sum, paymentItem) {
      // TODO Find better way
      return paymentItem.paymentMethodTypeId === 'PiOther' ? sum - paymentItem.maxAmount : sum;
    }, 0);
    this.store.dispatch(new ApplyTax());
    this.cartSubscription = this.cart$.subscribe(cart => {
      this.cart = cart;
      this.paymentProvider.totalAmount = cart.grandTotal;
      /**
       * In current flow, we can add return item and place an order with it.
       * So for placing the order for return item or where the return amount is more then the added item amount
       * handle the tenderAmount accordingly.
       *  */
      // Deduct the return credit from total
      this.paymentProvider.tenderAmount = cart.grandTotal - this.paymentProvider.payment.reduce(function(sum, paymentItem) {
        return paymentItem.paymentMethodTypeId === 'PiOther' ? sum + paymentItem.maxAmount : sum;
      }, 0);

    });
  }

  ionViewDidEnter() {
    this.back();
  }

  back() {
    this.backButton.onClick = async () => {
      let hasCustomerPayment = this.paymentProvider.payment.some(paymentItem => paymentItem.paymentMethodTypeId !== 'PiOther');
      if (hasCustomerPayment) {
        let alert = await this.alertCtrl.create({
          header: this.translation.translate('Remove payments'),
          message: this.translation.translate('All payments must be removed before going back to the cart.'),
          buttons: [
            {
              text: this.translation.translate('Dismiss'),
            },
          ],
        });
        await alert.present();
      } else {
        this.navCtrl.pop();
      }
    };
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  async addPayment(paymentMethodName, paymentMethodTypeId, maxAmount, iconName) {
    // Either the payment Type is cash or credit card, same modal will be open to input the amount
    const modal = await this.modalCtrl.create({
      component: AddPaymentPage,
      componentProps: {
        data: {
          paymentMethodName: paymentMethodName,
          paymentMethodTypeId: paymentMethodTypeId,
          maxAmount: maxAmount,
          iconName: iconName,
        }
      }
    })
    modal.onDidDismiss().then((data) => {
      this.payments = this.paymentProvider.payment.filter(paymentItem => paymentItem.paymentMethodTypeId !== 'PiOther');
    });
    return await modal.present();
  }

  async addCardPayment(paymentMethodName, paymentMethodTypeId, maxAmount, iconName) {
    const modal = await this.modalCtrl.create({
      component: AddCardPaymentPage,
      componentProps: {
        data: {
          paymentMethodName: paymentMethodName,
          paymentMethodTypeId: paymentMethodTypeId,
          maxAmount: maxAmount,
          iconName: iconName,
        }
      }
    })
    modal.onDidDismiss().then((data) => {
      this.payments = this.paymentProvider.payment.filter(paymentItem => paymentItem.paymentMethodTypeId !== 'PiOther');
    });
    return await modal.present();
  }

  async removePayment(i: number, payment) {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('Void Payment'),
      message: this.translation.translate('Are you sure you want to void payment?'),
      buttons: [
        {
          text: this.translation.translate('Cancel'),
        },
        {
          text: this.translation.translate('Void'),
          handler: () => {
            this.widget.showLoading(
              this.translation.translate('Please wait while your payment is being void.'),
            );
            if (payment.paymentMethodTypeId == 'PiCreditCard') {
              this.clovergoProvider
                .voidPayment({
                  paymentId: payment.externalPaymentId,
                  orderId: payment.externalOrderId,
                })
                .then(res => {
                  this.paymentProvider.tenderAmount += parseFloat(
                    this.paymentProvider.payment[i].maxAmount,
                  );
                  this.paymentProvider.payment.splice(i, 1);
                  this.widget.hideLoading();
                  this.widget.showToast(
                    this.translation.translate('Your payment void successfully'),
                  );
                  // TODO Find a better way
                  this.payments = this.paymentProvider.payment.filter(paymentItem => paymentItem.paymentMethodTypeId !== 'PiOther');
                })
                .catch(err => {
                  console.error(err);
                  this.widget.hideLoading();
                  this.widget.showToast(this.translation.translate(err.message));
                });
            } else {
              this.paymentProvider.tenderAmount += parseFloat(
                payment.maxAmount,
              );
              // Find and remove the payment
              let paymentIndex = this.paymentProvider.payment.findIndex(
                paymentItem => paymentItem.paymentMethodTypeId === payment.paymentMethodTypeId &&
                paymentItem.maxAmount === payment.maxAmount
              );
              this.paymentProvider.payment.splice(paymentIndex, 1);
              // TODO Find a better way
              this.payments = this.paymentProvider.payment.filter(paymentItem => paymentItem.paymentMethodTypeId !== 'PiOther');
              this.widget.hideLoading();
              this.widget.showToast(
                this.translation.translate('Your payment void successfully'),
              );
            }
          },
        },
      ],
    });
    await alert.present();
  }

  reviewOrder() {
    this.router.navigate(['/review-order']);
  }
}
