import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';
import { HomePageRoutingModule } from './home-routing.module';
import { BarcodeScannerPageModule } from '../barcode-scanner/barcode-scanner.module';
import { FilterProductsPageModule } from '../filter-products/filter-products.module';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    ComponentsModule,
    HomePageRoutingModule,
    CommonModule,
    FormsModule,
    BarcodeScannerPageModule,
    FilterProductsPageModule
  ],
})
export class HomePageModule {}
