import { SupplierService } from './../../_services/supplier.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.css']
})
export class TagEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    TagName: '',
  }

  constructor(
    private supplierService:SupplierService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { 
    
  }

  ngOnInit() {

  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.supplierService.Tag_Create(this.dataItem).subscribe(x => {
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
