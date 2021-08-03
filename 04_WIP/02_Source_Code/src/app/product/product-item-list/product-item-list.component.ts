import { BaseListModel } from './../../_models/base/BaseListModel';
import { CommonHelper } from 'src/app/_helpers/common.helper';
import { StringHelper } from './../../_helpers/string.helper';
import { ProductService } from 'src/app/_services/product.service';
import { WorkingProcessConst } from './../../_models/const/WorkingProcessConst';
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
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-item-list',
  templateUrl: './product-item-list.component.html',
  styleUrls: ['./product-item-list.component.css']
})
export class ProductItemListComponent implements OnInit {
  id: string;
  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    Name: '',
    PICGroupID: '',
    CategoryID: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  dataForm: any = {
    CategoryList: [],
    PICGroupList: [],
  }

  CategoryList: any = [];

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();
  listModel = new BaseListModel();

  constructor(
    private productService:ProductService,
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
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_PRODUCT, this.userInfo.code, 1, this.searchData.PICGroupID).subscribe(x => {
      this.permissionData = x;
    });
  }

  ngOnInit() {
    this.innerHeight = window.innerHeight - 170;
    this.loadDataForm();
  }

  loadData() {
    this.loadingIndicator = true;
    this.productService.ProductItem_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
      this.loadPermission();
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_ProductItemList(this.userInfo.code).subscribe(x => {
      this.dataForm = x;
      if(this.dataForm.PICGroupList.length > 0){
        this.searchData.PICGroupID = this.dataForm.PICGroupList[0].Value;
      }
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

  openPopupCreate(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefCreate = this.commonService.openModal(template, null, 'modal-lg');
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
    this.bsModalRefEdit = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  onDeleteProduct(id){
    const swalDelete = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: false
    })
    swalDelete.fire({
      title: 'Are you sure delete this Product?',
      text: 'You will not be able to recover it!',
      type: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.productService.ProductItem_Delete(id).subscribe(x => {
          this.spinner.hide();
          if (x.ErrorCode !== '00') {
            this.toastr.error(x.Message);
          } else {
            this.toastr.success(x.Message);
            this.loadData();
          }
        });
      }
    })
  }

  onExportToExcel(){
    this.spinner.show();
    this.productService.ProductItem_GetList(this.searchData).subscribe(x => {
      this.spinner.hide();
      this.listModel = x;
      let newList = this.listModel.DataList.map(function(obj) {
        return {
          ProductNo: obj.ProductNo,
          ProductName: obj.ProductName,
          Description: obj.Description,
          ProductCategoryName: obj.ProductCategoryName,
          OriginPrice:obj.OriginPrice,
          Currency: obj.Currency,
          UnitName: obj.UnitName,
          Remark: obj.Remark,
        }
      });
      this.commonService.exportExcel(newList, 'Product List');
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

  formatMoney(money: any, currency: any = ''){
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  onChangePICGroup(event){
    this.searchData.PICGroupID = event[0].value;
    this.filterCategory();
    this.loadData();
  }
  onChangeCategory(event){
    if(event.length > 0){
      this.searchData.CategoryID = event[0].value;
    }
    else{
      this.searchData.CategoryID = '';
    }
    this.loadData();
  }
  filterCategory(){
    this.CategoryList = [];
    this.dataForm.CategoryList.forEach(element => {
      if(element.Filter == this.searchData.PICGroupID){
        this.CategoryList.push(element);
      }
    });
  }
}
