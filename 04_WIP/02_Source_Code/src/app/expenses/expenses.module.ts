import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { ExpensesEditComponent } from './expenses-edit/expenses-edit.component';
import { ExpensesDetailComponent } from './expenses-detail/expenses-detail.component';

@NgModule({
  declarations: [ExpensesListComponent, ExpensesEditComponent, ExpensesDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
