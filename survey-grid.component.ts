import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonService } from 'src/app/_services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseListModel } from 'src/app/_models/base/BaseListModel';
import { CommonHelper } from 'src/app/_helpers/common.helper';
import { SurveyService } from 'src/app/_services/survey.service';
import { BsModalRef } from 'ngx-bootstrap';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { UserService } from 'src/app/_services/user.service';
import { SystemService } from 'src/app/_services/system.service';
import { WorkingProcessConst } from 'src/app/_models/const/WorkingProcessConst';
import swal from 'sweetalert2';

@Component({
  selector: 'app-survey-grid',
  templateUrl: './survey-grid.component.html',
  styleUrls: ['./survey-grid.component.css']
})
export class SurveyGridComponent implements OnInit {
  bsModalRefDetail: BsModalRef;
  hasChanged: boolean = false;
  id: string;
  userInfo:UserInfoModel = new UserInfoModel();
  employeeCode: string;

  searchData: any = {
    title: '',
    employeeCode: '',
  }

  permissionData:any = {
    isPer: false
  };

  listModel = new BaseListModel();
  constructor(
    private surveyService: SurveyService,
    private userService: UserService,
    private commonService:CommonService,
    private systemService:SystemService,
    private changeDetection:ChangeDetectorRef,
    private spinner:NgxSpinnerService,
    private toastr:ToastrService,
    private router:Router
  ) { }
  
  ngOnInit() {
    this.userInfo = this.userService.getUserInfo();
    this.searchData.employeeCode = this.userInfo.code;
    this.loadData();
    this.loadPermission();
  }

  loadPermission(){
    this.systemService.CheckPermission(WorkingProcessConst.APP_ADM_SURVEY, this.userInfo.code, null).subscribe(x => {
      this.permissionData = x;
    });
  }

  loadData() {
    this.spinner.show();
    this.surveyService.SurveyMaster_GetListByUser(this.searchData).subscribe(x => {
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

  triggerEnter(event) {
    if (event.key === "Enter") {
      this.loadData();
    }
  }

  openPopupDetail(template: TemplateRef<any>, id: string) {
    this.id = id;
    this.employeeCode = this.userInfo.code;
    this.commonService.changeDetection = this.changeDetection;
    this.bsModalRefDetail = this.commonService.openModal(template, null, 'modal-lg');
    this.commonService.bsmodalService.onHide.subscribe((reason: string) => {
      if(this.hasChanged){
        this.loadData();
        this.hasChanged = false;
        const swalCus = swal.mixin({
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-default'
          },
          buttonsStyling: false
        })
        swalCus.fire(
          'Done!',
          'Thanks for taking my survey!',
          'success'
        )
      }
    });
  }

  onAcceptBtnModalClick(data: any) {
    this.hasChanged = false;
    if (data.errorCode == "00") {
      this.hasChanged = true;
    }
  }
}
