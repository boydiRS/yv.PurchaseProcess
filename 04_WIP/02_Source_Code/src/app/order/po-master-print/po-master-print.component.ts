import { StringHelper } from './../../_helpers/string.helper';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './../../_services/order.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-po-master-print',
  templateUrl: './po-master-print.component.html',
  styleUrls: ['./po-master-print.component.css']
})
export class PoMasterPrintComponent implements OnInit {
  poNo: string;
  private sub: any;
  remainTask: number = 10;
  rowHeight: number = 35;
  Total_String: any;
  TotalTax_String: any;
  TotalNoTax_String: any;

  prItemList = new BaseListModel();

  dataItem: any = {
    PRNo: '',
    VATTax: '',
    PICGroup: '',
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Currency: '',
    QuotationNo: '',
    Status: '',
    IncotermID: '',
    PaymenttermID: '',
    Remark: '',
  }

  dataForm: any = {
    
  }

  currentDate:string = '';
  currentDateVN:string = '';

  constructor(
    private orderService:OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute,
  ) { 
    
  }

  ngOnInit() {
    let today = new Date();
    this.currentDate = 'Date: ' + today.getDate() + "/" + (today.getMonth() + 1).toString() + "/" + today.getFullYear();
    this.currentDateVN = 'Ngày ' + today.getDate() + " tháng " + (today.getMonth() + 1).toString() + " năm " + today.getFullYear();
    this.sub = this.route.params.subscribe(params => {
      this.poNo = params['id'];
    });
    this.loadData();
  }

  loadData(){
    this.onLoadData();
  }

  onLoadData() {
    this.orderService.POMaster_GetByID(this.poNo).subscribe(x => {
      this.dataItem = x;
      this.onLoadPRItemList();
    });
  }

  onLoadPRItemList(){
    this.orderService.PRItem_GetList_ByPO(this.poNo).subscribe(x => {
      this.prItemList = x;
      this.remainTask = 15 - this.prItemList.DataList.length;
      this.countTotal();
    });
  }

  countTotal(){
    let total = 0;
    let totalTax = 0;
    this.prItemList.DataList.forEach(element => {
      total += element.POPrice * element.Quantity;
      if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal = StringHelper.moneyFormat(element.POPrice * element.Quantity, 2);
      else element.SubTotal = StringHelper.moneyFormat(element.POPrice * element.Quantity);
    });
    totalTax = total * parseInt(this.dataItem.VATTax) / 100;
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') {
      this.TotalNoTax_String = StringHelper.moneyFormat(total, 2) + " " + this.dataItem.Currency;
      this.TotalTax_String = StringHelper.moneyFormat(totalTax, 2) + " " + this.dataItem.Currency;
      this.Total_String = StringHelper.moneyFormat(total + totalTax, 2) + " " + this.dataItem.Currency;  
    }
    else {
      this.TotalNoTax_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
      this.TotalTax_String = StringHelper.moneyFormat(totalTax) + " " + this.dataItem.Currency;
      this.Total_String = StringHelper.moneyFormat(total + totalTax) + " " + this.dataItem.Currency;
    }
  }

  onPrint(){
    window.print();
  }

  formatMoney(money: any, currency: any){
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') return StringHelper.moneyFormat(money, 2) + " " + currency;
    else return StringHelper.moneyFormat(money) + " " + currency;
  }
}
