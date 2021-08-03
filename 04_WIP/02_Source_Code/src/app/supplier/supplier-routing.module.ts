import { SupplierCheckListComponent } from './supplier-check-list/supplier-check-list.component';
import { ContractPriListComponent } from './contract-pri-list/contract-pri-list.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { SupplierMistakeListComponent } from './supplier-mistake-list/supplier-mistake-list.component';
import { MistaketypeListComponent } from './mistaketype-list/mistaketype-list.component';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path:'supplier-list', component: SupplierListComponent},
  { path:'supplier-edit/:id', component: SupplierEditComponent},
  { path:'supplier-detail/:id', component: SupplierDetailComponent},
  { path:'contact-list', component: ContactListComponent},
  { path:'mistaketype-list', component: MistaketypeListComponent},
  { path:'suppliermistake-list', component: SupplierMistakeListComponent},
  { path:'tag-list', component: TagListComponent},
  { path:'contract-pri-list', component: ContractPriListComponent},
  { path:'supplier-check-list', component: SupplierCheckListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
