import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef } from 'ngx-bootstrap';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-eo-master-detail',
  templateUrl: './eo-master-detail.component.html',
  styleUrls: ['./eo-master-detail.component.css']
})
export class EoMasterDetailComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Input() erCheck: boolean;
  @Output() acceptBtnModalClick = new EventEmitter();

  public eoNo: string;

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

  erItemList = new BaseListModel();

  constructor(
    private orderService:OrderService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router: Router,
  ) { }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.innerHeight = window.innerHeight - 385;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 385;
    this.eoNo = this.id;
    this.onLoadData();
    this.onLoadPRItemList();
  }

  onLoadData() {
    this.orderService.EOMaster_GetByID(this.eoNo).subscribe(x => {
      this.dataItem = x;

      if(this.erCheck){
        if(this.dataItem.Status == 1148) { //new ER
          this.isConfirm = true;
        }
      }
    });
  }

  onLoadPRItemList(){
    this.orderService.ERItem_GetList_ByEO(this.eoNo).subscribe(x => {
      this.erItemList = x;
      this.countTotal();
      if(this.erCheck){
        if(this.dataItem.Status == '1149') { //Confirm
          var check:boolean = true;
          this.erItemList.DataList.forEach(element => {
            if(element.PONo != null && element.PONo != '') check = false;
          });
          this.isReturn = check;
        }
      }
    });
  }

  onConfirm(){
    this.spinner.show();
    this.orderService.ERMaster_Confirm(this.eoNo).subscribe(x => {
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
    this.orderService.ERMaster_Return(this.eoNo).subscribe(x => {
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
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  countTotal(){
    let total = 0;
    this.erItemList.DataList.forEach(element => {
      total += element.Price * element.Quantity;
      element.SubTotal = StringHelper.moneyFormat(element.Price * element.Quantity) + " " + element.Currency;
    });
    this.Total_String = StringHelper.moneyFormat(total);// + " " + this.dataItem.Currency;
  }

  onPrint(prNo){
    this.bsModalRef.hide();
    this.router.navigate(['/order/pr-print', prNo]);
  }
}
