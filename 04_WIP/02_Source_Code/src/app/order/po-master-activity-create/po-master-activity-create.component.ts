import { OrderService } from './../../_services/order.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-po-master-activity-create',
  templateUrl: './po-master-activity-create.component.html',
  styleUrls: ['./po-master-activity-create.component.css']
})
export class PoMasterActivityCreateComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() createBy: string;
  @Input() poNo: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    PONo: '',
    DueDate: '',
    Comment: '',
    CreateBy: '',
  }

  constructor(
    private orderService:OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.dataItem.CreateBy = this.createBy;
    this.dataItem.PONo = this.poNo;
  }

  acceptBtnModalClicked(){
    this.dataItem.CreateBy = this.createBy;
    this.spinner.show();
    this.orderService.POActivity_Create(this.dataItem).subscribe(x => {
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
