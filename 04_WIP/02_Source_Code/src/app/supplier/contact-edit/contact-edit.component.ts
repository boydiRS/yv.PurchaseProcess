import { SupplierService } from './../../_services/supplier.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    ContactName: '',
    Title: '',
    SupplierID: '',
    JobPosition: '',
    Email: '',
    Phone: '',
    Mobile: '',
    
    Remark: '',
    UpdateBy: '',
  }

  dataForm: any = {
    SupplierList: [],
    TitleList: [],
  }

  constructor(
    private supplierService:SupplierService,
    private dataFormService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.onLoadDataForm();
    this.onLoadData();
  }

  onLoadData() {
    this.supplierService.Contact_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      this.dataItem.SupplierID = this.dataItem.SupplierID.toString();
    });
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_ContactCreate().subscribe(x => {
      this.dataForm = x;
    });
  }

  acceptBtnModalClicked(){
    this.dataItem.UpdateBy = this.updateBy;
    this.spinner.show();
    this.supplierService.Contact_Edit(this.dataItem).subscribe(x => {
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
