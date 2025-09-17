import { ConfigStateService } from '@abp/ng.core';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { AreaService } from '@apis/corporate';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@proxy/services';
import { AppUtils } from 'src/app/modeling/utils/app.utils';

@Component({
  selector: 'app-suport-teams',
  templateUrl: './suport-teams.component.html',
  styleUrl: './suport-teams.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SuportTeamsComponent implements OnInit {
  private modalService = inject(NgbModal);
  haveAccessTreeNode: any;
  dataTierTreeNode: any;
  tenantInfo: any;
  selectedDataTier: any;
  isActive: boolean = false;

  constructor(
    private eRef: ElementRef,
    private areaService: AreaService,
    private userService: UserService,
    private configService: ConfigStateService
  ) {
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.userService.getTreeviewDataTiersByUser(this.configService.getOne('currentUser').id).subscribe(res => {
      if (res && res.assignedDataTiers.length > 0) {
        const areaData = res.assignedDataTiers
          .filter(d => d.areaId)
          .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area' }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          );
        this.areaService.getTreeViewList({ids: areaData.map(d => d.id), tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(response => {
          AppUtils.initTreeData(response);
          this.dataTierTreeNode = response;
          this.initHaveAccessTreeNode(res.assignedDataTiers);
        })
      }
    })
  }

  initHaveAccessTreeNode(assignedDataTiers) {
    this.haveAccessTreeNode = AppUtils.initHasAccessTreeNode(
      this.dataTierTreeNode,
      assignedDataTiers
    );
}

  openDialog(content: TemplateRef<any>) {
    this.isActive = !this.isActive;
    this.selectedDataTier = null;
    const modalRef = this.modalService.open(content, {
      size: 'xl',
      centered: true,
      modalDialogClass: 'support-team-modal',
    });
    modalRef.result.finally(() => {
      this.isActive = !this.isActive;
    });
  }

  // refresh data based on area change
  areaChange(e) {
    this.selectedDataTier = e;
  }

  // refresh data based on cell change
  cellChange(e) {
    this.selectedDataTier = e;
  }

  // refresh data based on work center change
  workCenterChange(e) {
    this.selectedDataTier = e;
  }
}
