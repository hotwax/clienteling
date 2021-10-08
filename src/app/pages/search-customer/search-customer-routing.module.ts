import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCustomerPage } from './search-customer';

const routes: Routes = [
  {
    path: '',
    component: SearchCustomerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchCustomerPageRoutingModule {}
