import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewOrderPage } from './review-order';

const routes: Routes = [
  {
    path: '',
    component: ReviewOrderPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewOrderPageRoutingModule {}
