import { WorkingProcessConst } from './../../_models/const/WorkingProcessConst';
import { CommonService } from 'src/app/_services/common.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { UserInfoModel } from '../../_models/user/UserSessionModel';
import { SystemService } from 'src/app/_services/system.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-po-master-detail',
  templateUrl: './po-master-detail.component.html',
  styleUrls: ['./po-master-detail.component.css']
})
export class PoMasterDetailComponent implements OnInit {
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
    private systemService:SystemService,
    private userService:UserService,
    private commonService:CommonService,
    private router:Router,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 340;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 340;
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
      this.onCountTotal();
    });
  }

  // processPRItemList(){
  //   this.prItemList.DataList.forEach(element => {
  //     element.Price_String = StringHelper.moneyFormat(element.POPrice) + " " + this.dataItem.Currency;
  //     element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity) + " " + this.dataItem.Currency;
  //   });
  //   this.onCountTotal();
  // }

  onCountTotal(){
    let total = 0;
    let totalTax = 0;
    this.prItemList.DataList.forEach(element => {
      total += element.POPrice * element.Quantity;
      if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity, 2) + " " + this.dataItem.Currency;
      else element.SubTotal_String = StringHelper.moneyFormat(element.POPrice * element.Quantity) + " " + this.dataItem.Currency;
    });
    totalTax = total * parseInt(this.dataItem.VATTax) / 100;
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') {
      this.TotalNoTax_String = StringHelper.moneyFormat(total, 2) + " " + this.dataItem.Currency;
      this.TotalTax_String = StringHelper.moneyFormat(totalTax, 2) + " " + this.dataItem.Currency;
      this.Total_String = StringHelper.moneyFormat(total + totalTax, 2) + " " + this.dataItem.Currency;
    }else{
      this.TotalNoTax_String = StringHelper.moneyFormat(total) + " " + this.dataItem.Currency;
      this.TotalTax_String = StringHelper.moneyFormat(totalTax) + " " + this.dataItem.Currency;
      this.Total_String = StringHelper.moneyFormat(total + totalTax) + " " + this.dataItem.Currency;
    }
  }
  
  moneyFormat(str){
    if(this.dataItem.Currency == 'USD' || this.dataItem.Currency == 'JPN') StringHelper.moneyFormat(str, 2) + " " + this.dataItem.Currency;
    else return StringHelper.moneyFormat(str) + " " + this.dataItem.Currency;
  }

  openPopupPrint(template: TemplateRef<any>) {
    this.bsModalRefPrint = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      
    });
  }

  onPrint(poNo){
    this.bsModalRef.hide();
    this.router.navigate(['/order/po-print', poNo]);
  }
}
