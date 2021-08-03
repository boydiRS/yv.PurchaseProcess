import { CommonService } from './../../_services/common.service';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { UserInfoModel } from '../../_models/user/UserSessionModel';
import { ActivatedRoute, Router } from '@angular/router';
import { DataformService } from 'src/app/_services/dataform.service';
import { Component, OnInit, TemplateRef, ChangeDetectorRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'

@Component({
  selector: 'app-pr-master-edit',
  templateUrl: './pr-master-edit.component.html',
  styleUrls: ['./pr-master-edit.component.css']
})
export class PRMasterEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() type: string;
  @Input() id: string;
  @Input() picGroup:string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;
  hasChanged:boolean = false;
  userInfo:UserInfoModel;
  firstLoad: boolean = true;
  bsValue: any;
  ReceiptDate: any;

  public prNo: string;
  public title: string;

  total: number = 0;
  Total_String: string = "0";
  tranferMail: string = '';
  tranferPhone: string = '';

  dataItem: any = {
    PRNo: '',
    PICGroup: '',
    AccCode: '',
    SupplierID: '',
    ReceiptDate: '',
    RequestNo: '',
    Currency: 'VND',
    Remark: '',
    TranferID: '',
    TranferSectionID: '',
    TotalBudget: '',
    RemainBudget: '',
    WorkingBudget: '',
    RemainWorkingBudget: '',
    CurrencyBudget: 'VND',
    CreateBy: '',
    UpdateBy: '',
    
    PRItemList: [],
  }

  dataForm: any = {
    SupplierList: [],
    AccCodeList: [],
    ProductTypeList: [],
    CurrencyList: [],
    UnitList: [],
    ProductList: [],
    UsingTimeTypeList: [],
    TranferSectionList: [],
    TranferList: [],
  }

  productList: any = [];
  serviceList: any = [];
  prItemList = new BaseListModel();
  budgetUse:any = {
    Total: '',
  }

  constructor(
    private orderService:OrderService,
    private dataFormService:DataformService,
    private route:ActivatedRoute,
    private userService:UserService,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService,
    private router:Router,
    private commonService:CommonService,
    private changeDetection:ChangeDetectorRef,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.innerHeight = window.innerHeight - 240;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 240;
    this.init();    
  }

  init(){
    this.prNo = this.id;
    this.onLoadDataForm();
    if(this.type == 'New'){
      this.title = this.type;
    }
    else if(this.type == 'Clone'){
      this.title = this.type;
      this.loadData();
    }else{
      this.title = this.prNo;
      this.loadData();
    }
    this.onLoadPRItemList();
  }

  loadData() {
    this.orderService.PRMaster_GetByID(this.prNo).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.SupplierID != null) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.TranferID != null) this.dataItem.TranferID = this.dataItem.TranferID.toString();
      if(this.dataItem.TranferSectionID != null) this.dataItem.TranferSectionID = this.dataItem.TranferSectionID.toString();
      if(this.dataItem.ReceiptDate != null) {
        this.ReceiptDate = new Date(this.dataItem.ReceiptDate);
      }
    });
  }

  onLoadBudgetUse(){
    if(this.ReceiptDate){ this.dataItem.ReceiptDate = moment(this.ReceiptDate).format("MM/DD/YYYY");}
    this.orderService.BudgetUseInMonth_Get(this.dataItem.ReceiptDate, this.dataItem.AccCode, this.picGroup).subscribe(x => {
      this.budgetUse = x;
    });
  }

  onLoadPRItemList(){
    this.orderService.PRItem_GetList_ByPR(this.prNo).subscribe(x => {
      this.prItemList = x;
      this.dataItem.PRItemList = this.prItemList.DataList;
      this.dataItem.PRItemList.forEach(element => {
        if(element.JigTypeID != null) element.JigTypeID = element.JigTypeID.toString();
      });
      
      this.onCreatePRItem();
      this.countTotal();
    });
  }

  processPRItemList(){
    this.total = 0;
    this.dataItem.PRItemList.forEach(element => {
      if(element.PRPrice != null && element.Quantity != null){
        element.Price_String = StringHelper.moneyFormat(element.PRPrice) + " " + this.dataItem.Currency;
        element.SubTotal_String = StringHelper.moneyFormat(element.PRPrice * element.Quantity) + " " + this.dataItem.Currency;
        this.total += element.PRPrice * element.Quantity;
      }
    });
    this.Total_String = StringHelper.moneyFormat(this.total) + " " + this.dataItem.Currency;
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_PRItemCreate(this.picGroup).subscribe(x => {
      this.dataForm = x;
      // this.filterProductList();
    });
  }

  onCreatePRItem() {
    let rowIndex = this.dataItem.PRItemList.length;
    this.dataItem.PRItemList.push({
      RowIndex: rowIndex + 1,
      AccCode: '',
      ProductType: '1',
      JigTypeID: '',
      ProductNo: '',
      PRPrice: '0',
      Currency: 'VND',
      Quantity: '1',
      UnitID: '1',
      SubTotal: '0',
      Description: '',
    });
  }

  count = 0;

  onChangeProductItem(event, rowIndex){
    this.count++;
    if(this.count >= this.dataItem.PRItemList.length){
      this.firstLoad = false;
    }
    if(!this.firstLoad){
      var itemIndex = this.dataItem.PRItemList.findIndex(obj => obj.RowIndex == rowIndex);
      if(itemIndex > -1){
        var productIndex = this.dataForm.ProductList.findIndex(x => x.Value == event[0].value);
        if(productIndex > -1){
          this.dataItem.PRItemList[itemIndex].PRPrice = this.dataForm.ProductList[productIndex].OriginPrice;
          this.dataItem.PRItemList[itemIndex].UnitID = this.dataForm.ProductList[productIndex].UnitID;
          this.dataItem.PRItemList[itemIndex].ProductDes = this.dataForm.ProductList[productIndex].Description;
        }
        if(itemIndex == this.dataItem.PRItemList.length - 1){
          this.onCreatePRItem();
        }
      }
      this.countTotal();
    }
  }

  onChangeCurrency(event){
    this.dataItem.Currency = event[0].value;
    this.countTotal();
  }

  onChangeAccCode(event){
    if(event.length > 0){
      this.dataItem.AccCode = event[0].value;
    }else{
      this.dataItem.AccCode = '';
    }
    
    this.onLoadBudgetUse();
  }

  formatMoney(money: any, currency: any){
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  onChangeTranfer(event){
    this.dataItem.TranferID = event[0].value;
    var itemIndex = this.dataForm.TranferList.findIndex(obj => obj.Value == this.dataItem.TranferID);
    if (itemIndex > -1) {
      let str = this.dataForm.TranferList[itemIndex].Filter;
      let split = str.split(',');
      this.tranferMail = split[0];
      this.tranferPhone = split[1];
    }
  }

  countTotal(){
    this.total = 0;
    this.dataItem.PRItemList.forEach(element => {
      this.total += element.PRPrice * element.Quantity;
      if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity, 2);
      else element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity);
    });
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') this.Total_String = StringHelper.moneyFormat(this.total, 2) + " " + this.dataItem.Currency;
    else this.Total_String = StringHelper.moneyFormat(this.total) + " " + this.dataItem.Currency;
    
  }

  onChangeProductType(event){
    this.dataItem.ProductType = event.target.value;
  }

  onDeletePRItem(id){
    var lastest = false;
    var itemIndex = this.dataItem.PRItemList.findIndex(obj => obj.RowIndex == id);
    if (itemIndex > -1) {
      if(itemIndex == this.dataItem.PRItemList.length - 1) lastest = true;
      this.dataItem.PRItemList.splice(itemIndex, 1);
    }
    var rowIndex = 0;
    this.dataItem.PRItemList.forEach(element => {
      rowIndex++;
      element.RowIndex = rowIndex;
    });
    if(lastest == true) this.onCreatePRItem();
    this.countTotal();
  }

  acceptBtnModalClicked(){
    if(this.ReceiptDate){ this.dataItem.ReceiptDate = moment(this.ReceiptDate).format("MM/DD/YYYY");}
    else{this.dataItem.ReceiptDate = '';}
    this.dataItem.PICGroup = this.picGroup;
    this.dataItem.CreateBy = this.userInfo.code;
    this.dataItem.UpdateBy = this.userInfo.code;
    this.spinner.show();
    if(this.type == 'New'){
      this.orderService.PRMaster_Create(this.dataItem).subscribe(x => {
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
    else if(this.type == 'Clone'){
      this.orderService.PRMaster_Create(this.dataItem).subscribe(x => {
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
    else{
      this.orderService.PRMaster_Edit(this.dataItem).subscribe(x => {
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

  onCalRemainBudgetBefore(){
    if(!StringHelper.isNullOrEmpty(this.dataItem.WorkingBudget) && !StringHelper.isNullOrEmpty(this.budgetUse.Total)){
      this.dataItem.RemainBudget = this.dataItem.WorkingBudget - this.budgetUse.Total;
    }
  }

  onCalRemainBudgetAfter(){
    if(!StringHelper.isNullOrEmpty(this.dataItem.RemainBudget) && !StringHelper.isNullOrEmpty(this.dataItem.TotalBudget)){
      this.dataItem.RemainWorkingBudget = this.dataItem.RemainBudget - this.dataItem.TotalBudget;
    }
  }

  //------------------------- PRODUCT
  openPopupCreate(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefCreate = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadDataForm();
        this.hasChanged = false;
      }
    });
  }
  openPopupEdit(template: TemplateRef<any>, id) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadDataForm();
        this.hasChanged = false;
      }
    });
  }
  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.ErrorCode == "00") {
      this.hasChanged = true;
    }
  }
  filterProductList(){
    this.productList = [];
    this.serviceList = [];
    this.dataForm.ProductList.forEach(element => {
      if(element.ProductType == 1 ){
        this.productList.push(element);
      }
      if(element.ProductType == 3){
        this.serviceList.push(element);
      }
    });
  }
  triggerEnter(event, id) {
    if(event.key == "Enter"){
      this.loadJigData(id);      
    }
  }
  loadJigData(id){
    var itemIndex = this.dataItem.PRItemList.findIndex(obj => obj.RowIndex == id);
    if (itemIndex > -1) {
      var drawingNo = this.dataItem.PRItemList[itemIndex].ProductName;
      this.orderService.JigType_GetByDrawingNo(drawingNo).subscribe(x => {
        if(x.ErrorCode == "00"){
          this.dataItem.PRItemList[itemIndex].JigTypeID = x.ID;
          this.dataItem.PRItemList[itemIndex].ProductName = x.DrawingNo;
          this.dataItem.PRItemList[itemIndex].ProductDes = x.JigTypeName;
          this.dataItem.PRItemList[itemIndex].PRPrice = x.OriginPrice;
        }else{
          this.dataItem.PRItemList[itemIndex].JigTypeID = '';
          this.dataItem.PRItemList[itemIndex].ProductName = '';
          this.dataItem.PRItemList[itemIndex].ProductDes = '';
        }
      });
      if(itemIndex == this.dataItem.PRItemList.length - 1){
        this.onCreatePRItem();
      }
    }
  }
  //------------------------- TIME
  timer:number;
  timeoutVal:number = 1000; 

  handleKeyUp(e) {
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      this.countTotal();
    }, this.timeoutVal);
  }

  handleKeyPress(e) {
    window.clearTimeout(this.timer);
  }
  //-------------
}
