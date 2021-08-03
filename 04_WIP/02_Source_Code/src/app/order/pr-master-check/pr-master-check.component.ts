import { BaseListModel } from './../../_models/base/BaseListModel';
import { StringHelper } from './../../_helpers/string.helper';
import { OrderService } from '../../_services/order.service';
import { WorkingProcessConst } from '../../_models/const/WorkingProcessConst';
import { SystemService } from 'src/app/_services/system.service';
import { DataformService } from 'src/app/_services/dataform.service';
import { Component, OnInit, ChangeDetectorRef, HostListener, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pr-master-check',
  templateUrl: './pr-master-check.component.html',
  styleUrls: ['./pr-master-check.component.css']
})
export class PrMasterCheckComponent implements OnInit {
  id: string;
  bsModalRefDetail: BsModalRef;
  bsModalRefEdit: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    PRNo: '',
    RequestNo: '',
    PIC: '',
    PICGroup: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  createData: any = {
    PICGroup: '',
    CreateBy: '',
  }

  dataForm: any = {
    StatusList: [],
    PICGroupList: [],
  }

  CategoryList: any = [];

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();

  constructor(
    private orderService:OrderService,
    private systemService:SystemService,
    private dataFormService:DataformService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
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

  changePermissionData:any = {
    IsPer: false
  };

  loadPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PO, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
      if(this.permissionData.IsPer === false) this.router.navigate(["khong-co-quyen-truy-cap"]);
      else this.onInit();
    });
  }

  loadChangePermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PR, this.userInfo.code, 1).subscribe(x => {
      this.changePermissionData = x;
    });
  }

  onInit(){
    this.createData.CreateBy = this.userInfo.code;
    this.innerHeight = window.innerHeight - 170;
    this.loadDataForm();
    this.loadChangePermission();
  }

  ngOnInit() {
    this.loadPermission();
  }

  onLoadData() {
    this.loadingIndicator = true;
    this.orderService.PRMasterCheck_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_PRMasterCheck().subscribe(x => {
      this.dataForm = x;
    });
  }

  setPage(pageInfo) {
    if (pageInfo.count != null) this.searchData.PageIndex = pageInfo.offset + 1;
    this.onLoadData();
  }

  onSort(sortInfo) {
    this.searchData.SortColumn = sortInfo.sorts[0].prop;
    this.searchData.SortColumnDir = sortInfo.sorts[0].dir;
    this.onLoadData();
  }

  onChangeRowPerPage(event){
    this.searchData.ItemsPerPage = event.target.value;
    this.onLoadData();
  }

  openPopupDetail(template: TemplateRef<any>, id: any) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefDetail = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadData();
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

  triggerEnter(event) {
    if (event.key == "Enter") {
      this.onLoadData();
    }
  }

  onChangePICGroup(event){
    if(event.length > 0) this.searchData.PICGroup = event[0].value;
    else this.searchData.PICGroup = null;
    this.onLoadData();
  }

  onChangeStatus(event){
    if(event.length > 0) this.searchData.Status = event[0].value;
    else this.searchData.Status = null;
    this.onLoadData();
  }

  formatMoney(money: any, currency: any = null){
    return StringHelper.moneyFormat(money) + " " + currency;
  }
}
