import { ProductModule } from './../product/product.module';
import { POMasterEditComponent } from './po-master-edit/po-master-edit.component';
import { POMasterListComponent } from './po-master-list/po-master-list.component';
import { PRMasterEditComponent } from './pr-master-edit/pr-master-edit.component';
import { PRMasterListComponent } from './pr-master-list/pr-master-list.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { PrMasterDetailComponent } from './pr-master-detail/pr-master-detail.component';
import { PrMasterPrintComponent } from './pr-master-print/pr-master-print.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { PoMasterDetailComponent } from './po-master-detail/po-master-detail.component';
import { PoMasterHistoryComponent } from './po-master-history/po-master-history.component';
import { PoMasterActivityCreateComponent } from './po-master-activity-create/po-master-activity-create.component';
import { PoMasterActivityEditComponent } from './po-master-activity-edit/po-master-activity-edit.component';
import { PoMasterActivityMarkdoneComponent } from './po-master-activity-markdone/po-master-activity-markdone.component';
import { PoMasterPrintComponent } from './po-master-print/po-master-print.component';
import { PrItemListComponent } from './pr-item-list/pr-item-list.component';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoReceiptComponent } from './po-receipt/po-receipt.component';
import { PoInvoiceComponent } from './po-invoice/po-invoice.component';
import { PoPaydayComponent } from './po-payday/po-payday.component';
import { PrMasterCheckComponent } from './pr-master-check/pr-master-check.component';
import { InvoiceItemListComponent } from './invoice-item-list/invoice-item-list.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { ErMasterListComponent } from './er-master-list/er-master-list.component';
import { ErMasterEditComponent } from './er-master-edit/er-master-edit.component';
import { ErMasterDetailComponent } from './er-master-detail/er-master-detail.component';
import { EoMasterListComponent } from './eo-master-list/eo-master-list.component';
import { EoMasterEditComponent } from './eo-master-edit/eo-master-edit.component';
import { EoMasterDetailComponent } from './eo-master-detail/eo-master-detail.component';
import { EoItemListComponent } from './eo-item-list/eo-item-list.component';
import { ErItemListComponent } from './er-item-list/er-item-list.component';
import { ErMasterCheckComponent } from './er-master-check/er-master-check.component';
import { ErMasterPrintComponent } from './er-master-print/er-master-print.component';
import { EoMasterPrintComponent } from './eo-master-print/eo-master-print.component';

@NgModule({
  declarations: [
    PRMasterListComponent,
    PRMasterEditComponent,
    POMasterListComponent,
    POMasterEditComponent,
    PrMasterDetailComponent,
    PrMasterPrintComponent,
    InvoiceListComponent,
    InvoiceEditComponent,
    InvoiceDetailComponent,
    PoMasterDetailComponent,
    PoMasterHistoryComponent,
    PoMasterActivityCreateComponent,
    PoMasterActivityEditComponent,
    PoMasterActivityMarkdoneComponent,
    PoMasterPrintComponent,
    PrItemListComponent,
    PoItemListComponent,
    PoReceiptComponent,
    PoInvoiceComponent,
    PoPaydayComponent,
    PrMasterCheckComponent,
    InvoiceItemListComponent,
    InvoiceHistoryComponent,
    ErMasterListComponent,
    ErMasterEditComponent,
    ErMasterDetailComponent,
    EoMasterListComponent,
    EoMasterEditComponent,
    EoMasterDetailComponent,
    EoItemListComponent,
    ErItemListComponent,
    ErMasterCheckComponent,
    ErMasterPrintComponent,
    EoMasterPrintComponent,
  ],
  imports: [
    ProductModule,
    SharedModule,
    CommonModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
