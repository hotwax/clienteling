import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShippingFormPage } from './shipping-form';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { ShippingFormPageRoutingModule } from './shipping-form-routing.module';
@NgModule({
  declarations: [ShippingFormPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    ShippingFormPageRoutingModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [ ShippingFormPage ]
})
export class ShippingFormPageModule {}
