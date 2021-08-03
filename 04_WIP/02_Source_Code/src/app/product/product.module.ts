import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductItemListComponent } from './product-item-list/product-item-list.component';
import { ProductItemCreateComponent } from './product-item-create/product-item-create.component';
import { ProductItemEditComponent } from './product-item-edit/product-item-edit.component';
import { ProductGroupListComponent } from './product-group-list/product-group-list.component';
import { ProductGroupCreateComponent } from './product-group-create/product-group-create.component';
import { ProductGroupEditComponent } from './product-group-edit/product-group-edit.component';

@NgModule({
  declarations: [ProductItemListComponent, ProductItemCreateComponent, ProductItemEditComponent, ProductGroupListComponent, ProductGroupCreateComponent, ProductGroupEditComponent],
  imports: [
    SharedModule,
    CommonModule,
    ProductRoutingModule
  ],
  exports: [
    ProductItemCreateComponent,
    ProductItemEditComponent,
  ]
})
export class ProductModule { }
