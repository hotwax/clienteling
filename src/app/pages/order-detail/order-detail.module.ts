import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { OrderDetailPage } from './order-detail';
import { L10nTranslationModule } from 'angular-l10n';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { OrderDetailPageRoutingModule } from './order-detail-routing.module';

@NgModule({
  declarations: [OrderDetailPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
    OrderDetailPageRoutingModule,
    CommonModule
  ],
})
export class OrderDetailPageModule {}
