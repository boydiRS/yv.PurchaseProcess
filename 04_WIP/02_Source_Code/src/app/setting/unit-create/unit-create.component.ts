import { SystemService } from 'src/app/_services/system.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataformService } from 'src/app/_services/dataform.service';

@Component({
  selector: 'app-unit-create',
  templateUrl: './unit-create.component.html',
  styleUrls: ['./unit-create.component.css']
})
export class UnitCreateComponent implements OnInit {
  @Input() bsModalRef: BsModalRef;
  @Input() createBy: string;
  @Input() picGroup: string;
  @Output() acceptBtnModalClick = new EventEmitter();

  dataItem: any = {
    UnitName: '',
    UnitShortName: '',
    UnitName_Vn: '',
    UnitName_Jp: '',
    Remark: '',
    CreateBy: '',
  }

  dataForm: any = {

  }

  constructor(
    private systemService:SystemService,
    private dataFormService:DataformService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.dataItem.CreateBy = this.createBy;
    this.dataItem.PICGroup = this.picGroup;
  }

  acceptBtnModalClicked(){
    this.spinner.show();
    this.systemService.Unit_Create(this.dataItem).subscribe(x => {
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
