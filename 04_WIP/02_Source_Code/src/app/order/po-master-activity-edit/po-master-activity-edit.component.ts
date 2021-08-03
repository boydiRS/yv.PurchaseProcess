import { OrderService } from './../../_services/order.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment'

@Component({
  selector: 'app-po-master-activity-edit',
  templateUrl: './po-master-activity-edit.component.html',
  styleUrls: ['./po-master-activity-edit.component.css']
})
export class PoMasterActivityEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    PONo: '',
    DueDate: '',
    Comment: '',
    CreateBy: '',
  }

  constructor(
    private orderService:OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { 
    
  }

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.orderService.POActivity_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.DueDate != null) this.dataItem.DueDate = moment(this.dataItem.DueDate).format("YYYY-MM-DD");
    });
  }

  acceptBtnModalClicked(){
    this.dataItem.UpdateBy = this.updateBy;
    this.spinner.show();
    this.orderService.POActivity_Edit(this.dataItem).subscribe(x => {
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
