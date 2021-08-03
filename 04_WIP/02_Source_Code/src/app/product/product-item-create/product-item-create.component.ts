import { ProductService } from './../../_services/product.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-product-item-create',
  templateUrl: './product-item-create.component.html',
  styleUrls: ['./product-item-create.component.css']
})
export class ProductItemCreateComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() createBy: string;
  @Input() picGroup: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    PICGroupID: '',
    ProductNo: '',
    ProductName: '',
    ProductCategoryID: '',
    Weight: '0',
    Volume: '0',
    UnitID: '',
    OriginPrice: '0',
    Currency: 'VND',
    ProductType: '',
    Description:'',
    Model:'',
    Remark: '',
    CreateBy: '',
    ProductCode: '',
  }

  generateNo: any = {
    ProductNo: '',
  }

  dataForm: any = {
    CategoryList: [],
    UnitList: [],
    CurrencyList: [],
    ProductTypeList: [],
    ProductCodeList: [],
  }

  constructor(
    private productService:ProductService,
    private dataFormService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataItem.CreateBy = this.createBy;
    this.dataItem.PICGroupID = this.picGroup;
    this.onLoadDataForm();
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_ProductItemCreate(this.picGroup).subscribe(x => {
      this.dataForm = x;
      if(this.dataForm.ProductTypeList.length > 0){
        this.dataItem.ProductType = this.dataForm.ProductTypeList[0].Value;
        this.dataItem.ProductCode = this.dataForm.ProductCodeList[0].Value;
        this.onGenerateProductNo();
      }
    });
  }

  onGenerateProductNo(){
    this.productService.GenerateProductNo(this.picGroup, this.dataItem.ProductCode).subscribe(x => {
      this.generateNo = x;
      this.dataItem.ProductNo = this.generateNo.ProductNo;
    });
  }

  onChangeProductCode(event){
    this.dataItem.ProductCode = event[0].value;
    this.onGenerateProductNo();
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.productService.ProductItem_Create(this.dataItem).subscribe(x => {
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
