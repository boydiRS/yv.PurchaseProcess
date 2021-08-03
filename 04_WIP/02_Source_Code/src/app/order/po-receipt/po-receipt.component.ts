import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from '../../_services/order.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-po-receipt',
  templateUrl: './po-receipt.component.html',
  styleUrls: ['./po-receipt.component.css']
})
export class PoReceiptComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() listID: any;
  @Output() acceptBtnModalClick = new EventEmitter();

  UpdateDate: any;

  constructor(
    private orderService:OrderService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { }

  dataItem: any = {
    UpdateDate: '',
    ListID: [],
  }

  ngOnInit() {
    this.UpdateDate = new Date();
    this.dataItem.ListID = this.listID;
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    if(this.UpdateDate){ this.dataItem.UpdateDate = moment(this.UpdateDate).format("MM/DD/YYYY");}
    else{this.dataItem.UpdateDate = '';}
    this.orderService.POItem_UpdateActualReceipt(this.dataItem).subscribe(x => {
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
