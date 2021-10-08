import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditPhonePage } from './edit-phone';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { EditPhonePageRoutingModule } from './edit-phone-routing.module';

@NgModule({
  declarations: [
    EditPhonePage,
  ],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    EditPhonePageRoutingModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [
    EditPhonePage
  ]
})
export class EditPhonePageModule {}
