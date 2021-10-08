import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopifyPageRoutingModule } from './shopify-routing.module';

import { ShopifyPage } from './shopify.page';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    L10nTranslationModule,
    ShopifyPageRoutingModule
  ],
  declarations: [ShopifyPage]
})
export class ShopifyPageModule {}
