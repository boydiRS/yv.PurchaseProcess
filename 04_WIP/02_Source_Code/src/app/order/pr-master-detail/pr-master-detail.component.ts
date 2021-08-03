import { SystemService } from './../../_services/system.service';
import { WorkingProcessConst } from './../../_models/const/WorkingProcessConst';
import { CommonService } from './../../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef } from 'ngx-bootstrap';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-pr-master-detail',
  templateUrl: './pr-master-detail.component.html',
  styleUrls: ['./pr-master-detail.component.css']
})
export class PrMasterDetailComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Input() prCheck: boolean;
  @Output() acceptBtnModalClick = new EventEmitter();

  public prNo: string;

  isConfirm: boolean = false;
  isReturn: boolean = false;
  total: number = 0;
  Total_String: string = "0";

  dataItem: any = {
    PRNo: '',
    PICGroup: '',
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Currency: '',
    Status: '',
    Remark: '',
    CreateBy: '',
    UpdateBy: '',
  }

  prItemList = new BaseListModel();

  constructor(
    private orderService:OrderService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private systemService:SystemService,
    private router: Router,
    private commonService:CommonService,
  ) { }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.innerHeight = window.innerHeight - 385;
  }

  changePermissionData:any = {
    IsPer: false
  };

  loadChangePermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PO, this.updateBy, 1).subscribe(x => {
      this.changePermissionData = x;
    });
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 385;
    this.prNo = this.id;
    this.onLoadData();
    this.onLoadPRItemList();
    this.loadChangePermission();
  }

  onLoadData() {
    this.orderService.PRMaster_GetByID(this.prNo).subscribe(x => {
      this.dataItem = x;

      if(this.prCheck){
        if(this.dataItem.Status == 1144) { //new PR
          this.isConfirm = true;
        }
      }
    });
  }

  onLoadPRItemList(){
    this.orderService.PRItem_GetList_ByPR(this.prNo).subscribe(x => {
      this.prItemList = x;
      this.countTotal();
      if(this.prCheck){
        if(this.dataItem.Status == '1145') { //Confirm
          var check:boolean = true;
          this.prItemList.DataList.forEach(element => {
            if(element.PONo != null && element.PONo != '') check = false;
          });
          this.isReturn = check;
        }
      }
    });
  }

  onConfirm(){
    this.spinner.show();
    this.orderService.PRMaster_Confirm(this.prNo).subscribe(x => {
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

  onReturn(){
    this.spinner.show();
    this.orderService.PRMaster_Return(this.prNo).subscribe(x => {
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

  formatMoney(money: any, currency: any){
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN')return StringHelper.moneyFormat(money, 2) + " " + currency;
    else return StringHelper.moneyFormat(money) + " " + currency;
  }

  countTotal(){
    let total = 0;
    this.prItemList.DataList.forEach(element => {
      total += element.PRPrice * element.Quantity;
      if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity, 2) + " " + this.dataItem.Currency;
      else element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity) + " " + this.dataItem.Currency;
    });
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') this.Total_String = StringHelper.moneyFormat(total, 2) + " " + this.dataItem.Currency;
    else this.Total_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
    
  }

  onPrint(prNo){
    this.bsModalRef.hide();
    this.router.navigate(['/order/pr-print', prNo]);
  }

  onExportExcel(){
    let ReceiptDate = new Date(this.dataItem.ReceiptDate);
    let newList = this.prItemList.DataList.map(function(obj) {
      return {
        No: obj.RowIndex,
        Name: obj.ProductName + " " + obj.ProductDes,
        Delivery: ReceiptDate,
        Quatity: obj.Quantity + " " + obj.UnitName,
      }
    });
    this.commonService.exportExcel(newList, 'Quotation - ' + this.id);
  }
}
