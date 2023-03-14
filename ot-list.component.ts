import { Component, OnInit, ChangeDetectorRef, TemplateRef, HostListener } from '@angular/core';
import { BsModalService,BsModalRef } from 'ngx-bootstrap';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { CommonService } from 'src/app/_services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonHelper } from 'src/app/_helpers/common.helper';
import { OvertimeService } from 'src/app/_services/overtime.service';
import { UserService } from 'src/app/_services/user.service';
import { DataformService } from 'src/app/_services/dataform.service';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { WorkingProcessConst } from 'src/app/_models/const/WorkingProcessConst';
import { SystemService } from 'src/app/_services/system.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-ot-list',
  templateUrl: './ot-list.component.html',
  styleUrls: ['./ot-list.component.css']
})
export class OtListComponent implements OnInit {
  modalEdit : BsModalRef;
  modalCreate : BsModalRef;
  modalDetail : BsModalRef;
  modalReturn : BsModalRef;
  loadingIndicator: boolean = false;
  hasChanged:any;
  ID:any;
  ListID:any;
  userInfo: UserInfoModel = new UserInfoModel();
  userCode: string;
  createBy:any;
  wait:boolean = true;
  permissionData:any = {
    isPerApprove: false,
    isPerGAHR:false,
    isPer:false,
    isPerCreate:false,
  };

  searchData: any = {
    pageIndex:'',
    employeeCode:'',
    employeeName:'',
    sectionID:'',
    startDate:'',
    toDate:'',
    otReasonID:'',
    otTypeID:'',
    sortColumn:'',
    sortColumnDir:'',
    itemsPerPage:15,
    status:'',
    ownerCode:'',
    useCar:false,
  }

  dataForm:any = {
    sectionList: [],
    statusList: []
  }

  actionForm:any = {
    id:'',
    actionID:'',
    createBy:'',
  }

  actionMultiForm:any = {
    ListID:[],
    createBy:'',
  }
  rowPerPage:any = [15, 25, 50];
  limit:any;
  pagingModel = new BasePagingModel();
  otReason:any;
  otType: any;
  selected = [];

  constructor(
    private overtimeService:OvertimeService,
    private systemService:SystemService,
    private commonService:CommonService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService, 
    private dataFormService:DataformService,
    private router:Router,
    private userService:UserService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
    this.searchData.ownerCode = this.userInfo.code;
    this.userCode = this.userInfo.code;
    this.actionMultiForm.createBy = this.userInfo.code;
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 170;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 170;    
    this.loadDataForm();
    this.loadPermission();
  }

  loadPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_ADM_OT, this.userInfo.code, null).subscribe(x => {
      this.permissionData.isPer = x.isPer;
    });
    this.systemService.CheckPermission(WorkingProcessConst.APP_ADM_OT, this.userInfo.code, 3).subscribe(x => {
      this.permissionData.isPerApprove = x.isPer;
    });
    this.systemService.CheckPermission(WorkingProcessConst.APP_ADM_OT, this.userInfo.code, 2).subscribe(x => {
      this.permissionData.isPerGAHR = x.isPer;
    });
    this.systemService.CheckForeigner(this.userInfo.code).subscribe(x => {
      this.permissionData.isPerCreate = x.isPer;
    });
  }

  loadData(pageing: boolean = false) {
    console.log(pageing + "   " + this.searchData.pageIndex);
    if(!pageing) this.searchData.pageIndex = 1;
    if(!this.wait){
      this.loadingIndicator = true;
      this.overtimeService.OT_GetAll(this.searchData).subscribe(x => {
        this.loadingIndicator = false;
        this.pagingModel = x;
      }), error => {
        this.loadingIndicator = false;
        const baseModel = CommonHelper.getError(error);
        this.toastr.error(baseModel.message);
      }
      this.actionMultiForm.ListID = [];
      this.selected = [];
    }
  }

  loadDataForm(){
    this.dataFormService.DataForm_OTItem_List(this.userInfo.code).subscribe(x=>{
      this.dataForm = x;
      this.searchData.sectionID = x.sectionList[0].value;
      this.wait = false;
      this.loadData();
    });
  }

  onChangeSection(event){
    this.searchData.sectionID = event[0].value;
    this.loadData();
  }

  onChangeStatus(event){
    this.searchData.status = event[0].value;
    this.loadData();
  }

  onChangeRowPerPage(event){
    this.searchData.itemsPerPage = event.target.value;
    this.loadData();
  }

  setPage(pageInfo) {
    if (pageInfo.count != null) this.searchData.pageIndex = pageInfo.offset + 1;
    this.loadData(true);
  }

  onSort(sortInfo) {
    this.searchData.sortColumn = sortInfo.sorts[0].prop;
    this.searchData.sortColumnDir = sortInfo.sorts[0].dir;
    this.loadData();
  }

  openModalCreate(template: TemplateRef<any>) {
    this.modalCreate = this.commonService.openModal(template, null, 'modal-lg');//this.modalService.show(TimesheetsImportComponent);
    //this.modalImport.content.closeBtnName = 'Close';
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openModalEdit(template: TemplateRef<any>,ID) {
    this.ID = ID;
    this.modalEdit = this.commonService.openModal(template, null, 'modal-lg');//this.modalService.show(TimesheetsEditComponent);
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openModalDetail(template: TemplateRef<any>,ID) {
    this.ID = ID;
    this.modalDetail = this.commonService.openModal(template, null, 'modal-lg');//this.modalService.show(TimesheetsEditComponent);
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openModalReturn(template: TemplateRef<any>, ListID, createBy) {
    this.ListID = ListID;
    this.createBy = createBy;
    this.modalReturn = this.commonService.openModal(template, null, 'modal-lg');//this.modalService.show(TimesheetsEditComponent);
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  onPrintClick() {
    this.spinner.show();
    this.overtimeService.OT_PrintMulti(this.actionMultiForm).subscribe(x => {
      this.spinner.hide();
      if (x.errorCode !== '00') {
        this.toastr.error(x.message);
      } else {
        this.toastr.success(x.message);
        window.open('/overtime/ot-print/' + x.printCode, '_blank');
      }
    });
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.errorCode == "00") {
      this.hasChanged = true;
    }
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.actionMultiForm.ListID = [];
    this.selected.forEach(element => {
      if(element.id != null) this.actionMultiForm.ListID.push(element.id);
    });
  }

  onActivate(event) {
  }

  onCheck(){
    // console.log(this.selected);
    // console.log(this.actionMultiForm.ListID);
  }

  onApprove(){    
    this.spinner.show();
    this.overtimeService.OT_ApprovalMulti(this.actionMultiForm).subscribe(x => {
      this.spinner.hide();
      if (x.errorCode !== '00') {
        this.toastr.error(x.message);
      } else {
        this.toastr.success(x.message);
        this.loadData();
      }
    });

    this.actionMultiForm.ListID = [];
    this.selected = [];
  }

  onActionBtn(id, actionID){
    this.actionForm.id = id;
    this.actionForm.actionID = actionID;
    this.actionForm.createBy = this.userCode;
    
    this.spinner.show();
    this.overtimeService.OT_Action(this.actionForm).subscribe(x => {
      this.spinner.hide();
      if (x.errorCode !== '00') {
        this.toastr.error(x.message);
      } else {
        this.toastr.success(x.message);
        this.loadData();
      }
    });
  }

  deleteOT(id){
    const swalDelete = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: false
    })
    swalDelete.fire({
      title: 'Are you sure delete this record?',
      text: 'You will not be able to recover it!',
      type: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.overtimeService.OT_Delete(id).subscribe(x => {
          this.spinner.hide();
          if (x.errorCode !== '00') {
            this.toastr.error(x.message);
          } else {
            // this.toastr.success(x.message);
            swalDelete.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.loadData();
          }
        });
      }
    })
  }

  triggerEnter(event) {
    if (event.key === "Enter") {
      this.loadData();
    }
  }
}
