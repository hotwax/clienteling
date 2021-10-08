import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShippingFormPage } from './shipping-form';

const routes: Routes = [
  {
    path: '',
    component: ShippingFormPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingFormPageRoutingModule {}
