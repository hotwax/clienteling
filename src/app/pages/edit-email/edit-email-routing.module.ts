import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmailPage } from './edit-email';

const routes: Routes = [
  {
    path: '',
    component: EditEmailPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEmailPageRoutingModule {}
