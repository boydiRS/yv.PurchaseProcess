import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactCreateComponent } from './contact-create/contact-create.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { SupplierMistakeListComponent } from './supplier-mistake-list/supplier-mistake-list.component';
import { SupplierMistakeEditComponent } from './supplier-mistake-edit/supplier-mistake-edit.component';
import { MistaketypeListComponent } from './mistaketype-list/mistaketype-list.component';
import { MistaketypeEditComponent } from './mistaketype-edit/mistaketype-edit.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { ContractPriListComponent } from './contract-pri-list/contract-pri-list.component';
import { ContractPriEditComponent } from './contract-pri-edit/contract-pri-edit.component';
import { SupplierHistoryComponent } from './supplier-history/supplier-history.component';
import { SupplierCheckListComponent } from './supplier-check-list/supplier-check-list.component';
import { SupplierCheckEditComponent } from './supplier-check-edit/supplier-check-edit.component';
import { SupplierCheckDetailComponent } from './supplier-check-detail/supplier-check-detail.component';
import { SupplierCheckHistoryComponent } from './supplier-check-history/supplier-check-history.component';

@NgModule({
  declarations: [
    SupplierListComponent, 
    SupplierEditComponent, 
    ContactListComponent, 
    ContactCreateComponent, 
    ContactEditComponent, SupplierDetailComponent, SupplierMistakeListComponent, SupplierMistakeEditComponent, MistaketypeListComponent, MistaketypeEditComponent, TagListComponent, TagEditComponent, ContractPriListComponent, ContractPriEditComponent, SupplierHistoryComponent, SupplierCheckListComponent, SupplierCheckEditComponent, SupplierCheckDetailComponent, SupplierCheckHistoryComponent],
  imports: [
    SharedModule,
    CommonModule,
    SupplierRoutingModule
  ]
})
export class SupplierModule { }
