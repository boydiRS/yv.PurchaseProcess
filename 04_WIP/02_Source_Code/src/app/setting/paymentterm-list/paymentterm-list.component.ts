import { OrderService } from './../../_services/order.service';
import { WorkingProcessConst } from './../../_models/const/WorkingProcessConst';
import { SystemService } from 'src/app/_services/system.service';
import { Component, OnInit, ChangeDetectorRef, HostListener, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paymentterm-list',
  templateUrl: './paymentterm-list.component.html',
  styleUrls: ['./paymentterm-list.component.css']
})
export class PaymenttermListComponent implements OnInit {
  id: string;
  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    Name: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  dataForm: any = {
    PICGroupList: [],
    LocationAreaList: [],
  }

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();

  constructor(
    private systemService:SystemService,
    private orderService:OrderService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
    private userService:UserService,
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
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_Paymentterm, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
      if(this.permissionData.IsPer === false) this.router.navigate(["khong-co-quyen-truy-cap"]);
      else this.onInit();
    });
  }

  loadPICPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_Paymentterm, this.userInfo.code, 1).subscribe(x => {
      this.picPermissionData = x;
    });
  }

  onInit(){
    this.innerHeight = window.innerHeight - 170;
    this.onLoadDataForm();
    this.loadPICPermission();
  }

  ngOnInit() {
    this.loadPermission();
  }

  onLoadData() {
    this.loadingIndicator = true;
    this.orderService.Paymentterm_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  onLoadDataForm() {
    
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

  openPopupCreate(template: TemplateRef<any>) {
    console.log(this.userInfo.code);
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefCreate = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupEdit(template: TemplateRef<any>, id: string) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg');
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
}
