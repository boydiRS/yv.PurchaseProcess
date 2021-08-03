import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { UserInfoModel } from '../../_models/user/UserSessionModel';
import { DataformService } from 'src/app/_services/dataform.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-po-master-edit',
  templateUrl: './po-master-edit.component.html',
  styleUrls: ['./po-master-edit.component.css']
})
export class POMasterEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() picGroup:string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  userInfo:UserInfoModel;

  public poNo: string;

  prNoTitle:string = '';
  TotalNoTax_String: string = "0";
  TotalTax_String: string = "0";
  Total_String: string = "0";
  ReceiptDate: any;
  ContractExpDate: any;

  dataItem: any = {
    PONo: '',
    SupplierID: '',
    ReceiptDate: '',
    VATTax: '',
    IncotermID: '',
    PaymenttermID: '',
    QuotationNo: '',
    Currency: 'VND',
    Remark: '',
    Documents: '',
    PRItemList: [],
    DocumentList: [],
    CreateBy: '',
    UpdateBy: '',
    IsContract: false,
    ContractNo: '',
    ContractExpDate: '',
  }

  prDataItem: any = {
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Remark: '',
  }

  PRNo: string = '';

  dataForm: any = {
    CurrencyList: [],
    SupplierList: [],
    VATTaxList: [],
    IncotermList: [],
    PaymenttermList: [],
    DocumentList: [],
    PRList: [],
  }

  prItemOriginList = new BaseListModel();
  prItemNotSelectList: any = [];

  constructor(
    private orderService:OrderService,
    private dataFormService:DataformService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.poNo = this.id;
    this.onLoadDataForm();
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_POMasterCreate().subscribe(x => {
      this.dataForm = x;
      if(this.poNo == 'New') {
        this.dataItem.CreateBy = this.userInfo.code;
        this.onInitNew();
      }
      else {
        this.dataItem.UpdateBy = this.userInfo.code;
        this.onInitUpdate();
      }
    });
  }

  onInitNew(){
    this.prNoTitle = 'New';
  }

  onInitUpdate(){
    this.prNoTitle = this.poNo;
    this.loadData();
  }

  loadData() {
    this.orderService.POMaster_GetByID(this.poNo).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.VATTax != null) this.dataItem.VATTax = this.dataItem.VATTax.toString();
      if(this.dataItem.SupplierID != null) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.PaymenttermID != null) this.dataItem.PaymenttermID = this.dataItem.PaymenttermID.toString();
      if(this.dataItem.ReceiptDate != null) 
      {
        this.ReceiptDate = new Date(this.dataItem.ReceiptDate);
      }
      this.loadPOItem();
      this.resetDocumentList();
    });
  }

  loadPR(){
    this.orderService.PRMaster_GetByID(this.PRNo).subscribe(x => {
      this.prDataItem = x;
    });

    this.orderService.PRItem_GetList_ByPR(this.PRNo, true).subscribe(x => {
      this.prItemOriginList = x;
      // this.processPRItemList();
      this.prItemNotSelectList = [];
      this.prItemOriginList.DataList.forEach(element => {
        var check = true;
        if(element.PONo != null && element.PONo != ''){
          check = false;
          this.dataItem.PRItemList.forEach(ele => {
            if(ele.ID == element.ID){
              check = false;
            }
          });
        }
        if(check){
          this.prItemNotSelectList.push(element);
        }
      });
    });
  }

  loadPOItem(){
    this.orderService.PRItem_GetList_ByPO(this.poNo).subscribe(x => {
      this.dataItem.PRItemList = x.DataList;
      this.onCountTotal();
    });
  }

  processPRItemList(){
    this.prItemNotSelectList = [];
    this.prItemOriginList.DataList.forEach(element => {
      if(element.PRPrice != null && element.Quantity != null){
        element.Price_String = StringHelper.moneyFormat(element.PRPrice);
        if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity, 2);
        else element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity);
      }
      if(element.PONo == '' || element.PONo == null){
        this.prItemNotSelectList.push(element);
      }
    });
    this.onCountTotal();
  }

  onCountTotal(){
    let total = 0;
    let totalTax = 0;
    if(this.dataItem.PRItemList != null){
      this.dataItem.PRItemList.forEach(element => {
        total += element.POPrice * element.Quantity;
        if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity, 2);
        else element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity);
      });
    }
    totalTax = total * parseInt(this.dataItem.VATTax) / 100;
    this.TotalNoTax_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
    this.TotalTax_String = StringHelper.moneyFormat(totalTax) + " " + this.dataItem.Currency;
    this.Total_String = StringHelper.moneyFormat(total + totalTax) + " " + this.dataItem.Currency;
  }

  onAddAllToPO(){
    this.prItemNotSelectList.forEach(element => {
      this.dataItem.PRItemList.push(element);
    });
    this.prItemNotSelectList = [];
    this.onCountTotal();
  }

  onAddToPO(id){
    var itemIndex = this.prItemNotSelectList.findIndex(obj => obj.ID == id);
    if (itemIndex > -1) {
      this.dataItem.PRItemList.push(this.prItemNotSelectList[itemIndex]);
      this.prItemNotSelectList.splice(itemIndex, 1);
    }
    this.onCountTotal();
  }

  onRemoveFromPO(id){
    var itemIndex = this.dataItem.PRItemList.findIndex(obj => obj.ID == id);
    if (itemIndex > -1) {
      if(this.PRNo == this.dataItem.PRItemList[itemIndex].PRNo){
        this.prItemNotSelectList.push(this.dataItem.PRItemList[itemIndex]);
      }
      this.dataItem.PRItemList.splice(itemIndex, 1);
    }
  }

  onRemoveAllFromPO(){
    this.dataItem.PRItemList.forEach(element => {
      if(this.PRNo == element.PRNo){
        this.prItemNotSelectList.push(element);
      }
    });
    this.dataItem.PRItemList = [];
    this.onCountTotal();
  }

  acceptBtnModalClicked(){
    if(this.ReceiptDate){ this.dataItem.ReceiptDate = moment(this.ReceiptDate).format("MM/DD/YYYY");}
    else{this.dataItem.ReceiptDate = '';}

    if(this.ContractExpDate){ this.dataItem.ContractExpDate = moment(this.ContractExpDate).format("MM/DD/YYYY");}
    else{this.dataItem.ContractExpDate = '';}

    this.spinner.show();
    if(this.prNoTitle == 'New'){
      this.orderService.POMaster_Create(this.dataItem).subscribe(x => {
        this.spinner.hide();
        if (x.ErrorCode !== '00') {
          this.toastr.error(x.Message);
        } else {
          this.toastr.success(x.Message);
          this.acceptBtnModalClick.emit(x);
          this.bsModalRef.hide();
        }
      });
    }else{
      this.orderService.POMaster_Edit(this.dataItem).subscribe(x => {
        this.spinner.hide();
        if (x.ErrorCode !== '00') {
          this.toastr.error(x.Message);
        } else {
          this.toastr.success(x.Message);
          this.acceptBtnModalClick.emit(x);
          this.bsModalRef.hide();
        }
      });
    }
  }

  onChangePRNo(event){
    if(event.length == 0) this.PRNo = '';
    else this.PRNo = event[0].value;
    this.loadPR();
  }

  onChangeVATTax(event){
    this.dataItem.VATTax = event[0].value;
    this.onCountTotal();
  }

  onChangeCurrency(event){
    this.dataItem.Currency = event[0].value;
    this.onCountTotal();
  }

  //------------------------------- Document
  documentChange(id: any){
    var newDoc = "";
    var documentList = this.dataItem.Documents.split(",");
    var checkFind = false;
    var first = true;
    documentList.forEach(element => {
      if(element != id){
        if(first) {
          first = false;
          newDoc += element;
        }
        else newDoc += "," + element;
      } else{
        checkFind = true;
      }
    });

    if(!checkFind) {
      if(newDoc != "") newDoc += "," + id;
      else newDoc += id;
    }

    this.dataItem.Documents = newDoc;
    this.resetDocumentList();
  }

  resetDocumentList(){
    console.log(this.dataItem.Documents);
    var documentList = this.dataItem.Documents.split(",");
    this.dataForm.DocumentList.forEach(element => {
      element.Check = false;
      documentList.forEach(ele => {
        if(element.Value == ele) element.Check = true;
      });
    });
  }

  //------------------------------- Timer
  timer:number;
  timeoutVal:number = 1000; 

  handleKeyUp(e) {
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      this.onCountTotal();
    }, this.timeoutVal);
  }

  handleKeyPress(e) {
    window.clearTimeout(this.timer);
  }
}
