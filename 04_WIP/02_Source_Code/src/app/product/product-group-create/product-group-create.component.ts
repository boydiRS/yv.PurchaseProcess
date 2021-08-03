import { ProductService } from './../../_services/product.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-product-group-create',
  templateUrl: './product-group-create.component.html',
  styleUrls: ['./product-group-create.component.css']
})
export class ProductGroupCreateComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() createBy: string;
  @Input() picGroup: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    PICGroupID: '',
    ProductCategoryName: '',
    Remark: '',
    CreateBy: '',
  }

  dataForm: any = {
    
  }

  constructor(
    private productService:ProductService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.dataItem.CreateBy = this.createBy;
    this.dataItem.PICGroupID = this.picGroup;
    this.onLoadDataForm();
  }

  onLoadDataForm() {
    // this.dataFormService.DataForm_ProductItemCreate(this.picGroup).subscribe(x => {
    //   this.dataForm = x;
    // });
  }

  acceptBtnModalClicked(){
    this.dataItem.CreateBy = this.createBy;
    this.spinner.show();
    this.productService.ProductCategory_Create(this.dataItem).subscribe(x => {
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
