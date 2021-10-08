import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterProductsPage } from './filter-products';
import { L10nTranslationModule } from 'angular-l10n';
import { FilterProductsPageRoutingModule } from './filter-products-routing.module';

@NgModule({
  declarations: [
    FilterProductsPage,
  ],
  imports: [
    IonicModule,
    L10nTranslationModule,
    FilterProductsPageRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ FilterProductsPage ]
})
export class FilterProductsPageModule {}
