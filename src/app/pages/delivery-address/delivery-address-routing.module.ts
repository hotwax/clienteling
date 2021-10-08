import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryAddressPage } from './delivery-address';

const routes: Routes = [
  {
    path: '',
    component: DeliveryAddressPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryAddressPageRoutingModule {}
