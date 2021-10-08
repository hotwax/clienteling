import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingCartPage } from './shopping-cart';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { ShoppingCartPageRoutingModule } from './shopping-cart-routing.module';
import { EditCartItemPageModule } from '../edit-cart-item/edit-cart-item.module';
import { BarcodeScannerPageModule } from '../barcode-scanner/barcode-scanner.module';
@NgModule({
  declarations: [ShoppingCartPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    ComponentsModule,
    ShoppingCartPageRoutingModule,
    CommonModule,
    FormsModule,
    EditCartItemPageModule,
    BarcodeScannerPageModule
  ],
})
export class ShoppingCartPageModule {}
