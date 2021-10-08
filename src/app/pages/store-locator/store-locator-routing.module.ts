import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreLocatorPage } from './store-locator';

const routes: Routes = [
  {
    path: '',
    component: StoreLocatorPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreLocatorPageRoutingModule {}
