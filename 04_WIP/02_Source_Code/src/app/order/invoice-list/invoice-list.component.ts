import { StringHelper } from './../../_helpers/string.helper';
import { OrderService } from '../../_services/order.service';
import { WorkingProcessConst } from '../../_models/const/WorkingProcessConst';
import { SystemService } from 'src/app/_services/system.service';
import { DataformService } from 'src/app/_services/dataform.service';
import { Component, OnInit, ChangeDetectorRef, HostListener, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  id: string;
  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;
  bsModalRefDetail: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  InvoiceFromDate: '';
  InvoiceToDate: '';
  CDSFromDate: '';
  CDSToDate: ''

  searchData: any = {
    InvoiceNo: '',
    PICGroup: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  createData: any = {
    PICGroup: '',
    CreateBy: '',
  }

  dataForm: any = {
    CDSTypeList: [],
    CDSSelectivityList: [],
    SupplierList: [],
    IncotermList: [],
  }

  CategoryList: any = [];

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();

  constructor(
    private orderService:OrderService,
    private systemService:SystemService,
    private dataFormService:DataformService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router:Router
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  @HostListener('window:resize', ['$event'])

  onResize(event){
    this.innerHeight = window.innerHeight - 170;
  }

  permissionData:any = {
    IsPer: false
  };

  loadPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_INVOICE, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
      if(this.permissionData.IsPer === false) this.router.navigate(["khong-co-quyen-truy-cap"]);
      else this.onInit();
    });
  }

  onInit(){
    this.createData.CreateBy = this.userInfo.code;
    this.innerHeight = window.innerHeight - 170;
    this.loadDataForm();
  }

  ngOnInit() {
    this.loadPermission();
  }

  loadData() {
    this.loadingIndicator = true;
    this.orderService.InvoiceMaster_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_InvoiceList().subscribe(x => {
      this.dataForm = x;
    });
  }

  setPage(pageInfo) {
    if (pageInfo.count != null) this.searchData.PageIndex = pageInfo.offset + 1;
    this.loadData();
  }

  onSort(sortInfo) {
    this.searchData.SortColumn = sortInfo.sorts[0].prop;
    this.searchData.SortColumnDir = sortInfo.sorts[0].dir;
    this.loadData();
  }

  onChangeRowPerPage(event){
    this.searchData.ItemsPerPage = event.target.value;
    this.loadData();
  }

  openPopupCreate() {
    this.createData.PICGroup = this.searchData.PICGroup;
    this.orderService.PRMaster_Create(this.createData).subscribe(x => {
      if (x.ErrorCode !== '00') {
        this.toastr.error(x.Message);
      } else {
        this.toastr.success(x.Message);
        this.router.navigate(['/order/pr-edit', x.PRNo]);
      }
    })
    // this.commonService.changeDetection = this.changeDetection;
    // this.bsModalRefCreate = this.commonService.openModal(template, null, 'modal-lg');
    // this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
    //   if(this.hasChanged){
    //     this.loadData();
    //     this.hasChanged = false;
    //   }
    // });

  }

  openPopupDetail(template: TemplateRef<any>, id: any) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefDetail = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupEdit(template: TemplateRef<any>, id) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.ErrorCode == "00") {
      this.hasChanged = true;
    }
  }

  triggerEnter(event) {
    if (event.key == "Enter") {
      this.loadData();
    }
  }

  onChangeVendor(event){
    if(event.length > 0)
      this.searchData.SupplierID = event[0].value;
    else
      this.searchData.SupplierID = null;
    this.loadData();
  }

  onChangeIncoterm(event){
    if(event.length > 0)
      this.searchData.IncotermCode = event[0].value;
    else
      this.searchData.IncotermCode = '';
    this.loadData();
  }

  onChangeCDSType(event){
    if(event.length > 0)
      this.searchData.CDSType = event[0].value;
    else
      this.searchData.CDSType = '';
    this.loadData();
  }

  onChangeSelectivity(event){
    if(event.length > 0)
      this.searchData.CDSSelectivity = event[0].value;
    else
      this.searchData.CDSSelectivity = '';
    this.loadData();
  }

  formatMoney(money: any, currency: any = null){
    return StringHelper.moneyFormat(money) + " " + currency;
  }
}
