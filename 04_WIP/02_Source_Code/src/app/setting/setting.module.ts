import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { UnitListComponent } from './unit-list/unit-list.component';
import { UnitCreateComponent } from './unit-create/unit-create.component';
import { UnitEditComponent } from './unit-edit/unit-edit.component';
import { PaymenttermListComponent } from './paymentterm-list/paymentterm-list.component';
import { PaymenttermCreateComponent } from './paymentterm-create/paymentterm-create.component';
import { PaymenttermEditComponent } from './paymentterm-edit/paymentterm-edit.component';

@NgModule({
  declarations: [
    UnitListComponent, 
    UnitCreateComponent, 
    UnitEditComponent, PaymenttermListComponent, PaymenttermCreateComponent, PaymenttermEditComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    SettingRoutingModule
  ]
})
export class SettingModule { }
