import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../_services/user.service';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { SupplierService } from './../../_services/supplier.service';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.css']
})
export class SupplierDetailComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  userInfo:UserInfoModel;
  title: any;

  dataItem: any = {
    ID: '',
    SupplierName: '',
    SupplierName_Vn: '',
    ShortName: '',
    AccountNo: '',
    AccountType: '',
    Bank: '',
    Branch: '',
    Address: '',
    EnglishAddr: '',
    Tel: '',
    Fax: '',
    Attn: '',
    Email: '',
    WebsiteLink: '',
    Remark: '',
    CreateBy: '',
    UpdateBy: '',
    ContactList: [],
  }

  contactList = new BaseListModel();

  constructor(
    private supplierService:SupplierService,
    private dataFormService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private route:ActivatedRoute,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit() {
    this.onLoadData();
    this.onLoadContactList();
  }

  onLoadData() {
    this.supplierService.Supplier_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      this.title = this.dataItem.SupplierName;
    });
  }

  onLoadContactList(){
    this.supplierService.Contact_GetList(this.id).subscribe(x => {
      this.contactList = x;
    });
  }
}
