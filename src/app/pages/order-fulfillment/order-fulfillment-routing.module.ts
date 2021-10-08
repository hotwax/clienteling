import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFulfillmentPage } from './order-fulfillment';

const routes: Routes = [
  {
    path: '',
    component: OrderFulfillmentPage,
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderFulfillmentPageRoutingModule {}
