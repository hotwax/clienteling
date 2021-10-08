import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewOrderPage } from './review-order';
import { L10nTranslationModule } from 'angular-l10n';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { ReviewOrderPageRoutingModule } from './review-order-routing.module';

@NgModule({
  declarations: [ReviewOrderPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    PipesModule,
    ComponentsModule,
    ReviewOrderPageRoutingModule,
    CommonModule,
    FormsModule
  ],
})
export class ReviewOrderPageModule {}
