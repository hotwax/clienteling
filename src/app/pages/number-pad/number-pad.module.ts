import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NumberPadPage } from './number-pad';
import { PipesModule } from '../../pipes/pipes.module';
import { L10nTranslationModule } from 'angular-l10n';
import { NumberPadPageRoutingModule } from './numbe-pad-routing.module';

@NgModule({
  declarations: [NumberPadPage],
  imports: [
    IonicModule,
    PipesModule,
    L10nTranslationModule,
    NumberPadPageRoutingModule,
    CommonModule
  ],
  exports: [NumberPadPage],
})
export class NumberPadModule {}
