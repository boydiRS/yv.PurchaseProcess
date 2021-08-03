import { DataformService } from 'src/app/_services/dataform.service';
import { ProductService } from './../../_services/product.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-item-edit',
  templateUrl: './product-item-edit.component.html',
  styleUrls: ['./product-item-edit.component.css']
})
export class ProductItemEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ProductNo: '',
    PICGroupID: '',
    ProductName: '',
    ProductCategoryID: '',
    Weight: '0',
    Volume: '0',
    UnitID: '',
    OriginPrice: '0',
    Currency: '',
    ProductType: '',
    Description:'',
    Model:'',
    Remark: '',
    UpdateBy: '',
  }

  dataForm: any = {
    CategoryList: [],
    UnitList: [],
    CurrencyList: [],
    ProductTypeList: [],
  }

  constructor(
    private productService:ProductService,
    private dataFormService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { 
    
  }

  ngOnInit() {
    this.dataItem.UpdateBy = this.updateBy;
    this.onLoadData();
  }

  onLoadData() {
    this.productService.ProductItem_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
      if(this.dataItem.ProductCategoryID != null) this.dataItem.ProductCategoryID = this.dataItem.ProductCategoryID.toString();
      if(this.dataItem.UnitID != null) this.dataItem.UnitID = this.dataItem.UnitID.toString();
      if(this.dataItem.ProductType != null) this.dataItem.ProductType = this.dataItem.ProductType.toString();
      this.onLoadDataForm();
    });
  }

  onLoadDataForm() {
    this.dataFormService.DataForm_ProductItemCreate(this.dataItem.PICGroupID).subscribe(x => {
      this.dataForm = x;
    });
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.productService.ProductItem_Edit(this.dataItem).subscribe(x => {
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
