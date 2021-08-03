import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpParams } from '@angular/common/http';
import { ApiUrl } from '../_models/const/ApiUrl';

@Injectable({
  providedIn: 'root'
})
export class DataformService extends BaseService {
  DataForm_ReportPurchaseByProductCategory(code: any){
    const params = new HttpParams()
      .set('employeeCode', code);
    const data = this.getService<any>(ApiUrl.GetDataForm_ReportPurchaseByProductCategory, params);
    return data;
  }
  DataForm_SupplierCreate(){
    const data = this.getService<any>(ApiUrl.GetDataForm_SupplierCreate, null);
    return data;
  }
  DataForm_SupplierMistakeList(){
    const data = this.getService<any>(ApiUrl.GetDataForm_SupplierMistakeList, null);
    return data;
  }
  DataForm_SupplierMistakeCreate(){
    const data = this.getService<any>(ApiUrl.GetDataForm_SupplierMistakeCreate, null);
    return data;
  }
  DataForm_ContactCreate(){
    const data = this.getService<any>(ApiUrl.GetDataForm_ContactCreate, null);
    return data;
  }
  DataForm_ProductCategoryList(code: any){
    const params = new HttpParams()
      .set('employeeCode', code);
    const data = this.getService<any>(ApiUrl.GetDataForm_ProductCategoryList, params);
    return data;
  }
  DataForm_ProductItemList(code: any){
    const params = new HttpParams()
      .set('employeeCode', code);
    const data = this.getService<any>(ApiUrl.GetDataForm_ProductItemList, params);
    return data;
  }
  DataForm_ProductItemCreate(picGroup: any){
    const params = new HttpParams()
      .set('picGroup', picGroup);
    const data = this.getService<any>(ApiUrl.GetDataForm_ProductItemCreate, params);
    return data;
  }
  DataForm_PRMasterCheck(){
    const data = this.getService<any>(ApiUrl.GetDataForm_PRMasterCheck, null);
    return data;
  }
  DataForm_POMasterList(){
    const data = this.getService<any>(ApiUrl.GetDataForm_POMasterList, null);
    return data;
  }
  DataForm_PRMasterList(code: any){
    const params = new HttpParams()
      .set('employeeCode', code);
    const data = this.getService<any>(ApiUrl.GetDataForm_PRMasterList, params);
    return data;
  }
  DataForm_PRItemCreate(picGroup: any){
    const params = new HttpParams()
      .set('picGroup', picGroup);
    const data = this.getService<any>(ApiUrl.GetDataForm_PRItemCreate, params);
    return data;
  }
  DataForm_POMasterCreate(){
    const data = this.getService<any>(ApiUrl.GetDataForm_POMasterCreate, null);
    return data;
  }
  DataForm_POMasterHistory(){
    const data = this.getService<any>(ApiUrl.GetDataForm_POMasterHistory, null);
    return data;
  }
  DataForm_InvoiceCreate(){
    const data = this.getService<any>(ApiUrl.GetDataForm_InvoiceCreate, null);
    return data;
  }
  DataForm_InvoiceList(){
    const data = this.getService<any>(ApiUrl.GetDataForm_InvoiceList, null);
    return data;
  }
  DataForm_InvoiceItemList(){
    const data = this.getService<any>(ApiUrl.GetDataForm_InvoiceItemList, null);
    return data;
  }
  DataForm_ExpensesMasterList(){
    const data = this.getService<any>(ApiUrl.GetDataForm_ExpensesMasterList, null);
    return data;
  }
  DataForm_SupplierCheckCreate(){
    const data = this.getService<any>(ApiUrl.GetDataForm_SupplierCheckCreate, null);
    return data;
  }
  DataForm_ERMasterList(code: any){
    const params = new HttpParams()
      .set('code', code);
    const data = this.getService<any>(ApiUrl.GetDataFormERMasterList, params);
    return data;
  }
  DataForm_ERMasterCreate(){
    const data = this.getService<any>(ApiUrl.GetDataFormERMasterCreate, null);
    return data;
  }
  DataForm_ERMasterCheckList(){
    const data = this.getService<any>(ApiUrl.GetDataFormERMasterCheckList, null);
    return data;
  }
  DataForm_EOMasterList(){
    const data = this.getService<any>(ApiUrl.GetDataFormEOMasterList, null);
    return data;
  }
  DataForm_EOMasterCreate(){
    const data = this.getService<any>(ApiUrl.GetDataFormEOMasterCreate, null);
    return data;
  }



  GetListFile_ByFolder(functionName: any){
    const params = new HttpParams()
        .set('functionName', functionName);
    const data = this.getService<any>(ApiUrl.GetListFile_ByFolder, params);
    return data;
  }
  UploadFile(inputData: any){
    const formData = new FormData();
        formData.append('functionName', inputData.functionName);
        formData.append('file', inputData.file);
    const data = this.postService<any>(ApiUrl.UploadFile, formData);
    return data;
  }
  Status_GetAll(id: any){
    const params = new HttpParams()
        .set('appID', id);
    const data = this.getService<any>(ApiUrl.status_GetAll, params);
    return data;
  }
  StatusAction_GetAll(appID: any, status: any, empCode: any, picGroupID: any){
    const params = new HttpParams()
        .set('appID', appID)
        .set('status', status)
        .set('empCode', empCode)
        .set('picGroupID', picGroupID);
    const data = this.getService<any>(ApiUrl.statusAction_GetAll, params);
    return data;
  }
  //---
  DataForm_RequestCompReport(id: any){
    const params = new HttpParams()
        .set('requestNo', id);
    const data = this.getService<any>(ApiUrl.GetDataForm_RequestCompReport, params);
    return data;
  }
}
