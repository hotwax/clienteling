import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewOrderPage } from './view-order';

const routes: Routes = [
  {
    path: '',
    component: ViewOrderPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewOrderPageRoutingModule {}
