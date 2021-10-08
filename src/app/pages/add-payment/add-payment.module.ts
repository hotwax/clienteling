import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AddPaymentPage } from './add-payment';
import { L10nTranslationModule } from 'angular-l10n';
import { NumberPadModule } from '../number-pad/number-pad.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AddPaymentPageRoutingModule } from './add-payment-routing.module';

@NgModule({
  declarations: [AddPaymentPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    NumberPadModule,
    PipesModule,
    AddPaymentPageRoutingModule,
    CommonModule
  ],
  entryComponents: [ AddPaymentPage ]
})
export class AddPaymentPageModule {}
