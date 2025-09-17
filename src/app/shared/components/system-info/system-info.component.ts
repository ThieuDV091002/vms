import { HomeService as PermissionSvc } from '@proxy/controllers';
import { HomeService as CorporateSvc } from '@apis/corporate/controllers';
import { HomeService as TicketSvc } from '@apis/ticket/controllers';
import { HomeService as GeneralSvc } from '@apis/general/controllers';
import { HomeService as NotificationSvc } from '@apis/notification/controllers';
import { HomeService as DashboardSvc } from '@apis/dashboard/controllers';
import { HomeService as SchedulerSvc } from '@apis/scheduler/controllers';
import { Component, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { concatMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrl: './system-info.component.scss',
})

export class SystemInfoComponent implements OnInit {
  data: SystemInfo[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private permissionSvc: PermissionSvc,
    private corporateSvc: CorporateSvc,
    private ticketSvc: TicketSvc,
    private generalSvc: GeneralSvc,
    private notificationSvc: NotificationSvc,
    private dashboardSvc: DashboardSvc,
    private schedulerSvc:SchedulerSvc
  ) { }

  ngOnInit() {
    this.loadData();
    this.data.push({
      Name: 'UFE-WEBAPP',
      Version: environment.version,
      ServerName: 'UFE APP',
      IPAddress: environment.application.baseUrl,
      Runtime: 'Angular 17.1',
      SourceVersion: environment.sourceVersion,
      BuildTime: environment.buildTime,
      Status: true
    });
  }

  loadData() {
    this.permissionSvc.systemInfo()
      .subscribe(res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      }, error => {
        this.data = [...this.data, {
          Name: 'UFE-PERMISSION-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];
        this.cd.detectChanges();
      });
    this.corporateSvc.systemInfo()
      .subscribe(res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      }, error => {
        this.data = [...this.data, {
          Name: 'UFE-CORPORATE-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];

        this.cd.detectChanges();
      });
    this.ticketSvc.systemInfo()
      .subscribe(res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      }, error => {
        this.data = [...this.data, {
          Name: 'UFE-TICKET-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];
        this.cd.detectChanges();
      });
    this.generalSvc.systemInfo()
      .subscribe(res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      }, error => {
        this.data = [...this.data, {
          Name: 'UFE-GENERAL-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];
        this.cd.detectChanges();
      });
    this.notificationSvc.systemInfo()
      .subscribe({next:res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      },error: error => {
        this.data = [...this.data, {
          Name: 'UFE-NOTIFICATION-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];
        this.cd.detectChanges();
      }});
    this.dashboardSvc.systemInfo()
      .subscribe(res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      }, error => {
        this.data = [...this.data, {
          Name: 'UFE-DASHBOARD-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];
        this.cd.detectChanges();
      });

      this.schedulerSvc.systemInfo()
      .subscribe({next:res => {
        if (res) {
          let info = JSON.parse(res);
          info.Status = true;
          this.updateVersion(info);
          this.data = [...this.data, info];
          this.cd.detectChanges();
        }
      },error: error => {
        this.data = [...this.data, {
          Name: 'UFE-SCHEDULER-SVC',
          Version: '',
          ServerName: '',
          IPAddress: '',
          Runtime: '',
          SourceVersion: '',
          BuildTime: '',
          Status: false
        }];
        this.cd.detectChanges();
      }});

  }

  updateVersion(systemInfo: SystemInfo) {
    const versionPrefix = this.getVersionPrefix();
    if (versionPrefix) {

      systemInfo.Version = `${versionPrefix} (${systemInfo.Version})`
    }
  }

  getVersionPrefix(): string {
    const version = environment.version;
    const match = version.match(/^(.*?)\s*\(.*\)$/);
    return match ? match[1].trim() : '';
  }

}
import { SystemInfo } from '../../models/system-info.model';
