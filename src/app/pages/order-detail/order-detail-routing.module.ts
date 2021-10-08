import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailPage } from './order-detail';

const routes: Routes = [
  {
    path: '',
    component: OrderDetailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderDetailPageRoutingModule {}
