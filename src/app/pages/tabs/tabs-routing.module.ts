import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: TabsPage,
    children: [
      {
        // Routing for home tab
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
          },
          {
            path: 'product',
            children: [
              {
                path: '',
                loadChildren: () => import('../product/product.module').then( m => m.ProductPageModule)
              },
              {
                path: 'store-locator',
                loadChildren: () => import('../store-locator/store-locator.module').then( m => m.StoreLocatorPageModule)
              },
              {
                path: 'delivery-address',
                loadChildren: () => import('../delivery-address/delivery-address.module').then( m => m.DeliveryAddressPageModule)
              },
              {
                path: 'shipping-form',
                loadChildren: () => import('../shipping-form/shipping-form.module').then( m => m.ShippingFormPageModule)
              },
              {
                path: 'product-reviews',
                loadChildren: () => import('../product-reviews/product-reviews.module').then( m => m.ProductReviewsModule)
              }
            ]
          }
        ]
      },
      // Routing for customer tab
      {
        path: 'customer',
        children: [
          {
            path: '',
            loadChildren: () => import('../customer/customer.module').then( m => m.CustomerPageModule)
          },
          {
            path: 'order-detail',
            loadChildren: () => import('../order-detail/order-detail.module').then( m => m.OrderDetailPageModule)
          }
        ]
      },
      // Routing for bopis tab
      {
        path: 'order-fulfillment',
        loadChildren: () => import('../order-fulfillment/order-fulfillment.module').then( m => m.OrderFulfillmentPageModule)
      },
      // Routing for shopping cart tab
      {
        path: 'shopping-cart',
        loadChildren: () => import('../shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
      },
      // Routing for settings tab
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
          },
          {
            path: 'sold-inventory',
            loadChildren: () => import('../sold-inventory/sold-inventory.module').then( m => m.SoldInventoryPageModule)
          },
          {
            path: 'reset-password',
            loadChildren: () => import('../reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
          },
        ]
      }
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
