import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EditCartItemPage } from './edit-cart-item';
import { L10nTranslationModule } from 'angular-l10n';
import { ComponentsModule } from '../../components/components.module';
import { EditCartItemPagePageRoutingModule } from './edit-cart-item-routing.module';

@NgModule({
  declarations: [EditCartItemPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    ComponentsModule,
    EditCartItemPagePageRoutingModule,
    CommonModule
  ],
  entryComponents: [ EditCartItemPage ]
})
export class EditCartItemPageModule {}
