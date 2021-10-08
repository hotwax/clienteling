import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
} from '@ionic/angular';
import { L10nTranslationService, L10nLocale, L10N_LOCALE } from 'angular-l10n';
import { PaymentProvider } from '../../services/payment.provider';
import { Select } from '@ngxs/store';
import { ShoppingCartState } from '../../shared/store/shopping-cart/shopping-cart.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-add-payment',
  styleUrls: ['add-payment.scss'],
  templateUrl: 'add-payment.html',
})
export class AddPaymentPage implements OnInit {
  @Input() data: any;
  currencySubscription: any;
  currencyUom: any;
  @Select(ShoppingCartState.getCurrencyUom) cartCurrencyUom$: Observable<any>;

  constructor(
    private modalCtrl: ModalController,
    private translation: L10nTranslationService,
    public paymentProvider: PaymentProvider,
    private alertCtrl: AlertController,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    this.currencySubscription = this.cartCurrencyUom$.subscribe((currencyUom) => {
      this.currencyUom = currencyUom;
    });
  }

  ngOnInit() {
    this.paymentProvider.enteredAmount = 0.0;
  }

  ngOnDestroy() {
    if(this.currencySubscription) this.currencySubscription.unsubscribe();
  }

  addPayment(amount) {
    this.paymentProvider.tenderAmount =
      parseFloat(this.paymentProvider.tenderAmount) - amount;
    this.paymentProvider.payment.push({
      paymentMethodName: this.data.paymentMethodName,
      paymentMethodTypeId: this.data.paymentMethodTypeId,
      maxAmount: amount,
      iconName: this.data.iconName,
    });
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

  addTenderAmount() {
    if (this.paymentProvider.tenderAmount > 0) {
      this.paymentProvider.enteredAmount = this.paymentProvider.tenderAmount;
      this.addPayment(this.paymentProvider.enteredAmount);
    }
  }
}
