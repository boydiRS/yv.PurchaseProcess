import { OrderService } from './../../_services/order.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-paymentterm-edit',
  templateUrl: './paymentterm-edit.component.html',
  styleUrls: ['./paymentterm-edit.component.css']
})
export class PaymenttermEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    PaymentName: '',
    PaymenttermContent_En: '',
    PaymenttermContent_Vn: '',
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
    this.orderService.Paymentterm_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.orderService.Paymentterm_Edit(this.dataItem).subscribe(x => {
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
