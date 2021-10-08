import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoresPage } from './stores';
import { L10nTranslationModule } from 'angular-l10n';
import { StoresPageRoutingModule } from './stores-routing.module';

@NgModule({
  declarations: [StoresPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    StoresPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class StoresPageModule {}
