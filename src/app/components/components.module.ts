import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'
import { ImageComponent } from './image/image';
import { L10nTranslationModule } from 'angular-l10n';
import { ProductCardComponent } from './product-card/product-card';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    ImageComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    L10nTranslationModule,
    PipesModule
  ],
  exports: [
    ImageComponent,
    ProductCardComponent
  ]
})
export class ComponentsModule {}
