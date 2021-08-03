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
import swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-pr-master-list',
  templateUrl: './pr-master-list.component.html',
  styleUrls: ['./pr-master-list.component.css']
})
export class PRMasterListComponent implements OnInit {
  type: string;
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
    ReceiptFromDate: '',
    ReceiptToDate: '',
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
    CategoryList: [],
    PICGroupList: [],
    AccCodeList: [],
  }

  CategoryList: any = [];
  ReceiptFromDate: '';
  ReceiptToDate: '';

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
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PR, this.userInfo.code, null).subscribe(x => {
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
    this.onInit();
    // this.loadPermission();
  }

  loadData() {
    if(this.ReceiptFromDate){ this.searchData.ReceiptFromDate = moment(this.ReceiptFromDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptFromDate = '';}

    if(this.ReceiptToDate){this.searchData.ReceiptToDate = moment(this.ReceiptToDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptToDate = '';}

    this.loadingIndicator = true;
    this.orderService.PRMaster_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_PRMasterList(this.userInfo.code).subscribe(x => {
      this.dataForm = x;
      if(this.dataForm.PICGroupList.length > 0){
        this.searchData.PICGroup = this.dataForm.PICGroupList[0].Value;
      }
    });
  }

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

  onDetailClick(e) {
    if (e.type == "click") {
      this.router.navigate(["/order/pr-detail", e.row.PRNo]);
    }
  }

  openPopupEdit(template: TemplateRef<any>, type: any, id: any, status: any = null) {
    let check = true;
    console.log(status);
    if(status != null) {
      if(status != 1144) {
        check = false;
        const swalDelete = swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-default'
          },
          buttonsStyling: false
        })
        swalDelete.fire(
          'Alert!',
          'You can not edit this PR',
          'error'
        )
      }
    }
    if(check){
      this.type = type;
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

  triggerEnter(event) {
    if (event.key == "Enter") {
      this.loadData();
    }
  }

  onChangePICGroup(event){
    this.searchData.PICGroup = event[0].value;
    this.loadData();
  }

  onChangeAccCode(event){
    if(event.length > 0) this.searchData.AccCode = event[0].value;
    else this.searchData.AccCode = '';
    this.loadData();
  }

  onChangeStatus(event){
    if(event.length > 0) this.searchData.Status = event[0].value;
    else this.searchData.Status = null;
    this.loadData();
  }

  formatMoney(money: any, currency: any = null){
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  wordSearch: string;
  listModel = new BaseListModel();
  //------------------------- TIME
  timer:number;
  timeoutVal:number = 1000; 

  handleKeyUp(e) {
    window.clearTimeout(this.timer); // prevent errant multiple timeouts from being generated
    this.timer = window.setTimeout(() => {
      // this.countTotal();
    }, this.timeoutVal);
  }

  handleKeyPress(e) {
    window.clearTimeout(this.timer);
  }
  //-------------
}
