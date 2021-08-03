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
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  @Input() id: string;
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
  idFile: string;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService,
    private commonService:CommonService,
    private changeDetection:ChangeDetectorRef,
    private dataformService:DataformService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
    this.idFile = CommonHelper.generateRandomString(10);
  }

  dataItem: any = {
    AttachTotal: '',
    AttachmentList: [],
    LogList: [],
  }

  commentData: any = {
    InvoiceID: '',
    Comment: '',
    CreateBy: '',
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 350;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 350;
    this.commentData.CreateBy = this.userInfo.code;
    this.commentData.InvoiceID = this.id;
    this.onLoadHistoryList();
  }

  onLoadHistoryList(){
    this.orderService.InvoiceDetail_GetList(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  onDeleteFile(id){
    this.orderService.InvoiceDetail_DeleteFile(id).subscribe(x => {
      if(x.ErrorCode !== '00'){
        this.toastr.error(x.Message);
      }else{
        this.toastr.success(x.Message);
        this.onLoadHistoryList();
      }
    })
  }

  onAcceptComment() {
    this.orderService.InvoiceHistory_Create(this.commentData, this.fileUpload).subscribe(x => {
      if(x.ErrorCode !== '00'){
        this.toastr.error(x.Message);
      }else{
        this.toastr.success(x.Message);
        this.onLoadHistoryList();
        this.resetComment();
      }
    })
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.ErrorCode == "00") {
      this.hasChanged = true;
    }
  }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  onDownloadFile(fileName) {
    this.spinner.show();
    this.orderService.POMasterDetail_DownloadFile(fileName).subscribe(x => {
      this.spinner.hide();
      const data = new Blob([x], { type: this.fileType });
      FileSaver.saveAs(data, fileName);
    });
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
