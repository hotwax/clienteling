import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductReviewsPage } from './product-reviews';

const routes: Routes = [
  {
    path: '',
    component: ProductReviewsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductReviewsPageRoutingModule {}
