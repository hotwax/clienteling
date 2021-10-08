import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoldInventoryPage } from './sold-inventory';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';
import { SoldInventoryPageRoutingModule } from './sold-inventory-routing.module';

@NgModule({
  declarations: [
    SoldInventoryPage,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    L10nTranslationModule,
    SoldInventoryPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class SoldInventoryPageModule {}
