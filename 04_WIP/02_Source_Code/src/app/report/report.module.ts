import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { PurchaseByProductCategoryComponent } from './purchase-by-product-category/purchase-by-product-category.component';
import { ReportListComponent } from './report-list/report-list.component';

@NgModule({
  declarations: [PurchaseByProductCategoryComponent, ReportListComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
  ]
})
export class ReportModule { }
