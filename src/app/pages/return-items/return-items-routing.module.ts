import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnItemsPage } from './return-items';

const routes: Routes = [
  {
    path: '',
    component: ReturnItemsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnItemsPageRoutingModule {}
