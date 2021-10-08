import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumberPadPage } from './number-pad';

const routes: Routes = [
  {
    path: '',
    component: NumberPadPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NumberPadPageRoutingModule {}
