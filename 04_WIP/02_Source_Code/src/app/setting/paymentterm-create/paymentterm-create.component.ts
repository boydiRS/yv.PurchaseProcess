import { OrderService } from './../../_services/order.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-paymentterm-create',
  templateUrl: './paymentterm-create.component.html',
  styleUrls: ['./paymentterm-create.component.css']
})
export class PaymenttermCreateComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    PaymentName: '',
    PaymenttermContent_En: '',
    PaymenttermContent_Vn: '',
  }

  constructor(
    private orderService:OrderService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {

  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.orderService.Paymentterm_Create(this.dataItem).subscribe(x => {
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
