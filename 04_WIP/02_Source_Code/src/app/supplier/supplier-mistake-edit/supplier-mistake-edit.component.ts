import { DataformService } from './../../_services/dataform.service';
import { SupplierService } from './../../_services/supplier.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'

@Component({
  selector: 'app-supplier-mistake-edit',
  templateUrl: './supplier-mistake-edit.component.html',
  styleUrls: ['./supplier-mistake-edit.component.css']
})
export class SupplierMistakeEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Output() acceptBtnModalClick = new EventEmitter();
  @Input() updateBy: string;

  dataItem: any = {
    ID: '',
    SupplierID: '',
    MistakeTypeID: '',
    FindDate: '',
    PONo: '',
    CreateBy:'',
    UpdateBy:'',
    Remark: '',
  }

  dataForm: any = {
    SupplierList: [],
    MistakeList: [],
    POList: [],
  }

  FindDate: any;

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
    if(this.id != null) {
      this.onLoadData();
      this.title = "Update";
      this.buttonName = "UPDATE";
    }
    this.loadDataForm();
  }

  onLoadData() {
    this.supplierService.SupplierMistake_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.SupplierID) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.MistakeTypeID) this.dataItem.MistakeTypeID = this.dataItem.MistakeTypeID.toString();
      if(this.dataItem.SupplierID) this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
      if(this.dataItem.FindDate != null) 
      {
        this.FindDate = new Date(this.dataItem.FindDate);
      }
    });
  }

  loadDataForm(){
    this.dataformService.DataForm_SupplierMistakeCreate().subscribe(x => {
      this.dataForm = x;
    });
  }

  acceptBtnModalClicked(){
    if(this.FindDate){ this.dataItem.FindDate = moment(this.FindDate).format("MM/DD/YYYY");}
    else this.dataItem.FindDate = null;
    this.dataItem.createBy = this.dataItem.updateBy = this.updateBy;
    if(this.id != null){
      this.spinner.show();
      this.supplierService.SupplierMistake_Edit(this.dataItem).subscribe(x => {
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
      this.supplierService.SupplierMistake_Create(this.dataItem).subscribe(x => {
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
}
