import { StringHelper } from './../../_helpers/string.helper';
import { CommonService } from 'src/app/_services/common.service';
import { DataformService } from 'src/app/_services/dataform.service';
import { OrderService } from '../../_services/order.service';
import { WorkingProcessConst } from '../../_models/const/WorkingProcessConst';
import { SystemService } from 'src/app/_services/system.service';
import { Component, OnInit, HostListener, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-po-item-list',
  templateUrl: './po-item-list.component.html',
  styleUrls: ['./po-item-list.component.css']
})
export class PoItemListComponent implements OnInit {
  id: string = '';
  bsModalRefEdit: BsModalRef;
  bsModalRefDetail: BsModalRef;
  bsModalRefReceipt: BsModalRef;
  bsModalRefInvoice: BsModalRef;
  bsModalRefPayDay: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    PRNo: '',
    SupplierID: '',
    IncotermCode: '',
    PICGroup: '',
    ReceiptFromDate: '',
    ReceiptToDate: '',
    PaydayCheck: false,
    ReceiptCheck: false,
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  isShowContract:boolean = false;

  ReceiptFromDate: '';
  ReceiptToDate: '';

  ReceiptActualFromDate: '';
  ReceiptActualToDate: '';

  createData: any = {
    PICGroup: '',
    CreateBy: '',
  }

  dataForm: any = {
    SupplierList: [],
    IncotermList: [],
    PICGroupList: [],
  }

  ListID: any = [];

  CategoryList: any = [];

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();

  constructor(
    private orderService:OrderService,
    private systemService:SystemService,
    private userService:UserService,
    private dataFormService:DataformService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
    private router:Router
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 172;
  }

  permissionData:any = {
    IsPer: false
  };

  picPermissionData:any = {
    IsPer: false
  };

  loadPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PO, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
      if(this.permissionData.IsPer === false) this.router.navigate(["khong-co-quyen-truy-cap"]);
      else this.onInit();
    });
  }

  loadPICPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PO, this.userInfo.code, 1).subscribe(x => {
      this.picPermissionData = x;
    });
  }

  onInit(){
    this.createData.CreateBy = this.userInfo.code;
    this.innerHeight = window.innerHeight - 172;
    this.loadDataForm();
    this.loadPICPermission();
  }

  ngOnInit() {
    this.loadPermission();
  }

  loadData() {
    this.isShowContract = this.searchData.ContractCheck;
    if(this.ReceiptFromDate) this.searchData.ReceiptFromDate = moment(this.ReceiptFromDate).format("MM/DD/YYYY");
    else this.searchData.ReceiptFromDate = '';

    if(this.ReceiptToDate) this.searchData.ReceiptToDate = moment(this.ReceiptToDate).format("MM/DD/YYYY");
    else this.searchData.ReceiptToDate = '';

    if(this.ReceiptActualFromDate) this.searchData.ReceiptActualFromDate = moment(this.ReceiptActualFromDate).format("MM/DD/YYYY");
    else this.searchData.ReceiptActualFromDate = '';

    if(this.ReceiptActualToDate) this.searchData.ReceiptActualToDate = moment(this.ReceiptActualToDate).format("MM/DD/YYYY");
    else this.searchData.ReceiptActualToDate = '';
      
    this.loadingIndicator = true;
    this.orderService.POItem_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
    this.ListID = [];
    this.selected = [];
  }

  exportExcel(){

  }

  loadDataForm() {
    this.dataFormService.DataForm_POMasterList().subscribe(x => {
      this.dataForm = x;
    });
  }

  openPopupEdit(template: TemplateRef<any>, id: any) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupDetail(template: TemplateRef<any>, id: any) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefDetail = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupReceipt(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefReceipt = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupInvoice(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefInvoice = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupPayDay(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefPayDay = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.ErrorCode == "00") {
      this.hasChanged = true;
    }
  }

  formatMoney(money: any, currency: any = null){
    return StringHelper.moneyFormat(money) + " " + currency;
  }
  //-------------------
  setPage(pageInfo) {
    if (pageInfo.count != null) this.searchData.PageIndex = pageInfo.offset + 1;
    this.loadData();
  }

  onSort(sortInfo) {
    this.searchData.SortColumn = sortInfo.sorts[0].prop;
    this.searchData.SortColumnDir = sortInfo.sorts[0].dir;
    this.loadData();
  }

  onChangeRowPerPage(event){
    this.searchData.ItemsPerPage = event.target.value;
    this.loadData();
  }

  triggerEnter(event) {
    if (event.key == "Enter") {
      this.loadData();
    }
  }

  onChangeSupplier(event){
    if(event.length > 0) this.searchData.SupplierID = event[0].value;
    else this.searchData.SupplierID = null;
    this.loadData();
  }

  onChangePICGroup(event){
    if(event.length > 0) this.searchData.PICGroup = event[0].value;
    else this.searchData.PICGroup = null;
    this.loadData();
  }
  //-------- Check box
  selected = [];
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.ListID = [];
    this.selected.forEach(element => {
      if(element.ID != null) this.ListID.push(element.ID);
    });
  }

  onChangeReceiptCheck(){
    this.searchData.ReceiptCheck = !this.searchData.ReceiptCheck;
  }

  onChangePaydayCheck(){
    this.searchData.PaydayCheck = !this.searchData.PaydayCheck;
  }

  onChangeContractCheck(){
    this.searchData.ContractCheck = !this.searchData.ContractCheck;
  }
}
