import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TabsPage } from './tabs';
import { L10nTranslationModule } from 'angular-l10n';
import { TabsPageRoutingModule } from './tabs-routing.module';

@NgModule({
  declarations: [TabsPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    TabsPageRoutingModule,
    CommonModule
  ],
})
export class TabsPageModule {}
