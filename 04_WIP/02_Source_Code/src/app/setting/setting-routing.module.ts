import { PaymenttermListComponent } from './paymentterm-list/paymentterm-list.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path:'unit-list', component: UnitListComponent},
  { path:'paymentterm-list', component: PaymenttermListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
