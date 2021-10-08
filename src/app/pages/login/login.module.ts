import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoginPage } from './login';
import { L10nTranslationModule } from 'angular-l10n';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';
import { LoginPageRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicModule,
    L10nTranslationModule,
    DirectivesModule,
    ComponentsModule,
    LoginPageRoutingModule,
    CommonModule
  ],
})
export class LoginPageModule {}
