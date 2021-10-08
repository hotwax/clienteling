import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewOrderPage } from './view-order';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';
import { ViewOrderPageRoutingModule } from './view-order-routing.module';

@NgModule({
  declarations: [
    ViewOrderPage,
  ],
  imports: [
    IonicModule,
    L10nTranslationModule,
    ComponentsModule,
    ViewOrderPageRoutingModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [ ViewOrderPage ]
})
export class ViewOrderPageModule {}
