import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiUrl } from '../_models/const/ApiUrl';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService{
  //------------------------------------------ PO Master ------------------------------------
  POMaster_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.poMaster_GetAll, searchData);
    return data;
  }
  POMaster_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.poMaster_GetByID, params);
    return data;
  }
  POMaster_Create(createData: any){
    const data = this.postService<any>(ApiUrl.poMaster_Create, createData);
    return data;
  }
  POMaster_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.poMaster_Edit, editData);
    return data;
  }
  //------------------------------------------ PO History -----------------------------------
  POMasterDetail_DownloadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    const data = this.getDownloadFile(ApiUrl.POMasterDetail_DownloadFile, params);
    return data;
  }
  POMasterDetail_DeleteFile(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    const data = this.getService<any>(ApiUrl.poMasterDetail_DeleteFile, params);
    return data;
  }
  POMasterDetail_GetList(poNo: any): Observable<any> {
    const params = new HttpParams().set('poNo', poNo);
    const data = this.getService<any>(ApiUrl.poMasterDetail_GetList, params);
    return data;
  }
  POHistory_GetList(poNo: any): Observable<any> {
    const params = new HttpParams().set('poNo', poNo);
    const data = this.getService<any>(ApiUrl.poHistory_GetList, params);
    return data;
  }
  POHistory_Comment(postData: any, file: any) {
    const formData = new FormData();
          formData.append('PONo', postData.PONo);
          formData.append('DueDate', postData.DueDate);
          formData.append('Comment', postData.Comment);
          formData.append('CreateBy', postData.CreateBy);
          formData.append('file', file);
    const data = this.postService<any>(ApiUrl.poHistory_Comment, formData);
    return data;
  }
  POActivity_Create(createData: any){
    const data = this.postService<any>(ApiUrl.poActivity_Create, createData);
    return data;
  }
  POActivity_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.poActivity_Edit, editData);
    return data;
  }
  POActivity_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.poActivity_GetByID, params);
    return data;
  }
  POActivity_MarkDone(editData: any){
    const data = this.postService<any>(ApiUrl.poActivity_MarkDone, editData);
    return data;
  }
  POActivity_Delete(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.poActivity_Delete, params);
    return data;
  }
  POHistory_UpdateDocument(poNo: any, ID: any): Observable<any> {
    const params = new HttpParams()
        .set('poNo', poNo)
        .set('id', ID);
    const data = this.getService<any>(ApiUrl.poHistory_UpdateDocument, params);
    return data;
  }
  //------------------------------------------ PR Master ------------------------------------
  PRMasterCheck_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.prMasterCheck_GetAll, searchData);
    return data;
  }
  PRMaster_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.prMaster_GetAll, searchData);
    return data;
  }
  PRMaster_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.prMaster_GetByID, params);
    return data;
  }
  PRMaster_Create(createData: any){
    const data = this.postService<any>(ApiUrl.prMaster_Create, createData);
    return data;
  }
  PRMaster_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.prMaster_Edit, editData);
    return data;
  }
  PRMaster_Confirm(ID: any){
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.prMaster_Confirm, params);
    return data;
  }
  PRMaster_Return(ID: any){
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.prMaster_Return, params);
    return data;
  }
  JigType_GetByDrawingNo(drawingNo: any){
    const params = new HttpParams().set('drawingNo', drawingNo);
    const data = this.getService<any>(ApiUrl.jigType_GetByDrawingNo, params);
    return data;
  }
  //------------------------------------------ PR Item ------------------------------------
  POItem_UpdateActualReceipt(updateData: any){
    const data = this.postService<any>(ApiUrl.poItem_UpdateActualReceipt, updateData);
    return data;
  }
  POItem_UpdatePayday(updateData: any){
    const data = this.postService<any>(ApiUrl.poItem_UpdatePayday, updateData);
    return data;
  }
  PRItem_GetList(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.prItem_GetList, searchData);
    return data;
  }
  PRItem_GetList_ByPO(poNo: any): Observable<any> {
    const params = new HttpParams().set('poNo', poNo);
    const data = this.getService<any>(ApiUrl.prItem_GetList_ByPO, params);
    return data;
  }
  PRItem_GetList_ByPR(prNo: any, checkStatus: any = false): Observable<any> {
    const params = new HttpParams()
                  .set('prNo', prNo)
                  .set('checkStatus', checkStatus);
    const data = this.getService<any>(ApiUrl.prItem_GetList_ByPR, params);
    return data;
  }
  PRItem_GetList_ByInvoice(ID: any): Observable<any> {
    const params = new HttpParams()
                  .set('id', ID);
    const data = this.getService<any>(ApiUrl.prItem_GetList_ByInvoice, params);
    return data;
  }
  POItem_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.poItem_GetAll, searchData);
    return data;
  }
  PRItem_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.prItem_GetAll, searchData);
    return data;
  }
  InvoiceItem_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.invoiceItem_GetAll, searchData);
    return data;
  }
  PRItem_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.prItem_GetByID, params);
    return data;
  }
  PRItem_Create(createData: any){
    const data = this.postService<any>(ApiUrl.prItem_Create, createData);
    return data;
  }
  PRItem_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.prItem_Edit, editData);
    return data;
  }
  PRItem_Delete(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.prItem_Delete, params);
    return data;
  }
  BudgetUseInMonth_Get(date: any, accCode: any, picGroup: any): Observable<any> {
    const params = new HttpParams()
                      .set('date', date)
                      .set('accCode', accCode)
                      .set('picGroup', picGroup);
    const data = this.getService<any>(ApiUrl.budgetUseInMonth_Get, params);
    return data;
  }
  //------------------------------------------ Invoice Master ------------------------------------
  InvoiceMaster_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.invoiceMaster_GetAll, searchData);
    return data;
  }
  InvoiceMaster_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.invoiceMaster_GetByID, params);
    return data;
  }
  InvoiceMaster_Create(createData: any){
    const data = this.postService<any>(ApiUrl.invoiceMaster_Create, createData);
    return data;
  }
  InvoiceMaster_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.invoiceMaster_Edit, editData);
    return data;
  }
  InvoiceDetail_DownloadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    const data = this.getDownloadFile(ApiUrl.invoiceDetail_DownloadFile, params);
    return data;
  }
  InvoiceDetail_DeleteFile(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    const data = this.getService<any>(ApiUrl.invoiceDetail_DeleteFile, params);
    return data;
  }
  InvoiceDetail_GetList(id: any): Observable<any> {
    const params = new HttpParams().set('id', id);
    const data = this.getService<any>(ApiUrl.invoiceDetail_GetList, params);
    return data;
  }
  InvoiceHistory_Create(postData: any, file: any) {
    const formData = new FormData();
          formData.append('InvoiceID', postData.InvoiceID);
          formData.append('Comment', postData.Comment);
          formData.append('CreateBy', postData.CreateBy);
          formData.append('file', file);
    const data = this.postService<any>(ApiUrl.invoiceHistory_Create, formData);
    return data;
  }
  //------------------------------------------ Payment term ------------------------------------
  Paymentterm_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.paymentterm_GetAll, searchData);
    return data;
  }
  Paymentterm_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.paymentterm_GetByID, params);
    return data;
  }
  Paymentterm_Create(createData: any){
    const data = this.postService<any>(ApiUrl.paymentterm_Create, createData);
    return data;
  }
  Paymentterm_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.paymentterm_Edit, editData);
    return data;
  }
  //------------------------------------------ Export Request ------------------------------------
  ERMasterCheck_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.ERMasterCheck_GetAll, searchData);
    return data;
  }
  ERMaster_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.ERMaster_GetAll, searchData);
    return data;
  }
  ERMaster_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.ERMaster_GetByID, params);
    return data;
  }
  ERMaster_Create(createData: any){
    const data = this.postService<any>(ApiUrl.ERMaster_Create, createData);
    return data;
  }
  ERMaster_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.ERMaster_Edit, editData);
    return data;
  }
  ERMaster_Confirm(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.ERMaster_Confirm, params);
    return data;
  }
  ERMaster_Return(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.ERMaster_Return, params);
    return data;
  }
  //------------------------------------------ Export Order ------------------------------------
  EOMaster_GetAll(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.EOMaster_GetAll, searchData);
    return data;
  }
  EOMaster_GetByID(ID: any): Observable<any> {
    const params = new HttpParams().set('id', ID);
    const data = this.getService<any>(ApiUrl.EOMaster_GetByID, params);
    return data;
  }
  EOMaster_Create(createData: any){
    const data = this.postService<any>(ApiUrl.EOMaster_Create, createData);
    return data;
  }
  EOMaster_Edit(editData: any){
    const data = this.postService<any>(ApiUrl.EOMaster_Edit, editData);
    return data;
  }
  //------------------------------------------ Export Item ------------------------------------
  ERItem_GetList_ByER(erNo: any, checkStatus: any = false): Observable<any> {
    const params = new HttpParams()
                  .set('erNo', erNo)
                  .set('checkStatus', checkStatus);
    const data = this.getService<any>(ApiUrl.ERItem_GetList_ByER, params);
    return data;
  }
  ERItem_GetList_ByEO(invoiceNo: any): Observable<any> {
    const params = new HttpParams()
                  .set('invoiceNo', invoiceNo);
    const data = this.getService<any>(ApiUrl.ERItem_GetList_ByEO, params);
    return data;
  }
  ERItem_GetAll_ByER(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.ERItem_GetAll_ByER, searchData);
    return data;
  }
  ERItem_GetAll_ByEO(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.ERItem_GetAll_ByEO, searchData);
    return data;
  }
}
