import { FileUploadModel } from './../../_models/common/FileUploadModel';
import { DataformService } from './../../_services/dataform.service';
import { SupplierService } from './../../_services/supplier.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'

@Component({
  selector: 'app-contract-pri-edit',
  templateUrl: './contract-pri-edit.component.html',
  styleUrls: ['./contract-pri-edit.component.css']
})
export class ContractPriEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() createBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  @ViewChild('fileInput') myVar1: any;
  fileName: string = '';
  multiple: boolean = false;
  idFile: string;
  fileUpload: any;

  dataItem: any = {
    ID: '',
    SupplierID: '',
    ContractNo: '',
    EffectiveDate: '',
    FileName: '',
    CreateBy: '',
    UpdateBy: '',
    Remark: '',
  }

  dataForm: any = {
    SupplierList: [],
  }

  EffectiveDate: any;

  title:string = 'New';
  buttonName:string = "ADD NEW";

  constructor(
    private supplierService:SupplierService,
    private dataformService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { 
    
  }

  ngOnInit() {
    this.dataItem.CreateBy = this.dataItem.UpdateBy = this.createBy;
    if(this.id != null) {
      this.onLoadData();
      this.title = "Update";
      this.buttonName = "UPDATE";
    }
    this.loadDataForm();
  }

  onLoadData() {
    this.supplierService.ContractPrinciples_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.SupplierID) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.EffectiveDate != null) 
      {
        this.EffectiveDate = new Date(this.dataItem.EffectiveDate);
      }
    });
  }

  loadDataForm(){
    this.dataformService.DataForm_SupplierMistakeCreate().subscribe(x => {
      this.dataForm = x;
    });
  }

  acceptBtnModalClicked(){
    if(this.EffectiveDate){ this.dataItem.EffectiveDate = moment(this.EffectiveDate).format("MM/DD/YYYY");}
    else this.dataItem.EffectiveDate = null;
    if(this.id != null){
      this.spinner.show();
      this.supplierService.ContractPrinciples_Edit(this.dataItem, this.fileUpload).subscribe(x => {
        this.spinner.hide();
        if (x.ErrorCode !== '00') {
          this.toastr.error(x.Message);
        } else {
          this.toastr.success(x.Message);
          this.acceptBtnModalClick.emit(x);
          this.bsModalRef.hide();
        }
      });
    }
    else{
      this.spinner.show();
      this.supplierService.ContractPrinciples_Create(this.dataItem, this.fileUpload).subscribe(x => {
        this.spinner.hide();
        if (x.ErrorCode !== '00') {
          this.toastr.error(x.Message);
        } else {
          this.toastr.success(x.Message);
          this.acceptBtnModalClick.emit(x);
          this.bsModalRef.hide();
        }
      });
    }
  }

  //----------------------------- File Upload
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
