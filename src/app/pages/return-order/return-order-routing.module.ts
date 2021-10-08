import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnOrderPage } from './return-order';

const routes: Routes = [
  {
    path: '',
    component: ReturnOrderPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnOrderPageRoutingModule {}
