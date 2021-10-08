import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationFormPage } from './reservation-form';

const routes: Routes = [
  {
    path: '',
    component: ReservationFormPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationFormPageRoutingModule {}
