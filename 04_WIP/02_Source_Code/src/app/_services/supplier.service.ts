import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiUrl } from '../_models/const/ApiUrl';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseService{
  //------------------------------------------ Contact ------------------------------------
  Contact_GetList(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.contact_GetList, params);
    return data;
  }
  Contact_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.contact_GetAll, searchData);
    return data;
  }
  Contact_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.contact_GetByID, params);
    return data;
  }
  Contact_Create(createData: any){
    const data = this.postService<any>(ApiUrl.contact_Create, createData);
    return data;
  }
  Contact_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.contact_Edit, editData);
    return data;
  }
  Contact_Delete(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.contact_Delete, params);
    return data;
  }
  //----------------------------------------------------------------- Supplier -----------------------------------
  Supplier_GetAll(searchData: any) : Observable<any> {
      const data = this.getService<any>(ApiUrl.supplier_GetAll, searchData);
      return data;
  }
  Supplier_GetByID(id: any) {
      const params = new HttpParams()
          .set('id', id);
      const data = this.getService<any>(ApiUrl.supplier_GetByID, params);
      return data;
  }
  Supplier_Create(inputData: any) {
      const data = this.postService<any>(ApiUrl.supplier_Create, inputData);
      return data;
  }
  Supplier_Edit(inputData: any) {
      const data = this.postService<any>(ApiUrl.supplier_Edit, inputData);
      return data;
  }
  Supplier_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.supplier_Delete, params);
    return data;
  }
  Supplier_History(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.Supplier_History, params);
    return data;
}
  //----------------------------------------------------------------- Supplier Mistake -----------------------------------
  SupplierMistake_GetList(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.supplierMistake_GetList, searchData);
    return data;
  }
  SupplierMistake_GetAll(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.supplierMistake_GetAll, searchData);
    return data;
  }
  SupplierMistake_GetByID(id: any) {
      const params = new HttpParams()
          .set('id', id);
      const data = this.getService<any>(ApiUrl.supplierMistake_GetByID, params);
      return data;
  }
  SupplierMistake_Create(inputData: any) {
      const data = this.postService<any>(ApiUrl.supplierMistake_Create, inputData);
      return data;
  }
  SupplierMistake_Edit(inputData: any) {
      const data = this.postService<any>(ApiUrl.supplierMistake_Edit, inputData);
      return data;
  }
  SupplierMistake_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.supplierMistake_Delete, params);
    return data;
  }
  //----------------------------------------------------------------- Mistake -----------------------------------
  MistakeType_GetAll(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.mistakeType_GetAll, searchData);
    return data;
  }
  MistakeType_GetByID(id: any) {
      const params = new HttpParams()
          .set('id', id);
      const data = this.getService<any>(ApiUrl.mistakeType_GetByID, params);
      return data;
  }
  MistakeType_Create(inputData: any) {
      const data = this.postService<any>(ApiUrl.mistakeType_Create, inputData);
      return data;
  }
  MistakeType_Edit(inputData: any) {
      const data = this.postService<any>(ApiUrl.mistakeType_Edit, inputData);
      return data;
  }
  MistakeType_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.mistakeType_Delete, params);
    return data;
  }
  //----------------------------------------------------------------- Tag -----------------------------------
  Tag_GetAll(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.tag_GetAll, searchData);
    return data;
  }
  Tag_Create(inputData: any) {
      const data = this.postService<any>(ApiUrl.tag_Create, inputData);
      return data;
  }
  Tag_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.tag_Delete, params);
    return data;
  }
  //----------------------------------------------------------------- Contract Principles -----------------------------------
  ContractPrinciples_GetList(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.contractPrinciples_GetList, searchData);
    return data;
  }
  ContractPrinciples_GetAll(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.contractPrinciples_GetAll, searchData);
    return data;
  }
  ContractPrinciples_GetByID(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.contractPrinciples_GetByID, params);
    return data;
  }
  ContractPrinciples_Create(postData: any, file: any) {
    const formData = new FormData();
          formData.append('SupplierID', postData.SupplierID);
          formData.append('ContractNo', postData.ContractNo);
          formData.append('EffectiveDate', postData.EffectiveDate);
          formData.append('Remark', postData.Remark);
          formData.append('CreateBy', postData.CreateBy);
          formData.append('file', file);
    const data = this.postService<any>(ApiUrl.contractPrinciples_Create, formData);
    return data;
  }
  ContractPrinciples_Edit(postData: any, file: any) {
    const formData = new FormData();
          formData.append('ID', postData.ID);
          formData.append('SupplierID', postData.SupplierID);
          formData.append('ContractNo', postData.ContractNo);
          formData.append('EffectiveDate', postData.EffectiveDate);
          formData.append('Remark', postData.Remark);
          formData.append('UpdateBy', postData.CreateBy);
          formData.append('file', file);
    const data = this.postService<any>(ApiUrl.contractPrinciples_Edit, formData);
    return data;
  }
  ContractPrinciples_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.contractPrinciples_Delete, params);
    return data;
  }
  ContractPrinciples_DownloadFile(fileName: any) {
    const params = new HttpParams()
        .set('fileName', fileName);
    const data = this.getDownloadFile(ApiUrl.contractPrinciples_DownloadFile, params);
    return data;
  }
  //----------------------------------------------------------------- Supplier Check -----------------------------------
  SupplierCheck_GetAll(searchData: any) : Observable<any> {
    const data = this.getService<any>(ApiUrl.supplierCheck_GetAll, searchData);
    return data;
  }
  SupplierCheck_GetByID(id: any) {
      const params = new HttpParams()
          .set('id', id);
      const data = this.getService<any>(ApiUrl.supplierCheck_GetByID, params);
      return data;
  }
  SupplierCheck_Create(inputData: any) {
      const data = this.postService<any>(ApiUrl.supplierCheck_Create, inputData);
      return data;
  }
  SupplierCheck_Edit(inputData: any) {
      const data = this.postService<any>(ApiUrl.supplierCheck_Edit, inputData);
      return data;
  }
  SupplierCheck_Delete(id: any) {
    const params = new HttpParams()
        .set('id', id);
    const data = this.getService<any>(ApiUrl.supplierCheck_Delete, params);
    return data;
  }
  //----------------------------------------------------------------- Supplier Check History -----------------------------------
  SupplierCheckHistory_Create(postData: any, file: any) {
    const formData = new FormData();
          formData.append('SupplierCheckID', postData.SupplierCheckID);
          formData.append('Comment', postData.Comment);
          formData.append('CreateBy', postData.CreateBy);
          formData.append('file', file);
    const data = this.postService<any>(ApiUrl.SupplierCheckHistory_Create, formData);
    return data;
  }
  SupplierCheckDetail_GetList(id: any) {
    const params = new HttpParams().set('id', id);
    const data = this.getService<any>(ApiUrl.SupplierCheckDetail_GetList, params);
    return data;
  }
  SupplierCheckDetail_DeleteFile(id: any) {
    const params = new HttpParams().set('id', id);
    const data = this.getService<any>(ApiUrl.SupplierCheckDetail_DeleteFile, params);
    return data;
  }
  SupplierCheckDetail_DownloadFile(fileName: any) {
    const params = new HttpParams().set('fileName', fileName);
    const data = this.getDownloadFile(ApiUrl.SupplierCheckDetail_DownloadFile, params);
    return data;
  }
}
