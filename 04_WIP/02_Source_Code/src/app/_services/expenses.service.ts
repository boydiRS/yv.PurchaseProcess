import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiUrl } from '../_models/const/ApiUrl';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService extends BaseService{
  //------------------------------------------ Expenses Master ------------------------------------
  ExpensesMaster_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.expensesMaster_GetAll, searchData);
    return data;
  }
  ExpensesMaster_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.expensesMaster_GetByID, params);
    return data;
  }
  ExpensesMaster_Create(createData: any){
    const data = this.postService<any>(ApiUrl.expensesMaster_Create, createData);
    return data;
  }
  ExpensesMaster_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.expensesMaster_Edit, editData);
    return data;
  }
}
