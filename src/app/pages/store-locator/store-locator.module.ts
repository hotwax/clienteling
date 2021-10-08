import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreLocatorPage } from './store-locator';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { StoreLocatorPageRoutingModule } from './store-locator-routing.module';
import { ReservationFormPageModule } from '../reservation-form/reservation-form.module';
@NgModule({
  declarations: [StoreLocatorPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    ComponentsModule,
    StoreLocatorPageRoutingModule,
    CommonModule,
    FormsModule,
    ReservationFormPageModule
  ],
})
export class StoreLocatorPageModule {}
