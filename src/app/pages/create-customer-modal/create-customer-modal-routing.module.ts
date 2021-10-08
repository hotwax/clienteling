import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCustomerModalPage } from './create-customer-modal';

const routes: Routes = [
  {
    path: '',
    component: CreateCustomerModalPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCustomerModalPageRoutingModule {}
