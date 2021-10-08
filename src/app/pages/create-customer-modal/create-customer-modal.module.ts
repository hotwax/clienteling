import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCustomerModalPage } from './create-customer-modal';
import { L10nTranslationModule } from 'angular-l10n';
import { CreateCustomerModalPageRoutingModule } from './create-customer-modal-routing.module';

@NgModule({
  declarations: [CreateCustomerModalPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    CreateCustomerModalPageRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class CreateCustomerPageModule {}
