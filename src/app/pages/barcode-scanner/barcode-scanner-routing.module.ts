import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarcodeScannerPage } from './barcode-scanner';

const routes: Routes = [
  {
    path: '',
    component: BarcodeScannerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarcodeScannerPageRoutingModule {}
