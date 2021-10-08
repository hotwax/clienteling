import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchCustomerPage } from './search-customer';
import { L10nTranslationModule } from 'angular-l10n';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SearchCustomerPageRoutingModule } from './search-customer-routing.module';
import { CreateCustomerPageModule } from '../create-customer-modal/create-customer-modal.module';

@NgModule({
  declarations: [SearchCustomerPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    DirectivesModule,
    SearchCustomerPageRoutingModule,
    CommonModule,
    FormsModule,
    CreateCustomerPageModule
  ],
  entryComponents: [
    SearchCustomerPage
  ]
})
export class SearchCustomerPageModule {}
