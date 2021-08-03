import { ExpensesService } from './../../_services/expenses.service';
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

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.css']
})
export class ExpensesListComponent implements OnInit {
  id: string = '';
  bsModalRefEdit: BsModalRef;
  bsModalRefDetail: BsModalRef;

  userInfo:UserInfoModel;
  loadingIndicator: boolean = false;

  hasChanged:boolean = false;

  searchData: any = {
    ExpNo: '',
    PICCode: '',
    ExpenseFromDate: '',
    ExpenseToDate: '',
    SortColumn: '',
    SortColumnDir: '',
    PageIndex: 1,
    ItemsPerPage: 25,
  }

  ExpenseFromDate: '';
  ExpenseToDate: '';

  createData: any = {
    PICGroup: '',
    CreateBy: '',
  }

  dataForm: any = {
    PICList: [],
  }

  CategoryList: any = [];

  rowPerPage:any = [15, 25, 50];
  pagingModel = new BasePagingModel();

  constructor(
    private expService:ExpensesService,
    private systemService:SystemService,
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
    this.systemService.CheckPermission(WorkingProcessConst.APP_PPM_EXPENSES, this.userInfo.code, null).subscribe(x => {
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
    if(this.ExpenseFromDate){
      this.searchData.ExpenseFromDate = moment(this.ExpenseFromDate).format("MM/DD/YYYY");
    }else{
      this.searchData.ExpenseFromDate = '';
    }

    if(this.ExpenseToDate){
      this.searchData.ExpenseToDate = moment(this.ExpenseToDate).format("MM/DD/YYYY");
    }else{
      this.searchData.ExpenseToDate = '';
    }
    
    this.loadingIndicator = true;
    this.expService.ExpensesMaster_GetAll(this.searchData).subscribe(x => {
      this.loadingIndicator = false;
      this.pagingModel = x;
    });
  }

  loadDataForm() {
    this.dataFormService.DataForm_ExpensesMasterList().subscribe(x => {
      this.dataForm = x;
    });
  }

  openPopupEdit(template: TemplateRef<any>, id: any) {
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

  formatMoney(money: any, currency: any = null){
    return StringHelper.moneyFormat(money) + " " + currency;
  }

  onChangePIC(event){
    this.searchData.PICCode = event[0].value;
    this.loadData();
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
}
