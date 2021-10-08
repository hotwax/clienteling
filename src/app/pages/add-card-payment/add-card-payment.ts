import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  Platform,
  // Slides,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { L10nUserLanguage, L10nTranslationService, L10N_LOCALE, L10nLocale } from 'angular-l10n';
import { PaymentProvider } from '../../services/payment.provider';
import { WidgetUtils } from '../../shared/widget.util';
import { ClovergoProvider }  from '../../services/clovergo.provider';
import { Select } from '@ngxs/store';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { ShoppingCart } from '../../models/shopping-cart/shopping.cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-add-card-payment',
  templateUrl: 'add-card-payment.html',
})
export class AddCardPaymentPage implements OnInit {
  // @ViewChild(Slides) slides: Slides;
  @ViewChild('autoFocus') autoFocus: any;
  @Input() data: any;
  cart: ShoppingCart;
  cartSubscription: any;
  @Select(ShoppingCartState.getCart) cart$: Observable<any>;

  constructor(
    public platform: Platform,
    private modalCtrl: ModalController,
    private translation: L10nTranslationService,
    public paymentProvider: PaymentProvider,
    private alertCtrl: AlertController,
    private widget: WidgetUtils,
    private clovergoProvider: ClovergoProvider,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.cartSubscription = this.cart$.subscribe((cart) => {
      this.cart = cart;
    })
  }

  ngOnInit() {
    this.paymentProvider.enteredAmount = 0.0;
  }

  ionViewWillEnter() {
    this.widget.setAutoFocus(this.autoFocus);
  }

  ngOnDestroy() {
    if(this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  sign(amount) {
    this.clovergoProvider
      .sign({
        signature: [
          [270, 857],
          [280, 844],
          [302, 817],
          [332, 780],
          [360, 743],
        ],
      })
      .then(res => {
        this.addPayment(amount, res);
      })
      .catch(err => {
        console.error(err);
        this.widget.showToast(
          this.translation.translate('Payment failed') + ': ' + this.translation.translate(err.message),
        );
      });
  }

  pay(amount) {
    this.widget.showLoading(this.translation.translate('Please swipe card'));
    this.clovergoProvider
      .sale({
        amount: amount * 100, // Converting to cent as per the clover api default currency TODO check how to set dollar as default
        orderId: this.cart.orderId,
      })
      .then(res => {
        if (res['type'] == 'SIGNATURE_REQUIRED') {
          // TODO Go to slide 1 with signature implementation
          // this.slides.slideTo(1);
        } else {
          this.addPayment(amount, res);
          // TODO Here instead of closing the modal transition can be to final slide
          // for payment confirmation with Done button enabled and discard disabled
          // this.slides.slideTo(2);
        }
        this.widget.hideLoading();
      })
      .catch(err => {
        this.widget.hideLoading();
        console.error(err);
        this.widget.showToast(
          this.translation.translate('Payment failed') + ': ' + this.translation.translate(err.message),
        );
      });
  }
  addPayment(amount, res) {
    this.paymentProvider.tenderAmount =
      parseFloat(this.paymentProvider.tenderAmount) - amount;
    this.paymentProvider.payment.push({
      paymentMethodName: this.data.paymentMethodName,
      paymentMethodTypeId: this.data.paymentMethodTypeId,
      maxAmount: amount,
      iconName: this.data.iconName,
      externalPaymentId: res.paymentId,
      externalOrderId: res.orderId,
      entryType: res.entryType,
      transactionType: res.transactionType,
      cardFirst6: res.cardFirst6,
      cardLast4: res.cardLast4,
      cardType: res.cardType,
      cardholderName: res.cardholderName,
      authCode: res.authCode,
    });
    // Closes the modal if payment is done
    this.modalDismiss();
  }

  async closeModal() {
    let alert = await this.alertCtrl.create({
      header: this.translation.translate('Discard'),
      message: this.translation.translate('Closing this dialog will discard any changes.'),
      buttons: [
        {
          text: this.translation.translate('Cancel'),
        },
        {
          text: this.translation.translate('Discard'),
          handler: () => {
            this.modalDismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  modalDismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
