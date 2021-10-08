import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CustomerDashboardPage } from './customer-dashboard';
import { ComponentsModule } from '../../components/components.module';
import { CustomerDashboardPageRoutingModule } from './customer-dashboard-routing.module';
@NgModule({
  declarations: [CustomerDashboardPage],
  imports: [
    IonicModule,
    ComponentsModule,
    CustomerDashboardPageRoutingModule,
    CommonModule
  ],
})
export class CustomerDashboardPageModule {}
