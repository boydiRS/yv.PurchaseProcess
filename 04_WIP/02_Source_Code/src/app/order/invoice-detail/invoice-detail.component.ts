import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './../../_services/common.service';
import { BsModalRef } from 'ngx-bootstrap';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Input() prCheck: boolean;
  @Output() acceptBtnModalClick = new EventEmitter();

  bsModalRefPrint: BsModalRef;
  public invoiceNo: string;
  private sub: any;

  isConfirm: boolean = false;
  isReturn: boolean = false;
  total: number = 0;
  Total_String: string = "0";
  poNo: '';

  dataItem: any = {
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

    CreateBy: '',
    UpdateBy: '',
  }

  prItemList = new BaseListModel();

  constructor(
    private orderService:OrderService,
    private route:ActivatedRoute,
    private commonService:CommonService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.innerHeight = window.innerHeight - 545;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 545;
    this.invoiceNo = this.id;
    this.loadData();
    this.onLoadPRItemList();
  }

  loadData() {
    this.orderService.InvoiceMaster_GetByID(this.invoiceNo).subscribe(x => {
      this.dataItem = x;

      if(this.prCheck){
        if(this.dataItem.Status == 1144) { //new PR
          this.isConfirm = true;
        }
      }
    });
  }

  onLoadPRItemList(){
    this.orderService.PRItem_GetList_ByInvoice(this.invoiceNo).subscribe(x => {
      this.prItemList = x;
      this.countTotal();
    });
  }

  confirmClicked(){
    this.spinner.show();
    this.orderService.PRMaster_Confirm(this.invoiceNo).subscribe(x => {
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

  returnClicked(){
    this.spinner.show();
    this.orderService.PRMaster_Return(this.invoiceNo).subscribe(x => {
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
    this.prItemList.DataList.forEach(element => {
      total += element.POPrice * element.Quantity;
      element.SubTotal = StringHelper.moneyFormat(element.POPrice * element.Quantity) + " " + this.dataItem.Currency;
    });
    this.Total_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
  }

  openPopupPrint(template: TemplateRef<any>) {
    this.bsModalRefPrint = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      
    });
  }
}
