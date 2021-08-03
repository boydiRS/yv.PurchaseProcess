import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiUrl } from '../_models/const/ApiUrl';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService{
  //------------------------------------------ Product Category ------------------------------------
  ProductCategory_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.productCategory_GetAll, searchData);
    return data;
  }
  ProductCategory_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.productCategory_GetByID, params);
    return data;
  }
  ProductCategory_Create(createData: any){
    const data = this.postService<any>(ApiUrl.productCategory_Create, createData);
    return data;
  }
  ProductCategory_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.productCategory_Edit, editData);
    return data;
  }
  //------------------------------------------ Product Item ------------------------------------
  ProductItem_GetAll(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.productItem_GetAll, searchData);
    return data;
  }
  ProductItem_GetList(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.productItem_GetList, searchData);
    return data;
  }
  ProductItem_GetByID(id: any) {
      const params = new HttpParams()
          .set('id', id);
      const data = this.getService<any>(ApiUrl.productItem_GetByID, params);
      return data;
  }
  ProductItem_Create(inputData: any) {
      const data = this.postService<any>(ApiUrl.productItem_Create, inputData);
      return data;
  }
  ProductItem_Edit(inputData: any) {
      const data = this.postService<any>(ApiUrl.productItem_Edit, inputData);
      return data;
  }
  ProductItem_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.productItem_Delete, params);
    return data;
  }
  GenerateProductNo(picGroup: any, code: any) {
    const params = new HttpParams()
        .set('picGroup', picGroup)
        .set('code', code);
    const data = this.getService<any>(ApiUrl.generateProductNo, params);
    return data;
  }
}
