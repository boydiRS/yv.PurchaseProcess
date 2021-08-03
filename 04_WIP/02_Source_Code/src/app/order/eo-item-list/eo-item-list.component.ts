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
  selector: 'app-eo-item-list',
  templateUrl: './eo-item-list.component.html',
  styleUrls: ['./eo-item-list.component.css']
})
export class EoItemListComponent implements OnInit {
  type: string;
  id: string;
  bsModalRefDetail: BsModalRef;
  bsModalRefEdit: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  ExportFromDate: '';
  ExportToDate: '';

  hasChanged:boolean = false;

  searchData: any = {
    ERNo: '',
    PICGroup: '',
    SendFromDate: '',
    SendToDate: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  dataForm: any = {
    PICGroupList: [],
    SupplierList: [],
  }

  SendFromDate: '';
  SendToDate: '';

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

  loadPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PR, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
      if(this.permissionData.IsPer === false) this.router.navigate(["khong-co-quyen-truy-cap"]);

      this.innerHeight = window.innerHeight - 170;
      this.loadDataForm();
    });
  }

  ngOnInit() {
    this.loadPermission();
  }

  loadData() {
    if(this.SendFromDate){ this.searchData.ReceiptFromDate = moment(this.SendFromDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptFromDate = '';}

    if(this.SendToDate){this.searchData.ReceiptToDate = moment(this.SendToDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptToDate = '';}

    this.loadingIndicator = true;
    this.orderService.ERItem_GetAll_ByEO(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_EOMasterList().subscribe(x => {
      this.dataForm = x;
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

  openPopupCreate(template: TemplateRef<any>){
    this.id = null;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupEdit(template: TemplateRef<any>, id: any, status: any = null) {
    let check = true;
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
    if(event.length > 0) this.searchData.PICGroup = event[0].value;
    else this.searchData.PICGroup = null;
    this.loadData();
  }

  onChangeSupplier(event){
    if(event.length > 0) this.searchData.SupplierID = event[0].value;
    else this.searchData.SupplierID = null;
    this.loadData();
  }

  formatMoney(money: any, currency: any = null){
    return StringHelper.moneyFormat(money) + " " + currency;
  }
}
