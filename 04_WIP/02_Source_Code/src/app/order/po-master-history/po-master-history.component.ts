import { SystemService } from 'src/app/_services/system.service';
import { WorkingProcessConst } from './../../_models/const/WorkingProcessConst';
import { CommonHelper } from './../../_helpers/common.helper';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from './../../_services/common.service';
import { FileUploadModel } from './../../_models/common/FileUploadModel';
import { ToastrService } from 'ngx-toastr';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { OrderService } from './../../_services/order.service';
import { UserService } from './../../_services/user.service';
import { UserInfoModel } from './../../_models/user/UserSessionModel';
import { Component, OnInit, Input, TemplateRef, ChangeDetectorRef, HostListener, ViewChild } from '@angular/core';
import swal from 'sweetalert2';
import { DataformService } from 'src/app/_services/dataform.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-po-master-history',
  templateUrl: './po-master-history.component.html',
  styleUrls: ['./po-master-history.component.css']
})
export class PoMasterHistoryComponent implements OnInit {
  @Input() poNo: string;
  @ViewChild('fileInput') myVar1: any;
  fileName: string = '';
  multiple: boolean = false;

  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;
  bsModalRefMarkDone: BsModalRef;
  
  fileUpload: any;
  attachmentShow: boolean = false;
  documentShow: boolean = false;
  userInfo = new UserInfoModel();
  historyList = new BaseListModel();
  hasChanged:boolean = false;
  id: any = '';
  idFile: string;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private toastr:ToastrService,
    private systemService:SystemService,
    private commonService:CommonService,
    private changeDetection:ChangeDetectorRef,
    private spinner:NgxSpinnerService,
    private dataformService:DataformService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
    this.idFile = CommonHelper.generateRandomString(10);
  }

  dataItem: any = {
    AttachTotal: '',
    AttachmentList: [],
    PlanActivityList: [],
    LogList: [],
    Document: [],
  }

  commentData: any = {
    PONo: '',
    DueDate: '',
    Comment: '',
    CreateBy: '',
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 308;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 308;
    this.commentData.CreateBy = this.userInfo.code;
    this.commentData.PONo = this.poNo;
    this.onLoadHistoryList();
  }

  picPermissionData:any = {
    IsPer: false
  };

  loadPICPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PO, this.userInfo.code, 1).subscribe(x => {
      this.picPermissionData = x;
    });
  }

  onLoadHistoryList(){
    this.orderService.POMasterDetail_GetList(this.poNo).subscribe(x => {
      this.dataItem = x;
    });
  }

  onDeleteFile(id){
    this.orderService.POMasterDetail_DeleteFile(id).subscribe(x => {
      if(x.ErrorCode !== '00'){
        this.toastr.error(x.Message);
      }else{
        this.toastr.success(x.Message);
        this.onLoadHistoryList();
      }
    })
  }

  onAcceptComment() {
    this.orderService.POHistory_Comment(this.commentData, this.fileUpload).subscribe(x => {
      if(x.ErrorCode !== '00'){
        this.toastr.error(x.Message);
      }else{
        this.toastr.success(x.Message);
        this.onLoadHistoryList();
        this.resetComment();
      }
    })
  }

  openPopupCreate(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefCreate = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadHistoryList();
        this.hasChanged = false;
      }
    });
  }

  openPopupEdit(template: TemplateRef<any>, id) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadHistoryList();
        this.hasChanged = false;
      }
    });
  }

  openPopupMarkDone(template: TemplateRef<any>, id) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefMarkDone = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadHistoryList();
        this.hasChanged = false;
      }
    });
  }

  onDeleteActivity(id){
    const swalDelete = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: false
    })
    swalDelete.fire({
      title: 'Are you sure delete this schedule activity?',
      text: 'You will not be able to recover it!',
      type: 'error',
      showCancelButton: true,
      cancelButtonText: 'Close',
      confirmButtonText: 'OK',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.orderService.POActivity_Delete(id).subscribe(x => {
          if (x.ErrorCode !== '00') {
            this.toastr.error(x.Message);
          } else {
            this.toastr.success(x.Message);
            this.onLoadHistoryList();
          }
        });
      }
    })
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.ErrorCode == "00") {
      this.hasChanged = true;
    }
  }

  onShowAttachment(){
    this.attachmentShow = !this.attachmentShow;
  }

  onShowDocument(){
    this.documentShow = !this.documentShow;
  }

  resetComment(){
    this.commentData.Comment = '';
    this.clearFileChoose();
  }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  onDownloadFile(fileName) {
    this.spinner.show();
    this.orderService.POMasterDetail_DownloadFile(this.poNo + "/" + fileName).subscribe(x => {
      this.spinner.hide();
      const data = new Blob([x], { type: this.fileType });
      FileSaver.saveAs(data, fileName);
    });
  }

  //-----------------------------
  onFileChange(event) {
    const fileUploadModel = new FileUploadModel();
    if (event.target.files.length > 0) {
      fileUploadModel.fileSelected = event.target.files;
      this.fileName = fileUploadModel.fileSelected[0].name;
      this.fileUpload = fileUploadModel.fileSelected[0];
    } 
    else {
      fileUploadModel.ErrorCode = "01";
      fileUploadModel.Message = "No file choose";
    }
    this.resetSelect();
  }

  clearFileChoose(){
    this.fileName = '';
    this.fileUpload = null;
  }

  resetSelect() {
    this.myVar1.nativeElement.value = '';
  }
}
