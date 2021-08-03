import { SupplierService } from './../../_services/supplier.service';
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
  selector: 'app-supplier-check-detail',
  templateUrl: './supplier-check-detail.component.html',
  styleUrls: ['./supplier-check-detail.component.css']
})
export class SupplierCheckDetailComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Input() prCheck: boolean;
  @Output() acceptBtnModalClick = new EventEmitter();

  bsModalRefPrint: BsModalRef;

  isConfirm: boolean = false;
  isReturn: boolean = false;
  total: number = 0;
  Total_String: string = "0";

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
    private supplierService:SupplierService,
    private route:ActivatedRoute,
    private commonService:CommonService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.innerHeight = window.innerHeight - 385;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 385;
    this.loadData();
    // this.onLoadPRItemList();
  }

  loadData() {
    this.supplierService.SupplierCheck_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  formatMoney(money: any, currency: any){
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  countTotal(){
    let total = 0;
    this.prItemList.DataList.forEach(element => {
      total += element.PRPrice * element.Quantity;
      element.SubTotal = StringHelper.moneyFormat(element.PRPrice * element.Quantity) + " " + this.dataItem.Currency;
    });
    this.Total_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
  }

  openPopupPrint(template: TemplateRef<any>) {
    this.bsModalRefPrint = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      
    });
  }
}
