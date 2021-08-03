import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiUrl } from '../_models/const/ApiUrl';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { EmployeeModel } from '../_models/system/EmployeeModel';

@Injectable({
    providedIn: 'root'
})

export class SystemService extends BaseService {
    
    //---------
    RequestMaster_GetByID(ID: any): Observable<any> {
        const params = new HttpParams().set('id', ID);
        const data = this.getService<any>(ApiUrl.requestMaster_GetByID, params);
        return data;
    }
    RequestMaster_GetCompBySampleType(requestNo: any, sampleTypeID: any): Observable<any> {
        const params = new HttpParams()
          .set('requestNo', requestNo)
          .set('sampleTypeID', sampleTypeID);
        const data = this.getService<any>(ApiUrl.requestMaster_GetCompBySampleType, params);
        return data;
    }
    //----------------------------------------------------------------- Unit -----------------------------------
    Unit_GetAll(searchData: any) : Observable<any> {
        const data = this.getService<any>(ApiUrl.unit_GetAll, searchData);
        return data;
    }
    Unit_GetByID(id: any) {
        const params = new HttpParams()
            .set('id', id);
        const data = this.getService<any>(ApiUrl.unit_GetByID, params);
        return data;
    }
    Unit_Create(inputData: any) {
        const data = this.postService<any>(ApiUrl.unit_Create, inputData);
        return data;
    }
    Unit_Edit(inputData: any) {
        const data = this.postService<any>(ApiUrl.unit_Edit, inputData);
        return data;
    }
    Employee_GetByCode(employeeCode: string) {
        const params = new HttpParams()
        .set('code', employeeCode);
        const data = this.getService<any>(ApiUrl.employee_GetByCode, params);
        return data;
    }
    Employee_GetByUsername(employeeCode: string) {
        const params = new HttpParams()
        .set('code', employeeCode);
        const data = this.getService<any>(ApiUrl.employee_GetByUsername, params);
        return data;
    }
    CheckPermission(appID, employeeCode, state, picGroup = null, sectionID = null) {
        const params = new HttpParams()
            .set('appID', appID)
            .set('employeeCode', employeeCode)
            .set('state', state)
            .set('picGroup', picGroup)
            .set('sectionID', sectionID);
        const data = this.getService<any>(ApiUrl.checkPermission, params);
        return data;
    }
    CalendarMonth_GetAll(searchData: any) : Observable<any> {
        const data = this.getService<any>(ApiUrl.calendarMonth_GetAll, searchData);
        return data;
    }

    // getAllFileType(): Observable<any> {
    //     const params = new HttpParams();
    //     const data = this.getWithToken<any>(ApiUrl.getAllFileType, params);
    //     return data;
    // }

    // download(path: string) {
    //     const params = new HttpParams()
    //         .set('path', path);
    //     const data = this.getDownloadFile(ApiUrl.downloadFile, params);
    //     return data;
    // }

    // downloadTempFile(path: string) {
    //     const params = new HttpParams()
    //         .set('path', path);
    //     const data = this.getDownloadFile(ApiUrl.downloadTempFile, params);
    //     return data;
    // }
}
