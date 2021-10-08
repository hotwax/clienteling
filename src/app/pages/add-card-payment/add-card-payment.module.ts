import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCardPaymentPage } from './add-card-payment';
import { L10nTranslationModule } from 'angular-l10n';
import { NumberPadModule } from '../number-pad/number-pad.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AddCardPaymentPageRoutingModule } from './add-card-payment-routing.module';

@NgModule({
  declarations: [AddCardPaymentPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    NumberPadModule,
    PipesModule,
    AddCardPaymentPageRoutingModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [ AddCardPaymentPage ]
})
export class AddCardPaymentPageModule {}
