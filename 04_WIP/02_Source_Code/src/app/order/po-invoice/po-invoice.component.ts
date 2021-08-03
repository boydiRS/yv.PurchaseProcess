import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { StringHelper } from '../../_helpers/string.helper';
import { BaseListModel } from '../../_models/base/BaseListModel';
import { OrderService } from '../../_services/order.service';
import { UserService } from '../../_services/user.service';
import { UserInfoModel } from '../../_models/user/UserSessionModel';
import { DataformService } from 'src/app/_services/dataform.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment'

@Component({
  selector: 'app-po-invoice',
  templateUrl: './po-invoice.component.html',
  styleUrls: ['./po-invoice.component.css']
})
export class PoInvoiceComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() productlist: any;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  constructor(
    private orderService:OrderService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { }

  dataItem: any = {
    Invoice: '',
  }

  dataForm: any = {
    InvoiceList: [],
  }

  ngOnInit() {
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.orderService.POItem_UpdatePayday(this.dataItem).subscribe(x => {
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
