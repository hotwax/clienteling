import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsPage } from './settings';
import { L10nTranslationModule } from 'angular-l10n';
import { SettingsPageRoutingModule } from './settings-routing.module';
@NgModule({
  declarations: [SettingsPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    SettingsPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class SettingsPageModule {}
