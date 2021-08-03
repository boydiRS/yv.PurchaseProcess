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
  selector: 'app-expenses-edit',
  templateUrl: './expenses-edit.component.html',
  styleUrls: ['./expenses-edit.component.css']
})
export class ExpensesEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  userInfo:UserInfoModel;

  public expNo: string;
  private sub: any;

  prNoTitle:string = '';
  TotalNoTax_String: string = "0";
  TotalTax_String: string = "0";
  Total_String: string = "0";
  ExpensesDate: any;

  dataItem: any = {
    ExpNo: '',
    Description: '',
    UnitPrice: '0',
    Quantity: '1',
    VATTax: '',
    BillNo: '',
    ExpenseDate: '',
    Currency: 'VND',
    PICCode: '',
    Remark: '',
    CreateBy: '',
    UpdateBy: '',
  }

  prDataItem: any = {
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Remark: '',
  }

  ReceiptDate: any;

  PRNo: string = '';

  dataForm: any = {
    CurrencyList: [],
    VATTaxList: [],
    PICList: [],
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
    this.expNo = this.id;
    this.onLoadDataForm();
  }

  onInitNew(){
    this.prNoTitle = 'New';
  }

  onInitUpdate(){
    this.prNoTitle = this.expNo;
    this.loadData();
  }

  loadData() {
    this.orderService.POMaster_GetByID(this.expNo).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.VATTax != null) this.dataItem.VATTax = this.dataItem.VATTax.toString();
      if(this.dataItem.SupplierID != null) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.ReceiptDate != null) 
      {
        // this.dataItem.ReceiptDate = moment(this.dataItem.ReceiptDate).format("YYYY-MM-DD");
        this.ExpensesDate = new Date(this.dataItem.ExpensesDate);
      }
      this.onLoadPRItemOriginList();
      this.resetDocumentList();
    });
  }

  onLoadPRItemOriginList(){
    this.orderService.PRItem_GetList_ByPO(this.expNo).subscribe(x => {
      this.dataItem.PRItemList = x.DataList;
      this.onCountTotal();
      // this.processPRItemList();
    });

    this.orderService.PRItem_GetList_ByPR(this.PRNo, true).subscribe(x => {
      this.prItemOriginList = x;
      this.processPRItemList();
    });

    this.orderService.PRMaster_GetByID(this.PRNo).subscribe(x => {
      this.prDataItem = x;
    });
  }

  processPRItemList(){
    this.prItemNotSelectList = [];
    this.prItemOriginList.DataList.forEach(element => {
      if(element.PRPrice != null && element.Quantity != null){
        element.Price_String = StringHelper.moneyFormat(element.PRPrice);
        element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity);
      }
      if(element.PONo == '' || element.PONo == null){
        this.prItemNotSelectList.push(element);
      }
    });
    this.onCountTotal();
  }

  acceptBtnModalClicked(){
    if(this.ExpensesDate){ this.dataItem.ExpensesDate = moment(this.ExpensesDate).format("MM/DD/YYYY");}
    else{this.dataItem.ReceiptDate = '';}

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

  onLoadDataForm() {
    this.dataFormService.DataForm_POMasterCreate().subscribe(x => {
      this.dataForm = x;
      if(this.expNo == 'New') {
        this.dataItem.CreateBy = this.userInfo.code;
        this.onInitNew();
      }
      else {
        this.dataItem.UpdateBy = this.userInfo.code;
        this.onInitUpdate();
      }
    });
  }

  onAddToPO(id){
    var itemIndex = this.prItemNotSelectList.findIndex(obj => obj.ID == id);
    if (itemIndex > -1) {
      this.prItemNotSelectList.splice(itemIndex, 1);
    }
    this.prItemOriginList.DataList.forEach(element => {
      if(id == element.ID){
        this.dataItem.PRItemList.push(element);
      }
    });
    this.onCountTotal();
  }

  onChangeVATTax(event){
    this.dataItem.VATTax = event[0].value;
    this.onCountTotal();
  }

  onChangeCurrency(event){
    this.dataItem.Currency = event[0].value;
    this.onCountTotal();
  }

  onAddAllToPO(){
    this.prItemNotSelectList.forEach(element => {
      this.dataItem.PRItemList.push(element);
    });
    this.prItemNotSelectList = [];
    this.onCountTotal();
  }

  onRemoveFromPO(id){
    var itemIndex = this.dataItem.PRItemList.findIndex(obj => obj.ID == id);
    if (itemIndex > -1) {
      this.dataItem.PRItemList.splice(itemIndex, 1);
    }

    this.processPRItemList();
  }

  onRemoveAllFromPO(){
    this.prItemNotSelectList = [];
    this.dataItem.PRItemList = [];
    this.prItemOriginList.DataList.forEach(element => {
      if(element.PRPrice != null && element.Quantity != null){
        element.Price_String = StringHelper.moneyFormat(element.PRPrice);
        element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity);
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
        element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity);
      });
    }
    totalTax = total * parseInt(this.dataItem.VATTax) / 100;
    this.TotalNoTax_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
    this.TotalTax_String = StringHelper.moneyFormat(totalTax) + " " + this.dataItem.Currency;
    this.Total_String = StringHelper.moneyFormat(total + totalTax) + " " + this.dataItem.Currency;
  }

  prNoTriggerEnter(event) {
    if (event.key == "Enter") {
      this.onLoadPRItemOriginList();
    }
  }

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
