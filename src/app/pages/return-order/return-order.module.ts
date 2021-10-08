import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReturnOrderPage } from './return-order';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { ReturnOrderPageRoutingModule } from './return-order-routing.module';
@NgModule({
  declarations: [ReturnOrderPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    ComponentsModule,
    ReturnOrderPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class ReturnOrderPageModule {}
