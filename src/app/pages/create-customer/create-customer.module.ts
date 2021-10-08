import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCustomerPage } from './create-customer';
import { L10nTranslationModule } from 'angular-l10n';
import { CreateCustomerPageRoutingModule } from './create-customer-routing.module';

@NgModule({
  declarations: [CreateCustomerPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    CreateCustomerPageRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ CreateCustomerPage ]
})
export class CreateCustomerPageModule {}
