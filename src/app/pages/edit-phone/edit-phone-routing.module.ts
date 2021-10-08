import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditPhonePage } from './edit-phone';

const routes: Routes = [
  {
    path: '',
    component: EditPhonePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPhonePageRoutingModule {}
