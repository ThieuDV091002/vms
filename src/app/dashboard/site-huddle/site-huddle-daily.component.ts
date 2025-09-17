import { ConfigStateService, PermissionService } from "@abp/ng.core";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BroadcastMessageService, MessageCategoryService } from "@apis/general";
import { MessageCategoryDto } from "@apis/general/dtos";

@Component({
    selector: 'app-site-huddle-daily',
    templateUrl: './site-huddle-daily.component.html',
    styleUrl: './site-huddle-daily.component.scss',

})
export class SiteHuddleDailyComponent implements OnInit {
    @Input() hasHeader = false;
    @Input() selectedDataTier: any;
    @Input() queryId: string;
    @Input() assignedAndDefaultDataTiers: any;
    @Input() widgets: any[] = [];
    @Output() addWidgetChange = new EventEmitter<any>();
    @Output() widgetUpdate = new EventEmitter<any>();

    safetyCategory: MessageCategoryDto = null;
    hasSafetyAlert = false;
    safetyAlertNumber = 0;
    startDate: string;
    endDate: string;
    site: any = {};
    enableEdit = false;

    constructor(
        private configService: ConfigStateService,
        private messageCategoryService: MessageCategoryService,
        private broadcastMessageService: BroadcastMessageService,
        private permissionService: PermissionService
    ) {
        this.enableEdit = this.permissionService.getGrantedPolicy('Dashboard.Update');
        const tenantInfo: any = this.configService.getOne('extraProperties');
        if (tenantInfo?.DataTierType === 'Site') {
            this.site.id = tenantInfo?.DataTierId;
            this.site.name = tenantInfo?.DataTierName;
        }
    }

    ngOnInit(): void {
        this.getSafetyAlertInfo();
    }

    getSafetyAlertInfo() {
        // if not have safety category, then no need to request safety alert message
        if (!this.safetyCategory) {
          this.messageCategoryService.getByName('Safety').subscribe(res => {
            this.safetyCategory = res || {};
            this.getSafetyAlertMessage();
          });
        } else {
          this.getSafetyAlertMessage();
        }
    }

    getSafetyAlertMessage() {
        // if safety category not have id, then no need to request safety alert message
        if (!this.safetyCategory.id) {
          this.safetyAlertNumber = 0;
          this.hasSafetyAlert = false;
          return;
        }
        this.broadcastMessageService.getList({
          userId: this.configService.getOne('currentUser').id,
          categoryId: this.safetyCategory.id,
          areas: this.selectedDataTier?.areas?.map(area => area?.id),
          isExcludeExpiredMessage: true,
          cells: [],
          workCenters: [],
          maxResultCount: 10
        }).subscribe({
          next: (res) => {
            this.safetyAlertNumber = res.totalCount;
            this.hasSafetyAlert = res.totalCount > 0;
          },
          error: ()=> {
            this.safetyAlertNumber = 0;
            this.hasSafetyAlert = false;
          }
        });
    }

    findWidgetBySeq(seq: number) {
        return this.widgets.find(widget => widget.seq === seq);
    }

}