import { NgModule } from '@angular/core';
import { SystemRoutingModule } from './system-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RequestCompletionReportComponent } from './request-completion-report/request-completion-report.component';

@NgModule({
  declarations: [

  RequestCompletionReportComponent],
  imports: [
    SharedModule,
    SystemRoutingModule
    
  ],
  exports: [

  ],
})
export class SystemModule { }
