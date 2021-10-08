import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardPage } from './customer-dashboard';

const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDashboardPageRoutingModule {}
