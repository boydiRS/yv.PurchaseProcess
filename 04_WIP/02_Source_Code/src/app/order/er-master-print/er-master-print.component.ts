import { StringHelper } from './../../_helpers/string.helper';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from './../../_services/order.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-er-master-print',
  templateUrl: './er-master-print.component.html',
  styleUrls: ['./er-master-print.component.css']
})
export class ErMasterPrintComponent implements OnInit {
  erNo: string;
  private sub: any;
  remainTask: number = 12;

  total_Quantity:number = 0;
  total_Unit:string = '';
  total_Weight:number = 0;
  total_Price:number = 0;
  total_Amount:number = 0;

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

  rowTotal:number = 0;

  constructor(
    private orderService:OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute,
  ) { 
    
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.erNo = params['id'];
    });
    this.loadData();
  }

  loadData(){
    this.onLoadData();
  }

  onLoadData() {
    this.orderService.ERMaster_GetByID(this.erNo).subscribe(x => {
      this.dataItem = x;
      this.onLoadPRItemList();
    });
  }

  onLoadPRItemList(){
    this.orderService.ERItem_GetList_ByER(this.erNo, false).subscribe(x => {
      this.prItemList = x;
      this.rowTotal = this.prItemList.DataList.length;
      this.remainTask -= this.rowTotal;
      this.countTotal();
    });
  }

  countTotal(){
    let firstUnit = true;
    this.prItemList.DataList.forEach(element => {
      this.total_Price += element.Price;
      this.total_Amount += element.Price * element.Quantity;
      element.SubTotal = StringHelper.moneyFormat(element.Price * element.Quantity);
      if(firstUnit){
        firstUnit = false;
        this.total_Unit = element.UnitName;
        this.total_Quantity = element.Quantity;
      }else{
        if(this.total_Unit == element.UnitName){
          this.total_Quantity += element.Quantity;
        }else{
          this.total_Unit = '';
        }
      }
    });
  }

  onPrint(){
    window.print();
  }

  formatMoney(money: any, currency: any){
    return StringHelper.moneyFormat(money) + " " + currency;
  }
}
