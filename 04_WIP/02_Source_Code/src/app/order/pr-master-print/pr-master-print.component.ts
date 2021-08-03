import { StringHelper } from './../../_helpers/string.helper';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './../../_services/order.service';
import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-pr-master-print',
  templateUrl: './pr-master-print.component.html',
  styleUrls: ['./pr-master-print.component.css']
})
export class PrMasterPrintComponent implements OnInit {
  prNo: string;
  private sub: any;
  remainTask: number = 28;
  Total_String: any;
  today = new Date();
  printDate: any;

  prItemList = new BaseListModel();

  dataItem: any = {
    PRNo: '',
    PICGroup: '',
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Currency: '',
    Status: '',
    Remark: '',
  }

  quaTotal: number = 0;
  difference: boolean = false;

  dataForm: any = {
    
  }

  constructor(
    private orderService:OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute,
  ) { 
    
  }

  ngOnInit() {
    this.printDate = moment(this.today).format('DD/MM/YYYY');
    this.onLoadData();
    this.onLoadPRItemList();
  }

  onLoadData() {
    this.sub = this.route.params.subscribe(params => {
      this.prNo = params['id'];
    });
    this.orderService.PRMaster_GetByID(this.prNo).subscribe(x => {
      this.dataItem = x;
    });
  }

  onLoadPRItemList(){
    this.orderService.PRItem_GetList_ByPR(this.prNo).subscribe(x => {
      this.prItemList = x;
      this.remainTask = this.remainTask - this.prItemList.DataList.length;
      this.countTotal();
    });
  }

  countTotal(){
    let total = 0;
    let firstUnit = '';
    this.prItemList.DataList.forEach(element => {
      if(firstUnit == ''){
        firstUnit = element.UnitName;
        this.quaTotal = element.Quantity;
      }
      else{
        if(firstUnit == element.UnitName) this.quaTotal += element.Quantity;
        else {
          this.difference = true;
        }
      }
      total += element.PRPrice * element.Quantity;
      if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity, 2);
      else element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity);
    });
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') this.Total_String = StringHelper.moneyFormat(total, 2);
    else this.Total_String = StringHelper.moneyFormat(total);
  }

  onPrint(){
    this.printDate = moment(this.today).format('DD/MM/YYYY');
    window.print();
  }

  formatMoney(money: any, currency: any){
    if(currency == 'USD' || currency == 'JPN') return StringHelper.moneyFormat(money, 2) + " " + currency;
    else return StringHelper.moneyFormat(money) + " " + currency;
  }

  formatMoneyUnitPrice(money: any){
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') return StringHelper.moneyFormat(money, 2);
    else return StringHelper.moneyFormat(money);
  }
}
