import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReturnItemsPage } from './return-items';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';
import { ReturnItemsPageRoutingModule } from './return-items-routing.module';
@NgModule({
  declarations: [ReturnItemsPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    ComponentsModule,
    ReturnItemsPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class ReturnItemsPageModule {}
