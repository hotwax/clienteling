import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PaymentPage } from './payment';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { PaymentPageRoutingModule } from './payment-routing.module';
import { AddCardPaymentPageModule } from '../add-card-payment/add-card-payment.module';
import { AddPaymentPageModule } from '../add-payment/add-payment.module';

@NgModule({
  declarations: [PaymentPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    PaymentPageRoutingModule,
    CommonModule,
    AddCardPaymentPageModule,
    AddPaymentPageModule
  ],
})
export class PaymentPageModule {}
