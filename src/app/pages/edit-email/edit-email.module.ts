import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditEmailPage } from './edit-email';
import { L10nTranslationModule } from 'angular-l10n';
import { EditEmailPageRoutingModule } from './edit-email-routing.module';

@NgModule({
  declarations: [
    EditEmailPage,
  ],
  imports: [
    IonicModule,
    L10nTranslationModule,
    EditEmailPageRoutingModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [
    EditEmailPage
  ]
})
export class EditEmailPageModule {}
