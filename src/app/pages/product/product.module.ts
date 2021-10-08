import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProductPage } from './product';
import { L10nTranslationModule } from 'angular-l10n';
// import { StarRatingModule } from 'ionic3-star-rating';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { ComponentsModule } from '../../components/components.module';
import { ProductPageRoutingModule } from './product-routing.module';
import { DeliveryAddressPageModule } from '../delivery-address/delivery-address.module';
import { ShippingFormPageModule } from '../shipping-form/shipping-form.module';

@NgModule({
  declarations: [ProductPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    // StarRatingModule,
    TruncateModule,
    ComponentsModule,
    ProductPageRoutingModule,
    CommonModule,
    DeliveryAddressPageModule,
    ShippingFormPageModule
  ],
})
export class ProductPageModule {}
