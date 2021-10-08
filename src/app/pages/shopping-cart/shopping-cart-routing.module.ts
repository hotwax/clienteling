import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartPage } from './shopping-cart';

const routes: Routes = [
  // To hide the tab-bar on subpages of shopping-cart tab, add the routing in this module itself.
  {
    path: '',
    component: ShoppingCartPage,
  },
  {
    path: 'payment',
    loadChildren: () => import('../payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'review-order',
    loadChildren: () => import('../review-order/review-order.module').then( m => m.ReviewOrderPageModule)
  },
  {
    path: 'create-customer',
    loadChildren: () => import('../create-customer/create-customer.module').then( m => m.CreateCustomerPageModule)
  },
  {
    path: 'return-order',
    loadChildren: () => import('../return-order/return-order.module').then( m => m.ReturnOrderPageModule)
  },
  {
    path: 'return-items',
    loadChildren: () => import('../return-items/return-items.module').then( m => m.ReturnItemsPageModule)
  },
  {
    path: 'process-return',
    loadChildren: () => import('../process-return/process-return.module').then( m => m.ProcessReturnPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingCartPageRoutingModule {}
