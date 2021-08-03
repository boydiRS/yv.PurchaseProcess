import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataformService } from 'src/app/_services/dataform.service';
import { SupplierService } from './../../_services/supplier.service';
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
import * as moment from 'moment'
import swal from 'sweetalert2';

@Component({
  selector: 'app-supplier-mistake-list',
  templateUrl: './supplier-mistake-list.component.html',
  styleUrls: ['./supplier-mistake-list.component.css']
})
export class SupplierMistakeListComponent implements OnInit {
  id: string;
  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    SupplierID: '',
    MistakeTypeID: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  FromDate: '';
  ToDate: '';

  dataForm: any = {
    SupplierList: [],
    MistakeList: [],
  }

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();

  constructor(
    private systemService:SystemService,
    private supplierService:SupplierService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
    private dataformService:DataformService,
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
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_Paymentterm, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
      if(this.permissionData.IsPer === false) this.router.navigate(["khong-co-quyen-truy-cap"]);
      
      this.innerHeight = window.innerHeight - 170;
      this.onLoadDataForm();
    });
  }

  ngOnInit() {
    this.loadPermission();
  }

  onLoadData() {
    if(this.FromDate){
      this.searchData.FromDate = moment(this.FromDate).format("MM/DD/YYYY");
    }else{
      this.searchData.FromDate = '';
    }

    if(this.ToDate){
      this.searchData.ToDate = moment(this.ToDate).format("MM/DD/YYYY");
    }else{
      this.searchData.ToDate = '';
    }
    this.loadingIndicator = true;
    this.supplierService.SupplierMistake_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  onLoadDataForm() {
    this.dataformService.DataForm_SupplierMistakeList().subscribe(x => {
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

  openPopupEdit(template: TemplateRef<any>, id: string = null) {
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

  onChangeSupplier(event){
    if(event.length > 0) this.searchData.SupplierID = event[0].value;
    else this.searchData.SupplierID = null;
    this.onLoadData();
  }

  onChangeMistakeType(event){
    if(event.length > 0) this.searchData.MistakeTypeID = event[0].value;
    else this.searchData.MistakeTypeID = null;
    this.onLoadData();
  }

  onDelete(id){
    const swalDelete = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: false
    })
    swalDelete.fire({
      title: 'Are you sure delete this claim?',
      text: 'You will not be able to recover it!',
      type: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.supplierService.SupplierMistake_Delete(id).subscribe(x => {
          this.spinner.hide();
          if (x.ErrorCode !== '00') {
            this.toastr.error(x.Message);
          } else {
            this.toastr.success(x.Message);
            this.onLoadData();
          }
        });
      }
    })
  }
}
