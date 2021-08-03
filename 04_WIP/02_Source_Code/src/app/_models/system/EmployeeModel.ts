import { BaseModel } from '../base/BaseModel';
import { CommonHelper } from 'src/app/_helpers/common.helper';

export class EmployeeModel extends BaseModel
{
    rowIndex:number;
    employeeCode:string;
    employeeName:string;
    employeeCode_Name:string;
    birthday:Date;
    sectionID:number;
    positionID:number;
    groupID:number;
    employeeLevel:number;
    email:string;
    phoneNumber:string;
    extNumber:string;
    address:string;
    about:string;
    image:string;
    printerCode:string;
    joinDate:Date;
    leaveDate:Date;
    isActive:boolean;
    remark:string;

    validData():boolean {
        return true;
    }
}