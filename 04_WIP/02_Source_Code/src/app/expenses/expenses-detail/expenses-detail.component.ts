import { CommonService } from 'src/app/_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { UserInfoModel } from '../../_models/user/UserSessionModel';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-expenses-detail',
  templateUrl: './expenses-detail.component.html',
  styleUrls: ['./expenses-detail.component.css']
})
export class ExpensesDetailComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  bsModalRefPrint: BsModalRef;
  userInfo:UserInfoModel;
  @ViewChild('areaComment') areaComment: any;
  fileName: '';
  fileUpload: any;

  public poNo: string;
  private sub: any;

  TotalNoTax_String: string = "0";
  TotalTax_String: string = "0";
  Total_String: string = "0";

  dataItem: any = {
    PONo: '',
    PRNo: '752-20-12-01',
    SupplierID: '',
    SupplierName: '',
    ReceiptDate: '',
    VATTax: '0',
    IncotermID: '',
    Currency: '',
    Remark: '',
    CreateBy: '',
    UpdateBy: '',
  }

  prItemList = new BaseListModel();
  historyList = new BaseListModel();

  constructor(
    private orderService:OrderService,
    private route:ActivatedRoute,
    private userService:UserService,
    private commonService:CommonService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 400;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 400;
    this.poNo = this.id;
    this.loadData();
  }

  loadData() {
    this.orderService.POMaster_GetByID(this.poNo).subscribe(x => {
      this.dataItem = x;
      this.onLoadPRItemOriginList();
    });
  }

  onLoadPRItemOriginList(){
    this.orderService.PRItem_GetList_ByPO(this.poNo).subscribe(x => {
      this.prItemList = x;
      this.processPRItemList();
    });
  }

  processPRItemList(){
    this.prItemList.DataList.forEach(element => {
      element.Price_String = StringHelper.moneyFormat(element.POPrice) + " " + this.dataItem.Currency;
      element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity) + " " + this.dataItem.Currency;
    });
    this.onCountTotal();
  }

  onCountTotal(){
    let total = 0;
    let totalTax = 0;
    this.prItemList.DataList.forEach(element => {
      total += element.POPrice * element.Quantity;
      element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity) + " " + this.dataItem.Currency;
    });
    totalTax = total * parseInt(this.dataItem.VATTax) / 100;
    console.log(this.dataItem.VATTax);
    this.TotalNoTax_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
    this.TotalTax_String = StringHelper.moneyFormat(totalTax) + " " + this.dataItem.Currency;
    this.Total_String = StringHelper.moneyFormat(total + totalTax) + " " + this.dataItem.Currency;
  }
  
  moneyFormat(str){
    return StringHelper.moneyFormat(str) + " " + this.dataItem.Currency;
  }

  openPopupPrint(template: TemplateRef<any>) {
    this.bsModalRefPrint = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      
    });
  }
}
