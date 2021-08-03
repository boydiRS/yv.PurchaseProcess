import { ProductService } from './../../_services/product.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-group-edit',
  templateUrl: './product-group-edit.component.html',
  styleUrls: ['./product-group-edit.component.css']
})
export class ProductGroupEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    PICGroupID: '',
    ProductCategoryName: '',
    Remark: '',
    UpdateBy: '',
  }

  dataForm: any = {
    
  }

  constructor(
    private productService:ProductService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { 
    
  }

  ngOnInit() {
    this.dataItem.UpdateBy = this.updateBy;
    this.onLoadDataForm();
    this.onLoadData();
  }

  onLoadData() {
    this.productService.ProductCategory_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  onLoadDataForm() {
    
  }

  acceptBtnModalClicked(){
    this.dataItem.UpdateBy = this.updateBy;
    this.spinner.show();
    this.productService.ProductCategory_Edit(this.dataItem).subscribe(x => {
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
