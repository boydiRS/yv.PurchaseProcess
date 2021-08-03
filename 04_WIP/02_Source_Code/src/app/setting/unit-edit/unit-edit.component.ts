import { SystemService } from 'src/app/_services/system.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-unit-edit',
  templateUrl: './unit-edit.component.html',
  styleUrls: ['./unit-edit.component.css']
})
export class UnitEditComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() id: string;
  @Input() updateBy: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    ID: '',
    UnitName: '',
    UnitShortName: '',
    UnitName_Vn: '',
    UnitName_Jp: '',
    Remark: '',
    UpdateBy: '',
  }

  constructor(
    private systemService:SystemService,
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
    this.systemService.Unit_GetByID(this.id).subscribe(x => {
      this.dataItem = x;
    });
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.systemService.Unit_Edit(this.dataItem).subscribe(x => {
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
