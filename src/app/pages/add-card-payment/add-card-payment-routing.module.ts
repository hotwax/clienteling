import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCardPaymentPage } from './add-card-payment';

const routes: Routes = [
  {
    path: '',
    component: AddCardPaymentPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCardPaymentPageRoutingModule {}
