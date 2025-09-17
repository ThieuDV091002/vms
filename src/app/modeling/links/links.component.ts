import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { IdentityRoleDto, IdentityRoleService } from '@abp/ng.identity/proxy';
import { finalize } from 'rxjs';
import { LocalizationService } from '@abp/ng.core';
import { LinkCategoryService, LinkService } from '@apis/general/links';
import { CreateUpdateLinkDto, LinkCategoryDto, LinkDto, LinkGetListInput } from '@apis/general/links/dtos';
import { ModelingHistoryDto } from '@apis/general/dtos';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "LinksComponent",
    },
  ]
})
export class LinksComponent extends ModelingBase<LinkService, LinkGetListInput, CreateUpdateLinkDto> implements OnInit {

  data: PagedResultDto<LinkDto> = { items: [], totalCount: 0 };
  linkCategoriesData: LinkCategoryDto[] = [];
  roleData: IdentityRoleDto[] = [];
  selected: LinkDto;
  form: FormGroup;
  historys: PagedResultDto<ModelingHistoryDto>;
  isModalVisible = false;
  isHistoryModalVisible = false;
  modalBusy = false;
  keyword = '';
  selectedRoles = [];
  info: string;
  infos: string;
  constructor(
    private fb: FormBuilder,
    private confirmation: ConfirmationService,
    public list: ListService<LinkGetListInput>,
    public service: LinkService,
    private linkCategoryService: LinkCategoryService,
    private roleService: IdentityRoleService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'link');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::Link').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_Link').subscribe(data => {
      this.infos = data
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

  private hookToQuery() {
    this.list.hookToQuery(query => { return this.service.getList({ ...query }) }).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    if (this.linkCategoriesData.length === 0 || this.roleData.length === 0) {
      this.getLinkCategories();
      this.getAllRoles();
    }
    this.selected = {} as LinkDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.selectedRoles = this.selected?.linkRoleDtos?.map(item => item.roleName);
    this.form = this.fb.group({
      name: [this.selected.name || '', Validators.required],
      displayName: [this.selected.displayName || '', Validators.required],
      description: [this.selected.description || ''],
      url: [this.selected.url || '', Validators.required],
      linkCategoryId: [this.selected.linkCategoryId || '', Validators.required],
      linkRoles: [this.selectedRoles || undefined, Validators.required],
      tags: [this.selected.tags?.split(',') || ''],
      tenantId: [this.selected.tenantId || ''],
      tenantName: [this.selected.tenantName || '']
    });
  }

  edit(row: any) {
    if (this.linkCategoriesData.length === 0 || this.roleData.length === 0) {
      this.getLinkCategories();
      this.getAllRoles();
    }
    this.service.get(row.id).subscribe((link) => {
      this.selected = link;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(e: any) {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info, e.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(e.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, e.name],
          });
          this.list.get();
        });
      }
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
    requestBody.linkCategoryName = this.linkCategoriesData.find(item => item.id === requestBody.linkCategoryId).displayName;


    this.modalBusy = true;
    const request = this.selected.id
      ? this.service.update(this.selected.id, requestBody)
      : this.service.create(requestBody);
    request.pipe(finalize(() => { this.modalBusy = false; })).subscribe(() => {
      this.modalBusy = false;
      if (!this.selected.id) {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, requestBody.name],
        });
      }
      else {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.selected.name],
        });
      }
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  searchByfilter(event: string) {
    this.list.filter = event;
    this.list.get();
  }

  selectedRoleChanges(event) {
    this.form.controls['linkRoles'].setValue(event.map(item => { return item.name }));
  }

  multiDelete(e) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.infos + '<br/>', e.objectNames.join(',<br/>')],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.infos, e.objectNames],
          });
          this.list.get()
        });
      }
    });
  }

  copy(e, callback = null) {
    const info = this.removeLastS(e.objectType);
    this.service.get(e.data.id).subscribe(data => {
      const dataToCopy: CreateUpdateLinkDto = {
        name: e.data.name,
        displayName: e.data.name,
        description: e.data.description,

        url: e.data.url,
        tags: e.data.tags,
        linkCategoryId: e.data.linkCategoryId,
        linkCategoryName: e.data.linkCategoryName,
        linkRoles: data.linkRoleDtos.map(item => {
          return {
            roleName: item.roleName
          }
        }),
        tenantId: e.data.tenantId,
        tenantName: e.data.tenantName,
        extraProperties: {}
      };
      this.service['create'](dataToCopy).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [info, e.data.name],
        });
        this.list.get();
        if (callback && typeof callback === 'function') {
          callback(res);
        }
      });
    })
  }
}
