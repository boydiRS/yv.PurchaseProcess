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
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() picGroup:string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  userInfo:UserInfoModel;

  InvoiceNoTitle:string = '';
  TotalNoTax_String: string = "0";
  TotalTax_String: string = "0";
  Total_String: string = "0";
  InvoiceDate: any;
  CDSDate: any;

  dataItem: any = {
    ID: '',
    InvoiceNo: '',
    InvoiceDate: '',
    InvoiceType: 'false',
    PONo: '',
    BillNo: '',
    TotalWeight: '',
    CDSNo: '',
    CDSDate: '',
    CDSType: '',
    CDSSelectivity: '',
    TA_OverseaID: '',
    TA_ForwaderID: '',
    TA_TruckingID: '',
    TA_OverseaFee: '',
    TA_ForwaderFee: '',
    TA_TruckingFee: '',
    ImportTax: '',
    HavePO: false,
    SupplierID: '',
    IncotermID: '',
    Currency: 'VND',
    PRItemList: [],

    CreateBy: '',
    UpdateBy: '',
  }

  prDataItem: any = {
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Remark: '',
  }

  PONo: string = '';

  dataForm: any = {
    CDSTypeList: [],
    CDSSelectivityList: [],
    SupplierList: [],
    IncotermList: [],
    POList: [],
    PICGroupList: [],
    UnitList: [],
    CurrencyList: [],
    ProductCodeList: [],
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
    this.onLoadDataForm();
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_InvoiceCreate().subscribe(x => {
      this.dataForm = x;
      if(this.id == 'New') {
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
    this.InvoiceNoTitle = 'New';
  }

  onInitUpdate(){
    this.InvoiceNoTitle = "Update";
    this.loadData();
  }

  loadData() {
    this.orderService.InvoiceMaster_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.InvoiceType != null) this.dataItem.InvoiceType = this.dataItem.InvoiceType.toString();
      if(this.dataItem.TA_OverseaID != null) this.dataItem.TA_OverseaID = this.dataItem.TA_OverseaID.toString();
      if(this.dataItem.TA_ForwaderID != null) this.dataItem.TA_ForwaderID = this.dataItem.TA_ForwaderID.toString();
      if(this.dataItem.TA_TruckingFee != null) this.dataItem.TA_TruckingFee = this.dataItem.TA_TruckingFee.toString();

      if(this.dataItem.InvoiceDate != null) this.InvoiceDate = new Date(this.dataItem.InvoiceDate);
      if(this.dataItem.CDSDate != null) this.CDSDate = new Date(this.dataItem.CDSDate);
      if(this.dataItem.SupplierID != null) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      this.loadInvoiceItem();
    });
  }

  onChangePONo(event){
    if(event.length == 0) this.PONo = '';
    else this.PONo = event[0].value;
    this.loadPO();
  }

  loadPO(){
    this.orderService.PRItem_GetList_ByPO(this.PONo).subscribe(x => {
      this.prItemOriginList = x;
      this.prItemNotSelectList = [];
      this.prItemOriginList.DataList.forEach(element => {
        var check = true;
        if(element.InvoiceID != null){
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

  loadInvoiceItem(){
    this.orderService.PRItem_GetList_ByInvoice(this.id).subscribe(x => {
      this.dataItem.PRItemList = x.DataList;
      this.onCountTotal();
    });
  }

  processPRItemList(){
    this.prItemNotSelectList = [];
    this.prItemOriginList.DataList.forEach(element => {
      if(element.POPrice != null && element.Quantity != null){
        element.Price_String = StringHelper.moneyFormat(element.POPrice);
        element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity);
      }
      if(element.InvoiceID == null){
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
    this.Total_String = StringHelper.moneyFormat(total);// + " " + this.dataItem.Currency;
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
      if(this.PONo == this.dataItem.PRItemList[itemIndex].PONo){
        this.prItemNotSelectList.push(this.dataItem.PRItemList[itemIndex]);
      }
      this.dataItem.PRItemList.splice(itemIndex, 1);
    }
  }

  onRemoveAllFromPO(){
    this.dataItem.PRItemList.forEach(element => {
      if(this.PONo == element.PONo){
        this.prItemNotSelectList.push(element);
      }
    });
    this.dataItem.PRItemList = [];
    this.onCountTotal();
  }

  acceptBtnModalClicked(){
    if(this.InvoiceDate){ this.dataItem.InvoiceDate = moment(this.InvoiceDate).format("MM/DD/YYYY");}
    else{this.dataItem.InvoiceDate = '';}
    if(this.CDSDate){ this.dataItem.CDSDate = moment(this.CDSDate).format("MM/DD/YYYY");}
    else{this.dataItem.CDSDate = '';}

    this.spinner.show();
    if(this.InvoiceNoTitle == 'New'){
      this.orderService.InvoiceMaster_Create(this.dataItem).subscribe(x => {
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
      this.orderService.InvoiceMaster_Edit(this.dataItem).subscribe(x => {
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

  //No PO
  createPRItem() {
    let rowIndex = this.dataItem.PRItemList.length;
    this.dataItem.PRItemList.push({
      RowIndex: rowIndex + 1,
      ProductType: '1',
      JigTypeID: '',
      ProductNo: '',
      POPrice: '0',
      Quantity: '1',
      UnitID: '1',
      SubTotal: '0',
      Description: '',
    });
  }

  onChangeVATTax(event){
    this.dataItem.VATTax = event[0].value;
    this.onCountTotal();
  }

  onChangeCurrency(event){
    this.dataItem.Currency = event[0].value;
    this.onCountTotal();
  }

  moneyFormat(str){
    return StringHelper.moneyFormat(str);
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
