import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessReturnPage } from './process-return';
import { L10nTranslationModule } from 'angular-l10n';
import { ProcessReturnPageRoutingModule } from './process-return-routing.module';

@NgModule({
  declarations: [ProcessReturnPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    ProcessReturnPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class ProcessReturnPageModule {}
