import { Component, OnInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { BasePagingModel } from 'src/app/_models/base/BasePagingModel';
import { SurveyService } from 'src/app/_services/survey.service';
import { CommonService } from 'src/app/_services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonHelper } from 'src/app/_helpers/common.helper';
import { BaseListModel } from 'src/app/_models/base/BaseListModel';
import swal from 'sweetalert2';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
})
export class SurveyListComponent implements OnInit {
  id: string;
  delMessage: string = "Delete cai nay di nhe";
  bsModalRefCreate: BsModalRef;
  bsModalRefEdit: BsModalRef;
  bsModalRefSetting: BsModalRef;
  userCode: string;
  userInfo:UserInfoModel = new UserInfoModel();

  hasChanged: boolean = false;

  searchData: any = {
    newsTypeID: '',
    sortColumn: '',
    sortColumnDir: '',
    pageIndex: 1,
  }

  dataForm: any = {
    newsTypeList: [],
  }

  listModel = new BaseListModel();

  constructor(
    private surveyService:SurveyService,
    private changeDetection:ChangeDetectorRef,
    private commonService:CommonService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router:Router
  ) { }

  ngOnInit() {
    this.userInfo = this.userService.getUserInfo();
    this.userCode = this.userInfo.code;
    this.loadDataForm();
    this.loadData();
  }

  loadDataForm() {
    // this.systemService.Employee_GetDataForm_Create().subscribe(x=>{
    //   this.dataForm = x;
    // });
  }

  loadData() {
    this.spinner.show();
    this.surveyService.SurveyMaster_GetList(this.searchData).subscribe(x => {
      this.spinner.hide();
      this.listModel = x;
    }, error => {
      this.spinner.hide();
      const baseModel = CommonHelper.getError(error);
      if (baseModel.errorCode === "02") {
        this.router.navigateByUrl('/login');
      }
      else
        this.toastr.error(baseModel.message);
    });
  }

  setPage(pageInfo) {
    if (pageInfo.count != null) this.searchData.pageIndex = pageInfo.offset + 1;
    this.loadData();
  }

  onSort(sortInfo) {
    this.searchData.sortColumn = sortInfo.sorts[0].prop;
    this.searchData.sortColumnDir = sortInfo.sorts[0].dir;
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

  openPopupEdit(template: TemplateRef<any>, id: string) {
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

  openPopupSetting(template: TemplateRef<any>, id: string) {
    this.id = id;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefSetting = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
      }
    });
  }

  openPopupDelete(id: string) {
    const swalDelete = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: false
    })
    swalDelete.fire({
      title: 'Are you sure delete this survey?',
      text: 'You will not be able to recover survey data!',
      type: 'error',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        this.surveyService.SurveyMaster_Delete(id)
          .subscribe(x => {
            this.spinner.hide();
            if (x.errorCode !== '00') {
              this.toastr.error(x.message);
            } else {
              // this.toastr.success(x.message);
              swalDelete.fire(
                'Deleted!',
                'Your survey has been deleted.',
                'success'
              )
              this.loadData();
            }
          }, error => {
            this.spinner.hide();
            const baseModel = CommonHelper.getError(error);
            if (baseModel.errorCode === "02") {
              this.router.navigateByUrl('/login');
            }
            else
              this.toastr.error(baseModel.message);
        });
      }
    })
  }

  triggerEnter(event) {
    if (event.key === "Enter") {
      this.loadData();
    }
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.errorCode == "00") {
      this.hasChanged = true;
    }
  }

  onChangeNewsType(event){
    this.searchData.newsTypeID = event.target.value;
    this.loadData();
  }

  onChangeActive(id){
    this.spinner.show();
    this.surveyService.SurveyMaster_Active(id)
      .subscribe(x => {
        this.spinner.hide();
        if (x.errorCode !== '00') {
          this.toastr.error(x.message);
        } 
        else this.toastr.success(x.message);
      }, error => {
        this.spinner.hide();
        const baseModel = CommonHelper.getError(error);
        if (baseModel.errorCode === "02") {
          this.router.navigateByUrl('/login');
        }
        else this.toastr.error(baseModel.message);
    });
    // this.loadData();
  }
}
