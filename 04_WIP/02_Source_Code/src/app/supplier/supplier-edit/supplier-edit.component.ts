import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../_services/user.service';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { SupplierService } from './../../_services/supplier.service';
import { BaseListModel } from './../../_models/base/BaseListModel';
import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();
  userInfo:UserInfoModel;
  private sub: any;
  title: any;
  valueChoose: any = 1;

  rowIndexActive: any = 0;

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
    Country: '',
    Tag: '',
    CreateBy: '',
    UpdateBy: '',
    ContactList: [],
  }

  dataForm: any = {
    TitleList: [],
    CountryList: [],
    TagList: [],
  }

  dataContactItem: any = {
    SupplierID: '',
    ContactName: '',
    IsActive: 'false',
    JobPosition: '',
    Email: '',
    Phone: '',
    Mobile: '',
    Remark: '',
  }

  tag:any = [];
  tag1:any = ["Jig","Shipper"];

  contactList = new BaseListModel();

  constructor(
    private supplierService:SupplierService,
    private dataFormService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private route:ActivatedRoute,
    private router:Router,
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 510;
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 510;
    this.onLoadData();
    this.onLoadDataForm();
  }

  onLoadData() {
    if(this.id == 'New'){
      this.title = 'New';
    }else{
      this.supplierService.Supplier_GetByID(this.id).subscribe(x => {
        this.dataItem = x;
        this.title = this.dataItem.SupplierName;
      });
      this.onLoadContactList();
    }
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_SupplierCreate().subscribe(x => {
      this.dataForm = x;
    });
  }

  onLoadContactList(){
    this.supplierService.Contact_GetList(this.id).subscribe(x => {
      this.contactList = x;
      this.contactList.DataList.forEach(element => {
        this.dataItem.ContactList.push(element);
        if(element.IsActive == true) {
          this.valueChoose = element.RowIndex.toString();
        }
      });
    });
    
  }

  onCreateContactItem() {
    let rowIndex = this.dataItem.ContactList.length;
    this.dataItem.ContactList.push({
      RowIndex: rowIndex + 1,
      IsActive: 'false',
      Title: '',
      ContactName: '',
      JobPosition: '',
      Email: '',
      Phone: '',
      Mobile: '',
      Remark: '',
    });
  }

  onDeleteContactItem(id){
    var itemIndex = this.dataItem.ContactList.findIndex(obj => obj.RowIndex == id);
    if (itemIndex > -1) {
      this.dataItem.ContactList.splice(itemIndex, 1);
    }
    var rowIndex = 0;
    this.dataItem.ContactList.forEach(element => {
      rowIndex++;
      element.RowIndex = rowIndex;
    });
  }

  acceptBtnModalClicked(){
    console.log(this.dataItem);
    this.dataItem.ContactList.forEach(element => {
      if(element.RowIndex == this.valueChoose) element.IsActive = 'true';
      else element.IsActive = 'false';
    });
    this.spinner.show();
    if(this.id == 'New'){
      this.dataItem.CreateBy = this.userInfo.code;
      this.supplierService.Supplier_Create(this.dataItem).subscribe(x => {
        this.spinner.hide();
        if (x.ErrorCode !== '00') {
          this.toastr.error(x.Message);
        } else {
          this.toastr.success(x.Message);
          this.acceptBtnModalClick.emit(x);
          this.bsModalRef.hide();
        }
      });
    }else{
      this.dataItem.UpdateBy = this.userInfo.code;
      this.supplierService.Supplier_Edit(this.dataItem).subscribe(x => {
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
