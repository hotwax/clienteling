import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerPage } from './customer';
import { L10nTranslationModule } from 'angular-l10n';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomerPageRoutingModule } from './customer-routing.module';
import { SearchCustomerPageModule } from '../search-customer/search-customer.module';
import { EditPhonePageModule } from '../edit-phone/edit-phone.module';
import { EditEmailPageModule } from '../edit-email/edit-email.module';
import { DeliveryAddressPageModule } from '../delivery-address/delivery-address.module';
@NgModule({
  declarations: [CustomerPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    CustomerPageRoutingModule,
    CommonModule,
    FormsModule,
    SearchCustomerPageModule,
    EditPhonePageModule,
    EditEmailPageModule,
    DeliveryAddressPageModule
  ],
  exports: [CustomerPage],
})
export class CustomerPageModule {}
