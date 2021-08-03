import { StringHelper } from './../../_helpers/string.helper';
import { FileUploadModel } from './../../_models/common/FileUploadModel';
import { DataformService } from './../../_services/dataform.service';
import { SupplierService } from './../../_services/supplier.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'

@Component({
  selector: 'app-supplier-check-edit',
  templateUrl: './supplier-check-edit.component.html',
  styleUrls: ['./supplier-check-edit.component.css']
})
export class SupplierCheckEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() createBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    Supplier: '',
    Description: '',
    CheckType: '',
    PICCode: '',
    DateCheck: '',
    CreateBy: '',
    UpdateBy: '',
    EmployeeChoose: [],
    Remark: '',
  }

  dataForm: any = {
    SupplierList: [],
    CheckTypeList: [],
    PICList: [],
  }

  searchNotChoose: string = '';
  searchChoose: string = '';

  employeeNotChoose = [] as any;
  listEmployeeNotChoose = [] as any;
  listEmployeeChoose = [] as any;

  DateCheck: any;

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
    }else{
      this.loadDataForm();
    }
  }

  onLoadData() {
    this.supplierService.SupplierCheck_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.CheckType) this.dataItem.CheckType = this.dataItem.CheckType.toString();
      this.dataItem.EmployeeChoose = [];
      if(this.dataItem.DateCheck != null) 
      {
        this.DateCheck = new Date(this.dataItem.DateCheck);
      }
      if(this.dataItem.Supplier != '' && this.dataItem.Supplier != null){
        var str = this.dataItem.Supplier.split(",");
        if(str.length > 0){
          str.forEach(element => {
            this.dataItem.EmployeeChoose.push(element);  
          });
        }else{
          this.dataItem.EmployeeChoose.push(this.dataItem.Supplier);
        }
      }
      this.loadDataForm();
    });
  }

  loadDataForm(){
    this.dataformService.DataForm_SupplierCheckCreate().subscribe(x => {
      this.dataForm = x;
      this.updateList();
    });
  }

  acceptBtnModalClicked(){
    if(this.DateCheck){ this.dataItem.DateCheck = moment(this.DateCheck).format("MM/DD/YYYY");}
    if(this.dataItem.EmployeeChoose.length > 0){
      this.dataItem.Supplier = '';
      let first = true;
      this.dataItem.EmployeeChoose.forEach(element => {
        if(first){
          first = false;
          this.dataItem.Supplier += element;
        }else{
          this.dataItem.Supplier += ',' + element;
        }
      });
    }
    if(this.id != null){
      this.spinner.show();
      this.supplierService.SupplierCheck_Edit(this.dataItem).subscribe(x => {
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
      this.supplierService.SupplierCheck_Create(this.dataItem).subscribe(x => {
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

  onChangeSearch() {
    this.updateListShow();
  }

  updateList(){
    var check:boolean = false;
    this.dataForm.SupplierList.forEach(element => {
      check = false;
      this.dataItem.EmployeeChoose.forEach(element1 => {
        if(element.Value == element1) check = true;
      });
      if(!check) this.employeeNotChoose.push(element.Value);
    });
    this.updateListShow();
  }

  updateListShow() {
    var check:boolean = false;
    this.listEmployeeChoose = [];
    this.listEmployeeNotChoose = [];

    this.dataForm.SupplierList.forEach(element => {
      check = false;
      this.employeeNotChoose.forEach(element1 => {
        if(element.Value == element1) {
          check = true;
        }
      });
      if(check) {
        if(this.searchNotChoose != '') {
          var searchString = StringHelper.removeUnicode(this.searchNotChoose.toUpperCase());
          var nameString = StringHelper.removeUnicode(element.Text.toUpperCase());
          var find = false;
          if(element.Value != '' && find == false){
            if(element.Value.includes(searchString)){
              find = true;
              this.listEmployeeNotChoose.push(element);  
            }
          }
          if(nameString.includes(searchString) && find == false){
            find = true;
            this.listEmployeeNotChoose.push(element);
          }
          if(element.Input != null && find == false){
            if(element.Input.includes(searchString)){
              find = true;
              this.listEmployeeNotChoose.push(element);  
            }
          }
        }
        else {
          this.listEmployeeNotChoose.push(element);
        }
      }
    });

    this.dataForm.SupplierList.forEach(element => {
      check = false;
      this.dataItem.EmployeeChoose.forEach(element1 => {
        if(element.Value == element1) {
          check = true;
        }
      });
      if(check) {
        if(this.searchChoose !== '') {
          var searchString = StringHelper.removeUnicode(this.searchChoose.toUpperCase());
          var nameString = StringHelper.removeUnicode(element.Text.toUpperCase());
          var find = false;
          if(element.Value != '' && find == false){
            if(element.Value.includes(searchString)){
              find = true;
              this.listEmployeeChoose.push(element);  
            }
          }
          if(nameString.includes(searchString) && find == false){
            find = true;
            this.listEmployeeChoose.push(element);
          }
          if(element.Input != null && find == false){
            if(element.Input.includes(searchString)){
              find = true;
              this.listEmployeeChoose.push(element);  
            }
          }
        }
        else {
          this.listEmployeeChoose.push(element);
        }
      }
    });
  }

  onClickAdd(code) {
    var employeeIndex = this.employeeNotChoose.findIndex(obj => obj == code);
    if(employeeIndex > -1){
      this.employeeNotChoose.splice(employeeIndex, 1);
      this.dataItem.EmployeeChoose.push(code);
    }
    this.updateListShow();
  }

  onClickDel(code) {
    var employeeIndex = this.dataItem.EmployeeChoose.findIndex(obj => obj == code);
    if(employeeIndex > -1){
      this.dataItem.EmployeeChoose.splice(employeeIndex, 1);
      this.employeeNotChoose.push(code);
    }
    this.updateListShow();
  }

  onClickAddAll() {
    this.listEmployeeNotChoose.forEach(element => {
      var index = this.employeeNotChoose.findIndex(obj => obj == element.Value);
      if(index > -1) {
        this.employeeNotChoose.splice(index, 1);
        this.dataItem.EmployeeChoose.push(element.Value);
      }
    });
    this.updateListShow();
  }

  onClickDelAll() {
    this.listEmployeeChoose.forEach(element => {
      var index = this.dataItem.EmployeeChoose.findIndex(obj => obj == element.Value);
      if(index > -1) {
        this.dataItem.EmployeeChoose.splice(index, 1);
        this.employeeNotChoose.push(element.Value);
      }
    });
    this.updateListShow();
  }

  onChangeSupplier(event){

  }
}
