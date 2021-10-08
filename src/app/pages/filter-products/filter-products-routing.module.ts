import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilterProductsPage } from './filter-products';

const routes: Routes = [
  {
    path: '',
    component: FilterProductsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilterProductsPageRoutingModule {}
