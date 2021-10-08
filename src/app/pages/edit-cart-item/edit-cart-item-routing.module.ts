import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCartItemPage } from './edit-cart-item';

const routes: Routes = [
  {
    path: '',
    component: EditCartItemPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditCartItemPagePageRoutingModule {}
