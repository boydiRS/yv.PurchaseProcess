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
  selector: 'app-er-master-edit',
  templateUrl: './er-master-edit.component.html',
  styleUrls: ['./er-master-edit.component.css']
})
export class ErMasterEditComponent implements OnInit {
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
  SendDate: any;

  erNo: string;
  title: string;
  buttonName: string;

  total: number = 0;
  Total_String: string = "0";
  tranferMail: string = '';
  tranferPhone: string = '';
  length: string = '';
  width: string = '';
  height: string = '';

  dataItem: any = {
    ERNo: '',
    PICGroup: '',
    SupplierID: '',
    SendDate: '',
    Currency: 'VND',
    TranferID: '',
    TranferSectionID: '',
    ShipmentBy: '1',
    Purpose: '1',
    ERType: 'true',
    ShipmentType: '1',
    PaymentType: '1',
    TotalWeight: '',
    Dimension: '',

    CreateBy: '',
    UpdateBy: '',
    ERItemList: [],
    CargoList: [],
  }

  dataForm: any = {
    SupplierList: [],
    CurrencyList: [],
    UnitList: [],
    TranferSectionList: [],
    TranferList: [],
    CountryList: [],

    ShipmentByList: [],
    PurposeList: [],
    ShipmentTypeList: [],
    PaymentTypeList: [],
    TypeGoodsList: [],
  }

  erItemList = new BaseListModel();

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
    this.erNo = this.id;
    this.onLoadDataForm();
    if(this.type == 'New'){
      this.title = 'New';
      this.buttonName = "ADD NEW";
    }
    else if(this.type == 'Clone'){
      this.title = 'Clone';
      this.buttonName = "ADD NEW";
      this.loadData();
    }else{
      this.title = this.erNo;
      this.buttonName = "UPDATE";
      this.loadData();
    }
  }

  loadData() {
    this.orderService.ERMaster_GetByID(this.erNo).subscribe(x => {
      this.dataItem = x;

      if(this.dataItem.Dimension != null) {
        var str = this.dataItem.Dimension.split('x');
        if(str.length >= 3){
          this.length = str[0];
          this.width = str[1];
          this.height = str[2];
        }
      }
      if(this.dataItem.SupplierID != null) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.ShipmentBy != null) this.dataItem.ShipmentBy = this.dataItem.ShipmentBy.toString();
      if(this.dataItem.ShipmentBy != null) this.dataItem.ShipmentBy = this.dataItem.ShipmentBy.toString();
      if(this.dataItem.Purpose != null) this.dataItem.Purpose = this.dataItem.Purpose.toString();
      if(this.dataItem.ERType != null) this.dataItem.ERType = this.dataItem.ERType.toString();
      if(this.dataItem.ShipmentType != null) this.dataItem.ShipmentType = this.dataItem.ShipmentType.toString();
      if(this.dataItem.PaymentType != null) this.dataItem.PaymentType = this.dataItem.PaymentType.toString();
      if(this.dataItem.TranferID != null) this.dataItem.TranferID = this.dataItem.TranferID.toString();
      // if(this.dataItem.TranferSectionID != null) this.dataItem.TranferSectionID = this.dataItem.TranferSectionID.toString();
      if(this.dataItem.SendDate != null) this.SendDate = new Date(this.dataItem.SendDate);
      this.onLoadERItemList();
    });
  }

  onLoadERItemList(){
    this.orderService.ERItem_GetList_ByER(this.erNo).subscribe(x => {
      this.erItemList = x;
      this.dataItem.ERItemList = this.erItemList.DataList;
      this.onCreateERItem();
      this.countTotal();
    });
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_ERMasterCreate().subscribe(x => {
      this.dataForm = x;
    });
  }

  onCreateERItem() {
    let rowIndex = this.dataItem.ERItemList.length;
    this.dataItem.ERItemList.push({
      RowIndex: rowIndex + 1,
      ProductName: '',
      ProductDes: '',
      Price: '0',
      Country: 'Japan',
      Weight: 0,
      Currency: 'VND',
      Quantity: '1',
      UnitID: '1',
      SubTotal: '0',
    });
  }

  onChangeCurrency(event){
    this.dataItem.Currency = event[0].value;
    if(this.firstLoad){
      this.firstLoad = false;
    }else{
      this.countTotal();
    }
  }

  formatMoney(money: any, currency: any){
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  countTotal(){
    this.dataItem.ERItemList = this.erItemList.DataList;
    console.log(this.erItemList.DataList);
    let total = 0;
    let totalTax = 0;
    this.dataItem.ERItemList.forEach(element => {
      total += element.Price * element.Quantity;
      element.SubTotal = StringHelper.moneyFormat(element.Price * element.Quantity);
    });
    totalTax = total * 0.1;
    this.Total_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
  }

  onDeleteERItem(id){
    var lastest = false;
    var itemIndex = this.dataItem.ERItemList.findIndex(obj => obj.RowIndex == id);
    if (itemIndex > -1) {
      if(itemIndex == this.dataItem.ERItemList.length - 1) lastest = true;
      this.dataItem.ERItemList.splice(itemIndex, 1);
    }
    var rowIndex = 0;
    this.dataItem.ERItemList.forEach(element => {
      rowIndex++;
      element.RowIndex = rowIndex;
    });
    if(lastest == true) this.onCreateERItem();
    this.countTotal();
  }

  acceptBtnModalClicked(){
    if(this.SendDate) this.dataItem.SendDate = moment(this.SendDate).format("MM/DD/YYYY");
    else this.dataItem.SendDate = '';
    this.dataItem.PICGroup = this.picGroup;
    this.dataItem.CreateBy = this.dataItem.UpdateBy = this.userInfo.code;
    this.dataItem.Dimension = this.length + "x" + this.width + "x" + this.height;

    this.spinner.show();
    if(this.type == 'New'){
      this.orderService.ERMaster_Create(this.dataItem).subscribe(x => {
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
      this.orderService.ERMaster_Create(this.dataItem).subscribe(x => {
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
      this.orderService.ERMaster_Edit(this.dataItem).subscribe(x => {
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
