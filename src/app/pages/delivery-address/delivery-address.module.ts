import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeliveryAddressPage } from './delivery-address';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { DeliveryAddressPageRoutingModule } from './delivery-address-routing.module';
@NgModule({
  declarations: [DeliveryAddressPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    DeliveryAddressPageRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ DeliveryAddressPage ]
})
export class DeliveryAddressPageModule {}
