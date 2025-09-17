import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { IdentityRoleDto, IdentityRoleService } from '@abp/ng.identity/proxy';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { finalize, Observable } from 'rxjs';
import { RightBarService } from 'src/app/shared/services/right-bar.service';
import { LocalizationService } from '@abp/ng.core';
import { LinkCategoryDto, LinkGetListInput, LinkViewDto } from '@apis/general/links/dtos';
import { LinkService, LinkCategoryService } from '@apis/general/links';
@Component({
  selector: 'app-link-widget',
  templateUrl: './link-widget.component.html',
  styleUrl: './link-widget.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "LinkWidgetComponent"
    }
  ]
})
export class LinkWidgetComponent implements OnInit, OnChanges {

  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() index = -1;
  @Input() selectedWidget: any;
  @Input() expandChart = false;
  @Input() queryId;

  isSettingsModalVisible = false;
  pageSize: number;
  widgetTitle: string;
  form: FormGroup;
  data: PagedResultDto<LinkViewDto> = { totalCount: 0, items: [] };
  searchKeyword = '';
  @ViewChild('myTable') table: DatatableComponent;
  isModalVisible = false;
  modalBusy = false;
  linkCategoriesData: LinkCategoryDto[];
  roleData: IdentityRoleDto[];
  selectedRoles = [];
  info: string;
  widgetInfo: string;
  constructor(
    private confirmation: ConfirmationService,
    private toasterService: ToasterService,
    private service: LinkService,
    public list: ListService<LinkGetListInput>,
    private rightBarService: RightBarService,
    private fb: FormBuilder,
    private linkCategoryService: LinkCategoryService,
    private roleService: IdentityRoleService,
    private localizationService: LocalizationService
  ) {


  }

  ngOnInit(): void {
    this.getLinkCategories();
    this.getAllRoles();
    this.localizationService.get('::Link').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }

  private getLinkCategories() {
    this.linkCategoryService.getAllInstances().subscribe(res => {
      this.linkCategoriesData = res;
    })
  }

  private getAllRoles() {
    this.roleService.getAllList().subscribe(res => {
      this.roleData = res.items;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedWidget && changes.selectedWidget.currentValue) {
      this.pageSize = this.selectedWidget.extraProperties.pageSize;
      this.widgetTitle = this.selectedWidget.name;
      this.hookToQuery();
    }
  }

  hookToQuery() {
    setTimeout(() => {
      this.table.limit = this.pageSize
    }, 0);
    this.list.hookToQuery(query => {
      return this.service.getLinksViewListWithoutFilterTargetRole({
        ...query,
        skipCount: this.table.offset * this.pageSize,
        maxResultCount: this.pageSize,
        keyword: this.searchKeyword,
      })
    }).subscribe(res => {
      this.data = res;
    });
  }

  deleteLinksWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '',{
      messageLocalizationParams: [this.widgetInfo,this.selectedWidget.name],
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selectedWidget });
      }
    });
  }

  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
    setTimeout(() => {
      this.table.recalculate();
    }, 0);
  }

  getTargetReaders(role) {
    let targetRaders = '';
    role.forEach((item, index) =>
      index === 0 ? targetRaders = item.roleName : targetRaders += ', ' + item.roleName
    );
    return targetRaders;
  }

  addOrRemoveFavorite(id, type) {
    const request: Observable<any> = type ? this.service.deleteFromFavoriteByLinkId(id) : this.service.addAsFavoriteByLinkId(id)
    request.subscribe(res => {
      this.toasterService.success('AbpSettingManagement::SuccessfullySaved');
      this.list.get();
      this.rightBarService.refreshData.next('refresh');
    })
  }

  openSettings() {
    this.isSettingsModalVisible = true;
  }

  saveSettiings() {
    if (this.widgetTitle === '' || [null, 0].includes(this.pageSize)) {
      return;
    }
    const requestBody: any = {
      dashboardId: this.selectedWidget.dashboardId,
      seq: this.selectedWidget.seq,
      widgetName: this.selectedWidget.widgetName,
      name: this.widgetTitle,
      description: this.selectedWidget.description,
      tenantId: this.selectedWidget.tenantId,
      displayName: this.selectedWidget.displayName,
      id: this.selectedWidget.id,
      extraProperties: {
        pageSize: this.pageSize.toString()
      }
    }

    this.updateChange.emit({ type: 'update', widget: requestBody });
    this.isSettingsModalVisible = false;
    this.selectedWidget = requestBody;
    this.list.get();
  }

  add() {
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
      description: [''],
      url: ['', Validators.required],
      linkCategoryId: ['', Validators.required],
      linkRoles: [undefined, Validators.required],
      tags: [''],
      tenantId: [''],
      tenantName: ['']
    });
  }

  save() {
    if (this.form.invalid || this.modalBusy) {
      return;
    }

    const requestBody = this.form.value;
    requestBody.tags = requestBody.tags.toString();
    requestBody.linkRoles = requestBody.linkRoles.map(item => {
      return {
        roleName: item
      }
    });
    requestBody.linkCategoryName = this.linkCategoriesData.find(item => item.id === requestBody.linkCategoryId).name;

    this.modalBusy = true;
    this.service.create(requestBody).pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.widgetTitle, this.form.value.name],
      });
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  selectedRoleChanges(event) {
    this.form.controls['linkRoles'].setValue(event.map(item => { return item.name }));
  }

}
