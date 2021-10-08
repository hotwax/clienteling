import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopifyPage } from './shopify.page';

const routes: Routes = [
  {
    path: '',
    component: ShopifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopifyPageRoutingModule {}
