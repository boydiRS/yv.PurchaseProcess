import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { CanActivate } from '@angular/router';
import { UserService } from '../_services/user.service';
import { CookieService } from 'ngx-cookie';
import { UserInfoModel } from '../_models/user/UserSessionModel';
import { SystemService } from '../_services/system.service';
import { UserConst } from '../_models/const/UserConst';

@Injectable({ providedIn: 'root' })
export class Auth implements CanActivate {
    constructor(
        private router: Router,
        private userService: UserService,
        private systemService: SystemService,
        private cookieService: CookieService,
    ) { 
        
    }

    sessionLogin:string;
    sessionLoginCheck: boolean;
    userInfo = new UserInfoModel();

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // this.sessionLoginCheck = this.cookieService.check("loginUsername");
        // console.log("Session " + this.sessionLoginCheck + this.cookieService.get("loginUsername"));
        this.sessionLogin = this.cookieService.get("loginUsername");
        if(this.sessionLogin == null) { // chuwa login
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        else {
            // this.sessionLogin = this.cookieService.get("loginUsername");
            this.userInfo = this.userService.getUserInfo();
            // if(this.userInfo == null){
                this.systemService.Employee_GetByUsername(this.sessionLogin).subscribe(y => {
                    const userInfo = new UserInfoModel();
                    userInfo.fullname = y.EmployeeName;
                    userInfo.code = y.EmployeeCode;
                    userInfo.avatar = y.Avatar;
                    userInfo.sectionID = y.SectionID;
                    userInfo.positionID = y.PositionID;
                    userInfo.groupID = y.GroupID;
            
                    localStorage.setItem(UserConst.SS_USER_INFO, JSON.stringify(userInfo));
                });
            // }
        }
        // check xem đã đăng nhập chưa?
        // const ssUserModel = this.userService.getUserSession();
        // if (ssUserModel == null) {
        //     this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        //     return false;
        // }

        // if (ssUserModel.isAdmin) {
        //     return true;
        // }

        // Check quyền của url
        // let url = state.url.toLowerCase();
        // if (state.url === '/') {
        //     url = '/home';
        // }

        // if (ssUserModel.actionUrls.indexOf(url) === -1) {
        //     this.router.navigate(['khong-co-quyen-truy-cap']);
        //     return false;
        // }

        // OK
        return true;
    }
}
