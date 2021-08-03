import { WorkingProcessConst } from './../../_models/const/WorkingProcessConst';
import { SystemService } from './../../_services/system.service';
import { UserService } from './../../_services/user.service';
import { UserInfoModel } from './../../_models/user/UserSessionModel';
import { CommonService } from './../../_services/common.service';
import { OrderService } from './../../_services/order.service';
import { Component, OnInit, TemplateRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { DataformService } from 'src/app/_services/dataform.service';
import * as es6printJS from "print-js";

@Component({
  selector: 'app-request-completion-report',
  templateUrl: './request-completion-report.component.html',
  styleUrls: ['./request-completion-report.component.css']
})
export class RequestCompletionReportComponent implements OnInit {
  bsModalRefGroupTask: BsModalRef;
  bsModalRefOrderItemEdit: BsModalRef;

  public id: string;
  public requestNo: string;
  private sub: any;
  searchTestItem: string = '';
  remainTask:number = 25;
  barcodeValue:string = 'abc';

  hasChanged:boolean = false;
  userInfo:UserInfoModel;
  connectedTo = [];

  dataItem: any = {
    RequestNo: '',
    PurposeTest_Vn: '',
    PurposeTest_Jp: '',
    PurposeTest_En: '',
    GroupID: '',
    InternalRequest: '',
    EventMasterID: '',
    PurposeRequestID: '',
    RequesterSectionID: '',
    RequesterCode: '',
    ProductionBaseID: '',
    CustomerID: '',
    ReceiverCode: '',
    ReceiveDate: '',
    DeadLine: '',
    Remark: '',
    UpdateBy: '',
  }

  dataSearch: any = {
    SampleID: '',
  }

  dataOrderItem: any = {
    Suffix: '',
    ErrorCode: '',
    Message: '',
    TaskList: [],
  }

  dataForm: any = {
    SampleTypeList: [],
  }

  TestItemList = [] as any;

  currentContainer:any = {
    Value: '',
  }

  sortItem:any = {
    ID: '',
  }

  machineList = [] as any;

  constructor(
    private orderService:OrderService,
    private userService:UserService,
    private dataFormService:DataformService,
    private route:ActivatedRoute,
    private commonService:CommonService,
    private changeDetection:ChangeDetectorRef,
    private systemService:SystemService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  public innerHeight: any;
  public innerWidth: any;
  @HostListener('window:resize', ['$event'])

  ngOnInit() {
    this.innerWidth = window.innerWidth - 310;
    this.innerHeight = window.innerHeight - 145;
    // this.sub = this.route.params.subscribe(params => {
    //   this.requestNo = params['id'];
    //   this.barcodeValue = this.requestNo;
    // });

    
    // this.loadPermission();
  }

  print(){
    es6printJS("section-to-print", "html");
  }

  requestNoUpdate(event) {
    if (event.key == "Enter") {
      this.onLoadDataForm();
      this.onLoadData();
      this.barcodeValue = this.requestNo;
    }
  }

  prNoTriggerEnter(event) {
    if (event.key == "Enter") {
      this.onLoadDataForm();
      this.onLoadData();
      this.barcodeValue = this.requestNo;
    }
  }

  onResize(event){
    this.innerWidth = window.innerWidth - 310;
    this.innerHeight = window.innerHeight - 145;
  }

  permissionData:any = {
    IsPer: false,
  };

  loadPermission(){
    // this.systemService.CheckPermission(WorkingProcessConst.APP_MER_REQUESTMASTER, this.userInfo.code, 1).subscribe(x => {
    //   this.permissionData = x;
    // });
  }

  onLoadData() {
    this.systemService.RequestMaster_GetByID(this.requestNo).subscribe(x => {
      this.dataItem = x;
    });
  }

  onLoadDataReport(){
    this.systemService.RequestMaster_GetCompBySampleType(this.requestNo, this.dataSearch.SampleID).subscribe(x => {
      this.dataOrderItem = x;
      this.remainTask = 25 - this.dataOrderItem.RowTotal;
    });
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_RequestCompReport(this.requestNo).subscribe(x => {
      this.dataForm = x;
      if(this.dataForm.SampleTypeList != null) this.dataSearch.SampleID = this.dataForm.SampleTypeList[0].Value;
    });
  }

  openPopupGroupTask(template: TemplateRef<any>) {
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefGroupTask = this.commonService.openModal(template, null, 'modal-lg full-modal');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadDataReport();
        this.hasChanged = false;
      }
    });
  }

  openPopupOrderItemEdit(template: TemplateRef<any>, ID: any) {
    this.id = ID;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefOrderItemEdit = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.onLoadDataReport();
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

  onPrint(){
    window.print();
  }

  onCopyText(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.info("Copied");
  }
}
