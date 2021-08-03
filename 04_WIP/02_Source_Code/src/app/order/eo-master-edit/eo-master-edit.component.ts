import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { UserInfoModel } from '../../_models/user/UserSessionModel';
import { DataformService } from 'src/app/_services/dataform.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-eo-master-edit',
  templateUrl: './eo-master-edit.component.html',
  styleUrls: ['./eo-master-edit.component.css']
})
export class EoMasterEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() picGroup:string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  userInfo:UserInfoModel;

  InvoiceNoTitle:string = '';
  ButtonName:string = '';
  TotalNoTax_String: string = "0";
  TotalTax_String: string = "0";
  Total_String: string = "0";
  InvoiceDate: any;
  ExportDate: any;

  dataItem: any = {
    InvoiceNo: '',
    InvoiceDate: '',
    InvoiceType: 'false',
    BillNo: '',

    SupplierID: '',
    IncotermID: '',
    TotalWeight: '0',
    ExportDate: '',

    ForwaderID: '',
    CarierID: '',

    ExportFee: '0',
    CDSFee: '0',

    PRItemList: [],

    CreateBy: '',
    UpdateBy: '',
  }

  prDataItem: any = {
    SupplierName: '',
    ReceiptDate: '',
    RequestNo: '',
    Remark: '',
  }

  ERNo: string = '';

  dataForm: any = {
    SupplierList: [],
    IncotermList: [],
    ERList: [],
  }

  prItemOriginList = new BaseListModel();
  prItemNotSelectList: any = [];

  constructor(
    private orderService:OrderService,
    private dataFormService:DataformService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.onLoadDataForm();
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_EOMasterCreate().subscribe(x => {
      this.dataForm = x;
      if(this.id == null) {
        this.dataItem.CreateBy = this.userInfo.code;
        this.onInitNew();
      }
      else {
        this.dataItem.UpdateBy = this.userInfo.code;
        this.onInitUpdate();
      }
    });
  }

  onInitNew(){
    this.InvoiceNoTitle = 'New';
    this.ButtonName = "ADD NEW";
  }

  onInitUpdate(){
    this.InvoiceNoTitle = "Update";
    this.ButtonName = "UPDATE";
    this.loadData();
  }

  loadData() {
    this.orderService.EOMaster_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.InvoiceType != null) this.dataItem.InvoiceType = this.dataItem.InvoiceType.toString();
      if(this.dataItem.TA_OverseaID != null) this.dataItem.TA_OverseaID = this.dataItem.TA_OverseaID.toString();
      if(this.dataItem.TA_ForwaderID != null) this.dataItem.TA_ForwaderID = this.dataItem.TA_ForwaderID.toString();
      if(this.dataItem.TA_TruckingFee != null) this.dataItem.TA_TruckingFee = this.dataItem.TA_TruckingFee.toString();

      if(this.dataItem.InvoiceDate != null) this.InvoiceDate = new Date(this.dataItem.InvoiceDate);
      if(this.dataItem.ExportDate != null) this.ExportDate = new Date(this.dataItem.ExportDate);
      if(this.dataItem.SupplierID != null) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      this.loadEOItem();
    });
  }

  onChangeERNo(event){
    if(event.length == 0) this.ERNo = '';
    else this.ERNo = event[0].value;
    this.loadER();
  }

  loadER(){
    this.orderService.ERItem_GetList_ByER(this.ERNo, true).subscribe(x => {
      this.prItemOriginList = x;
      this.prItemNotSelectList = [];
      this.prItemOriginList.DataList.forEach(element => {
        var check = true;
        if(element.InvoiceNo != null && element.InvoiceNo != ''){
          check = false;
          this.dataItem.PRItemList.forEach(ele => {
            if(ele.ID == element.ID){
              check = false;
            }
          });
        }
        if(check){
          this.prItemNotSelectList.push(element);
        }
      });
    });
  }

  loadEOItem(){
    this.orderService.ERItem_GetList_ByEO(this.id).subscribe(x => {
      this.dataItem.PRItemList = x.DataList;
      this.onCountTotal();
    });
  }

  processERItemList(){
    this.prItemNotSelectList = [];
    this.prItemOriginList.DataList.forEach(element => {
      if(element.Price != null && element.Quantity != null){
        element.Price_String = StringHelper.moneyFormat(element.Price);
        element.SubTotal_String = StringHelper.moneyFormat(element.Price * element.Quantity);
      }
      if(element.InvoiceID == null){
        this.prItemNotSelectList.push(element);
      }
    });
    this.onCountTotal();
  }

  onCountTotal(){
    let total = 0;
    let totalTax = 0;
    if(this.dataItem.PRItemList != null){
      this.dataItem.PRItemList.forEach(element => {
        total += element.Price * element.Quantity;
        element.SubTotal_String = StringHelper.moneyFormat(element.Price * element.Quantity);
      });
    }
    totalTax = total * parseInt(this.dataItem.VATTax) / 100;
    this.Total_String = StringHelper.moneyFormat(total);// + " " + this.dataItem.Currency;
  }

  onAddAllToPO(){
    this.prItemNotSelectList.forEach(element => {
      this.dataItem.PRItemList.push(element);
    });
    this.prItemNotSelectList = [];
    this.onCountTotal();
  }

  onAddToPO(id){
    var itemIndex = this.prItemNotSelectList.findIndex(obj => obj.ID == id);
    if (itemIndex > -1) {
      this.dataItem.PRItemList.push(this.prItemNotSelectList[itemIndex]);
      this.prItemNotSelectList.splice(itemIndex, 1);
    }
    this.onCountTotal();
  }

  onRemoveFromPO(id){
    var itemIndex = this.dataItem.PRItemList.findIndex(obj => obj.ID == id);
    if (itemIndex > -1) {
      if(this.ERNo == this.dataItem.PRItemList[itemIndex].ERNo){
        this.prItemNotSelectList.push(this.dataItem.PRItemList[itemIndex]);
      }
      this.dataItem.PRItemList.splice(itemIndex, 1);
    }
  }

  onRemoveAllFromPO(){
    this.dataItem.PRItemList.forEach(element => {
      if(this.ERNo == element.ERNo){
        this.prItemNotSelectList.push(element);
      }
    });
    this.dataItem.PRItemList = [];
    this.onCountTotal();
  }

  acceptBtnModalClicked(){
    if(this.InvoiceDate){ this.dataItem.InvoiceDate = moment(this.InvoiceDate).format("MM/DD/YYYY");}
    else{this.dataItem.InvoiceDate = '';}
    if(this.ExportDate){ this.dataItem.ExportDate = moment(this.ExportDate).format("MM/DD/YYYY");}
    else{this.dataItem.ExportDate = '';}

    this.spinner.show();
    if(this.id == null){
      this.orderService.EOMaster_Create(this.dataItem).subscribe(x => {
        this.spinner.hide();
        if (x.ErrorCode !== '00') {
          this.toastr.error(x.Message);
        } else {
          this.toastr.success(x.Message);
          this.acceptBtnModalClick.emit(x);
          this.bsModalRef.hide();
        }
      });
    }else{
      this.orderService.EOMaster_Edit(this.dataItem).subscribe(x => {
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

  moneyFormat(str){
    return StringHelper.moneyFormat(str);
  }

  timer:number;
  timeoutVal:number = 1000; 

  handleKeyUp(e) {
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      this.onCountTotal();
    }, this.timeoutVal);
  }

  handleKeyPress(e) {
    window.clearTimeout(this.timer);
  }
}
