import { SupplierService } from './../../_services/supplier.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-contact-create',
  templateUrl: './contact-create.component.html',
  styleUrls: ['./contact-create.component.css']
})
export class ContactCreateComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() createBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ContactName: '',
    Title: '',
    SupplierID: '',
    JobPosition: '',
    Email: '',
    Phone: '',
    Mobile: '',
    
    Remark: '',
    CreateBy: '',
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
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_ContactCreate().subscribe(x => {
      this.dataForm = x;
    });
  }

  acceptBtnModalClicked(){
    this.dataItem.CreateBy = this.createBy;
    this.spinner.show();
    this.supplierService.Contact_Create(this.dataItem).subscribe(x => {
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
