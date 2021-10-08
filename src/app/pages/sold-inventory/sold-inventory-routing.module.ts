import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoldInventoryPage } from './sold-inventory';

const routes: Routes = [
  {
    path: '',
    component: SoldInventoryPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoldInventoryPageRoutingModule {}
