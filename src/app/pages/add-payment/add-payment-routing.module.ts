import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaymentPage } from './add-payment';

const routes: Routes = [
  {
    path: '',
    component: AddPaymentPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPaymentPageRoutingModule {}
