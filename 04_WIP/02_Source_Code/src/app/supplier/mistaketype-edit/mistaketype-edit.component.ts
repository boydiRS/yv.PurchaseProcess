import { SupplierService } from './../../_services/supplier.service';
import { OrderService } from './../../_services/order.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mistaketype-edit',
  templateUrl: './mistaketype-edit.component.html',
  styleUrls: ['./mistaketype-edit.component.css']
})
export class MistaketypeEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    MistakeName: '',
  }

  title:string = 'New';
  buttonName:string = "ADD NEW";

  constructor(
    private supplierService:SupplierService,
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
  }

  onLoadData() {
    this.supplierService.MistakeType_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  acceptBtnModalClicked(){
    if(this.id != null){
      this.spinner.show();
      this.supplierService.MistakeType_Edit(this.dataItem).subscribe(x => {
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
      this.supplierService.MistakeType_Create(this.dataItem).subscribe(x => {
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
