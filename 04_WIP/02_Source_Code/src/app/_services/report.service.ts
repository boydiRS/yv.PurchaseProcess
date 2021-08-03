import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ApiUrl } from '../_models/const/ApiUrl';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService{

  ReportPurchase_ByProductCategory(searchData: any): Observable<any> {
    const data = this.getService<any>(ApiUrl.ReportPurchase_ByProductCategory, searchData);
    return data;
  }
}
