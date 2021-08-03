import { DataformService } from 'src/app/_services/dataform.service';
import { ReportService } from './../../_services/report.service';
import { Component, OnInit} from '@angular/core';
import { UserInfoModel } from 'src/app/_models/user/UserSessionModel';
import { UserService } from 'src/app/_services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as CanvasJS from '../../../assets/vendor_components/canvasjs/canvasjs.min';
import * as moment from 'moment';

@Component({
  selector: 'app-purchase-by-product-category',
  templateUrl: './purchase-by-product-category.component.html',
  styleUrls: ['./purchase-by-product-category.component.css']
})
export class PurchaseByProductCategoryComponent implements OnInit {
  userInfo:UserInfoModel;

  searchData: any = {
    year: '',
    month: '',
    picGroup: '',
  }

  time:any;

  listModel: any = {
    GraphList:[],
  };

  dataForm: any = {
    PICGroupList: [],
  }

  constructor(
    private reportService:ReportService,
    private userService:UserService,
    private spinner:NgxSpinnerService,
    private dataFormService:DataformService,
    private toastr:ToastrService,
    private router:Router
  ) { 
    this.userInfo = this.userService.getUserInfo();
  }

  ngOnInit() {
    let today = new Date();
    this.time = moment(today).format('YYYY-MM');
    this.loadDataForm();
  }

  loadDataForm() {
    this.dataFormService.DataForm_ReportPurchaseByProductCategory(this.userInfo.code).subscribe(x => {
      this.dataForm = x;
    });
  }

  loadData() {
    var monthyear = this.time.split("-")
    this.searchData.month = monthyear[1];
    this.searchData.year = monthyear[0];
    this.spinner.show();
    this.reportService.ReportPurchase_ByProductCategory(this.searchData).subscribe(x => {
      this.spinner.hide();
      if (x.ErrorCode !== '00') {
        this.toastr.error(x.Message);
      } else {
        this.listModel = x;
        this.chartCreateDonut();
        this.charCreate();
      }
    });
  }

  chartCreateDonut(){
    var dataP = [];
    this.listModel.GraphItem.forEach(element => {
      dataP.push({ y: element.Total, name: element.ProductCategoryName })
    });
    let chart = new CanvasJS.Chart("chart", {
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: ""
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        innerRadius: 60,
        showInLegend: true,
        // toolTipContent: "<b>{name}</b>: {y} (#percent%)",
        toolTipContent: "<b>{name}</b>: #percent%",
        indexLabel: "{name} - #percent%",
        dataPoints: dataP
      }]
    });
    chart.render();
  }

  charCreate() {
    var dataP = [];
    this.listModel.GraphItem.forEach(element => {
      dataP.push({ y: element.Total, label: element.ProductCategoryName })
    });
    let chart = new CanvasJS.Chart("chart1", {
      animationEnabled: true,
      exportEnabled: true,
      title:{
        text: ""
      },
      data: [{
        type: "column",
        dataPoints: dataP
      }]
    });
    chart.render();
  }

  triggerEnter(event) {
    if (event.key == "Enter") {
      this.loadData();
    }
  }
}
