import { BaseListModel } from './../../_models/base/BaseListModel';
import { NgxSpinnerService } from 'ngx-spinner';
import { StringHelper } from './../../_helpers/string.helper';
import { CommonService } from 'src/app/_services/common.service';
import { DataformService } from 'src/app/_services/dataform.service';
import { OrderService } from '../../_services/order.service';
import { WorkingProcessConst } from '../../_models/const/WorkingProcessConst';
import { SystemService } from 'src/app/_services/system.service';
import { Component, OnInit, HostListener, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-pr-item-list',
  templateUrl: './pr-item-list.component.html',
  styleUrls: ['./pr-item-list.component.css']
})
export class PrItemListComponent implements OnInit {
  id:string = '';
  bsModalRefEdit: BsModalRef;
  bsModalRefDetail: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;
  type:string;

  searchData: any = {
    PRNo: '',
    PICGroup: '',
    IncotermCode: '',
    ProductName: '',
    ProductType: '',
    ReceiptFromDate: '',
    ReceiptToDate: '',
    ReceiptActualFromDate: '',
    ReceiptActualToDate: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  ReceiptFromDate: '01/01/2021';
  ReceiptToDate: '';
  ReceiptActualFromDate: '';
  ReceiptActualToDate: '';

  createData: any = {
    PICGroup: '',
    CreateBy: '',
  }

  dataForm: any = {
    PICGroupList: [],
    ProductTypeList: [],
  }

  CategoryList: any = [];

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();
  listModel = new BaseListModel();

  constructor(
    private orderService:OrderService,
    private systemService:SystemService,
    private spinner:NgxSpinnerService,
    private userService:UserService,
    private dataFormService:DataformService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
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
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PO, this.userInfo.code, null).subscribe(x => {
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
    this.onInit();
  }

  loadData() {
    if(this.ReceiptFromDate){ this.searchData.ReceiptFromDate = moment(this.ReceiptFromDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptFromDate = '';}

    if(this.ReceiptToDate){this.searchData.ReceiptToDate = moment(this.ReceiptToDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptToDate = '';}

    if(this.ReceiptActualFromDate){ this.searchData.ReceiptActualFromDate = moment(this.ReceiptActualFromDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptActualFromDate = '';}

    if(this.ReceiptActualToDate){this.searchData.ReceiptActualToDate = moment(this.ReceiptActualToDate).format("MM/DD/YYYY");}
    else{this.searchData.ReceiptActualToDate = '';}

    this.loadingIndicator = true;
    this.orderService.PRItem_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_PRMasterList(this.userInfo.code).subscribe(x => {
      this.dataForm = x;
      if(this.dataForm.PICGroupList.length > 0){
        this.searchData.PICGroup = this.dataForm.PICGroupList[0].Value;
      }
    });
  }

  openPopupEdit(template: TemplateRef<any>, type: any,  id: any, status: any = null) {
    let check = true;
    console.log(status);
    if(status != null) {
      if(status != 1144) {
        check = false;
        const swalDelete = swal.mixin({
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-default'
          },
          buttonsStyling: false
        })
        swalDelete.fire(
          'Alert!',
          'You can not edit this PR',
          'error'
        )
      }
    }
    if(check){
      this.type = type;
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

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.ErrorCode == "00") {
      this.hasChanged = true;
    }
  }

  onExportToExcel(){
    this.spinner.show();
    this.orderService.PRItem_GetList(this.searchData).subscribe(x => {
      this.spinner.hide();
      this.listModel = x;
      let newList = this.listModel.DataList.map(function(obj) {
        return {
          PRNo: obj.PRNo,
          RequestNo: obj.RequestNo,
          Receipt: obj.PRReceiptDate,
          Type: obj.ProductTypeName,
          ProductName: obj.ProductName,
          Description: obj.ProductDes,
          Quantity: obj.Quantity,
          Unit: obj.UnitName,
          PRUnitPrice: obj.PRPrice,
          PRTotalPrice: obj.PRTotalPrice,
          PRCurrency: obj.PRCurrency,
          Order: obj.Orderer,
          PONo: obj.PONo,
          POUnitPrice: obj.POPrice,
          POTotalPrice: obj.POTotalPrice,
          POCurrency: obj.POCurrency,
          PIC: obj.PIC,
          ReceiptActual: obj.ReceiptActualDate,
          Payday: obj.PayDay,
        }
      });
      this.commonService.exportExcel(newList, 'PR Item List');
    });
  }

  formatMoney(money: any, currency: string = ''){
    if(money == null) return '';
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  totalMoney(price: any, quantity: any, currency: string = ''){
    if(price == null) return '';
    var money = parseFloat(price) * parseFloat(quantity);
    return StringHelper.moneyFormat(money) + " " + currency;
  }
  //-------------------
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

  triggerEnter(event) {
    if (event.key == "Enter") {
      this.loadData();
    }
  }

  onChangeSupplier(event){
    this.searchData.SupplierID = event[0].value;
    this.loadData();
  }

  onChangeIncoterm(event){
    this.searchData.IncotermCode = event[0].value;
    this.loadData();
  }

  onChangePICGroup(event){
    this.searchData.PICGroup = event[0].value;
    this.loadData();
  }

  onChangeProductType(event){
    this.searchData.ProductType = event[0].value;
    this.loadData();
  }
}
