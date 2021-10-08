import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationFormPage } from './reservation-form';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { ReservationFormPageRoutingModule } from './reservation-form-routing.module';

@NgModule({
  declarations: [ReservationFormPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    ReservationFormPageRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ ReservationFormPage ]
})
export class ReservationFormPageModule {}
