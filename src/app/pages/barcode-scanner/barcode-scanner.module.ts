import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarcodeScannerPage } from './barcode-scanner';
import { L10nTranslationModule } from 'angular-l10n';
import { BarcodeScannerPageRoutingModule } from './barcode-scanner-routing.module';

@NgModule({
  declarations: [BarcodeScannerPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    BarcodeScannerPageRoutingModule,
    CommonModule,
    FormsModule
  ],
  entryComponents: [ BarcodeScannerPage ]
})
export class BarcodeScannerPageModule {}
