import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessReturnPage } from './process-return';

const routes: Routes = [
  {
    path: '',
    component: ProcessReturnPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessReturnPageRoutingModule {}
