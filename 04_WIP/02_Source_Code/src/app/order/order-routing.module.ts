import { EoMasterPrintComponent } from './eo-master-print/eo-master-print.component';
import { ErMasterPrintComponent } from './er-master-print/er-master-print.component';
import { ErMasterCheckComponent } from './er-master-check/er-master-check.component';
import { EoMasterListComponent } from './eo-master-list/eo-master-list.component';
import { ErMasterListComponent } from './er-master-list/er-master-list.component';
import { EoItemListComponent } from './eo-item-list/eo-item-list.component';
import { ErItemListComponent } from './er-item-list/er-item-list.component';
import { InvoiceItemListComponent } from './invoice-item-list/invoice-item-list.component';
import { PoMasterPrintComponent } from './po-master-print/po-master-print.component';
import { PrMasterPrintComponent } from './pr-master-print/pr-master-print.component';
import { PrMasterCheckComponent } from './pr-master-check/pr-master-check.component';
import { PrItemListComponent } from './pr-item-list/pr-item-list.component';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoMasterDetailComponent } from './po-master-detail/po-master-detail.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PrMasterDetailComponent } from './pr-master-detail/pr-master-detail.component';
import { POMasterEditComponent } from './po-master-edit/po-master-edit.component';
import { POMasterListComponent } from './po-master-list/po-master-list.component';
import { PRMasterListComponent } from './pr-master-list/pr-master-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path:'pr-list', component: PRMasterListComponent },
  { path:'pr-detail-list', component: PrItemListComponent },
  // { path:'pr-edit/:id/:picGroup', component: PRMasterEditComponent} ,
  { path:'pr-detail/:id', component: PrMasterDetailComponent} ,
  { path:'pr-print/:id', component: PrMasterPrintComponent},
  { path:'pr-check', component: PrMasterCheckComponent },
  { path:'po-list', component: POMasterListComponent },
  { path:'po-detail-list', component: PoItemListComponent },
  { path:'po-edit/:id', component: POMasterEditComponent },
  { path:'po-detail/:id', component: PoMasterDetailComponent },
  { path:'po-print/:id', component: PoMasterPrintComponent },
  { path:'invoice-list', component: InvoiceListComponent },
  { path:'invoice-item-list', component: InvoiceItemListComponent },
  { path:'invoice-edit/:id', component: InvoiceEditComponent },
  { path:'invoice-detail/:id', component: InvoiceDetailComponent },
  { path:'er-list', component: ErMasterListComponent },
  { path:'er-item-list', component: ErItemListComponent },
  { path:'er-check', component: ErMasterCheckComponent },
  { path:'er-print/:id', component: ErMasterPrintComponent },
  { path:'eo-list', component: EoMasterListComponent },
  { path:'eo-item-list', component: EoItemListComponent },
  { path:'eo-print/:id', component: EoMasterPrintComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
