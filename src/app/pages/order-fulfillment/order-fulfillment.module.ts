import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderFulfillmentPage } from './order-fulfillment';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { OrderFulfillmentPageRoutingModule } from './order-fulfillment-routing.module';
import { ViewOrderPageModule } from '../view-order/view-order.module';
@NgModule({
  declarations: [OrderFulfillmentPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    ComponentsModule,
    PipesModule,
    OrderFulfillmentPageRoutingModule,
    CommonModule,
    FormsModule,
    ViewOrderPageModule
  ],
})
export class OrderFulfillmentPageModule { }
