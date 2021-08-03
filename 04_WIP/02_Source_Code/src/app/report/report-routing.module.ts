import { PurchaseByProductCategoryComponent } from './purchase-by-product-category/purchase-by-product-category.component';
import { ReportListComponent } from './report-list/report-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path:'report-list', component: ReportListComponent},
  { path:'report-by-category', component: PurchaseByProductCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
