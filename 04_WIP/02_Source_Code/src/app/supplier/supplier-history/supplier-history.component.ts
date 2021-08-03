import { NgxSpinnerService } from 'ngx-spinner';
import { SupplierService } from './../../_services/supplier.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { UserService } from './../../_services/user.service';
import { UserInfoModel } from './../../_models/user/UserSessionModel';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-supplier-history',
  templateUrl: './supplier-history.component.html',
  styleUrls: ['./supplier-history.component.css']
})
export class SupplierHistoryComponent implements OnInit {
  @Input() id:string;

  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;
  bsModalRefMarkDone: BsModalRef;
  
  userInfo = new UserInfoModel();
  historyList = new BaseListModel();

  constructor(
    private userService: UserService,
    private supplierService: SupplierService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  dataItem: any = {
    ContractList: [],
    ClaimList: [],
    CheckList: [],
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 308;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 308;
    this.onLoadHistoryList();
  }

  onLoadHistoryList(){
    this.supplierService.Supplier_History(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  onDownloadFile(fileName) {
    this.spinner.show();
    this.supplierService.ContractPrinciples_DownloadFile(fileName).subscribe(x => {
      this.spinner.hide();
      const data = new Blob([x], { type: this.fileType });
      FileSaver.saveAs(data, fileName);
    });
  }
}
