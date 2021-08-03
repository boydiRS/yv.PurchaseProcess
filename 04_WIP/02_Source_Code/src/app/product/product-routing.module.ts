import { ProductItemListComponent } from './product-item-list/product-item-list.component';
import { ProductGroupListComponent } from './product-group-list/product-group-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path:'group-list', component: ProductGroupListComponent},
  { path:'item-list', component: ProductItemListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
