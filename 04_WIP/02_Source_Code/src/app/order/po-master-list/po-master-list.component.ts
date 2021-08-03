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
  selector: 'app-po-master-list',
  templateUrl: './po-master-list.component.html',
  styleUrls: ['./po-master-list.component.css']
})
export class POMasterListComponent implements OnInit {
  id: string = '';
  bsModalRefEdit: BsModalRef;
  bsModalRefDetail: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    PRNo: '',
    SupplierID: '',
    IncotermCode: '',
    ReceiptFromDate: '',
    ReceiptToDate: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  ReceiptFromDate: '';
  ReceiptToDate: '';

  createData: any = {
    PICGroup: '',
    CreateBy: '',
  }

  dataForm: any = {
    SupplierList: [],
    IncotermList: [],
    StatusList: [],
  }

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
    this.innerHeight = window.innerHeight - 170;
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
    this.innerHeight = window.innerHeight - 170;
    this.loadDataForm();
    this.loadPICPermission();
  }

  ngOnInit() {
    this.loadPermission();
  }

  loadData() {
    if(this.ReceiptFromDate){
      this.searchData.ReceiptFromDate = moment(this.ReceiptFromDate).format("MM/DD/YYYY");
    }else{
      this.searchData.ReceiptFromDate = '';
    }

    if(this.ReceiptToDate){
      this.searchData.ReceiptToDate = moment(this.ReceiptToDate).format("MM/DD/YYYY");
    }else{
      this.searchData.ReceiptToDate = '';
    }
    
    this.loadingIndicator = true;
    this.orderService.POMaster_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
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

  onChangeIncoterm(event){
    if(event.length > 0) this.searchData.IncotermCode = event[0].value;
    else this.searchData.IncotermCode = null;
    this.loadData();
  }

  onChangeStatus(event){
    
  }
}
