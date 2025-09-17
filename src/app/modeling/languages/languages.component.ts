import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import {
  AbpApplicationConfigurationService,
  AbpApplicationLocalizationService,
  ApplicationLocalizationDto,
  ApplicationLocalizationResourceDto,
  LanguageInfo,
  ListService,
  PagedResultDto,
  RestService,
} from '@abp/ng.core';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, inject, Injector, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { concatMap, of, } from 'rxjs';
import { LocalizationService,ConfigStateService  } from '@abp/ng.core';
import { CreateUpdateLanguagesDto, LanguagesDto, LanguagesGetListInput } from '@proxy/dtos/language';
import { LanguagesService, OverridingMode } from '@proxy';
import { AppUtils } from '../utils/app.utils';
import { saveAs } from 'file-saver';
import { read, utils } from 'xlsx-js-style';
import { FileType } from '../utils/file-type.enum';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { FailedImportResultItemDto } from '@proxy/dtos';
import { UserService } from '@proxy/services';
interface toolbarButtonsType {
  import?: boolean;
  export?: boolean;
}
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'languages',
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'UserMenuComponent',
    },
  ],
})

export class LanguagesComponent {
  protected readonly FileType = FileType;
  selected: LanguagesDto;
  isCollapse = false;
  isModalVisible: boolean;
  data: PagedResultDto<LanguagesDto> = { items: [], totalCount: 0 };
  originalValues = {};
  form: FormGroup;
  languages: LanguageInfo[] = [];
  info: string;
  pageSize: number = 10;
  isImportDetailsVisible = false;
  importData: any = [];
  importResult: FailedImportResultItemDto[] = [];
  @Input() objectType: string;
  @Input() toolbarButtons: toolbarButtonsType;
  overridingMode: OverridingMode = OverridingMode.Overwrite;
  private readonly OverridingMode = OverridingMode;
  acceptFileType = {
    [FileType.Json]: '.json',
  };
  filterForm: FormGroup;
  originalData: PagedResultDto<LanguagesDto> = { items: [], totalCount: 0 };
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  filterName = '';
  filterExtraProperties = '';
  getByNameData;
  oldLanguage: LanguagesDto;
  typeOptions = [
    { value: 'CAPTION_', label: 'Captions' },
    { value: 'LABEL_', label: 'Labels' },
    { value: 'BTN_', label: 'Buttons' },
    { value: 'MENU_', label: 'Menus' },
    { value: 'TOOLTIP_', label: 'Tooltips' },
    { value: 'NOTIF_', label: 'Notifications' },
    { value: 'INSTR_', label: 'Instructions' },
    { value: 'MSG_', label: 'General Messages' },
    { value: 'ERROR_', label: 'Error Messages' },
    { value: 'ALERT_', label: 'Alert Messages' }
  ];
  currentSelectLabel: any;
  currentSelectDateFrom: any;
  currentSelectDateTo: any;
  typeFilter: any;
  filteredItems: any;
  keys: string[];
  addedKeys: Set<unknown>;
  isSorted: boolean = false;
  showAdvancedFilter: boolean = false;
  filterSearchHasValue: boolean = false;
  exportDisabled: boolean = true;
  importConfirmVisible = false;
  existingData = [];
  newData = [];
  constructor(
    injector: Injector,
    public list: ListService<LanguagesGetListInput>,
    private confirmationService: ConfirmationService,
    private toasterService: ToasterService,
    private service: LanguagesService,
    private fb: FormBuilder,
    private localizationService: AbpApplicationLocalizationService,
    private config: AbpApplicationConfigurationService,
    private userService: UserService,
    private label_localizationService: LocalizationService,
    private configState: ConfigStateService,
    public restService: RestService

  ) {
    this.languages= this.configState.getDeep("localization.languages");
    this.selected= this.configState.getDeep("localization.currentCulture");

     this.getLocalization$('en')
      .pipe(
        concatMap(data => {
          if (data) {
            this.updateOriginalValues(data);
            if (this.selected.name === 'en') {
              return of(data);
            } else return this.getLocalization$(this.selected.name);
          }
        })
      )
      .subscribe(data => {
        // this.setData(data.resources);
      });
  }

  private updateOriginalValues(data: any): void {
    if (data?.resources) {
      let ss: Record<string, string> = {};
      for (const item in data.resources) {
        ss = { ...ss, ...data.resources[item].texts };
      }
      this.originalValues = ss;
    }
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit() {
    this.buildFilterForm();
    this.label_localizationService.get('::LABEL_Language').subscribe(data => {
      this.info = data
    });
    this.adjustPageSize();
  }

  adjustPageSize() {
    const width = window.screen.height;
    if (width >= 1440) {
      this.pageSize = 30;
    } else if (width >= 1080) {
      this.pageSize = 20;
    } else {
      this.pageSize = 10; // 默认值
    }
  }


  save() {
    if (this.form.invalid) {
      return;
    }
    this.selected.extraProperties = { ...this.selected.extraProperties, ...{} };
    for (const key in this.selected.extraProperties) {
      if (key === this.form.value.name) {
        this.selected.extraProperties[key] = this.form.value.description;
        break;
      }
    }

    let editform: CreateUpdateLanguagesDto = {
      name: this.selected.name,
      description: this.selected.description,
      displayName: this.selected.displayName,
      extraProperties: this.selected.extraProperties,
    };

    this.service.createOrUpdate(editform)
      .pipe(concatMap(async data => {
        this.selected = data;
        if (this.selected.lastModifierId ?? this.selected.creatorId) {
          let res = await this.userService.get([this.selected.lastModifierId ?? this.selected.creatorId], { skipHandleError: true }).toPromise()
          if (res && res.length > 0) {
            this.selected['user'] = res[0].userName;
          }
          else {
            this.selected['user'] = '-';
          }
        }
        return of(data).toPromise();
      }))
      .subscribe(data => {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.form.value.name],
        });
        this.isModalVisible = false;
        this.form.reset();
        this.data = { items: [], totalCount: 0 };
        for (const key in this.selected.extraProperties) {
          this.data.items.push({ name: key, description: this.selected.extraProperties[key], displayName: this.originalValues[key], lastModificationTime: this.selected.lastModificationTime, lastModifierId: this.selected.lastModifierId, creationTime: this.selected.creationTime, creatorId: this.selected.creatorId, type: this.getLanguageType(key) });
          this.data.totalCount++;
        }
        this.search();
      });
  }

  edit(row: LanguagesDto) {
    this.form = this.fb.group({
      name: [row.name || '', Validators.required],
      description: [row.description || '', Validators.required],
    });
    this.isModalVisible = true;
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  search() {
    const fromDate = this.filterForm.controls['creationTimeFrom'].value;
    const toDate = this.filterForm.controls['creationTimeTo'].value;
    this.currentSelectDateFrom = fromDate ? new Date(fromDate) : null;
    this.currentSelectDateTo = toDate ? new Date(toDate) : null;

    const hasDateRange = this.currentSelectDateTo && this.currentSelectDateFrom;
    const filteredByDate = hasDateRange ? this.originalData.items.filter(item =>
      new Date(item.creationTime) <= this.currentSelectDateTo &&
      new Date(item.creationTime) >= this.currentSelectDateFrom
    ) : this.originalData.items;
    if (this.typeFilter && this.typeFilter.label) {
      this.currentSelectLabel = this.typeFilter.label;
    } else {
      this.currentSelectLabel = null;
    }

    this.data = { items: [], totalCount: 0 };
    this.addedKeys = new Set();
    Object.keys(this.originalValues).forEach(enKey => {
      let isEquCurrentLabel = true;
      let isEquCurrentDate = true;
      if (this.currentSelectLabel) {
        isEquCurrentLabel = this.getLanguageType(enKey) === this.currentSelectLabel;
      }
      if (this.currentSelectDateFrom && this.currentSelectDateTo) {
        const date = new Date(this.oldLanguage.extraProperties[enKey] ? this.selected.creationTime : new Date());
        isEquCurrentDate = (date >= this.currentSelectDateFrom) && (date <= this.currentSelectDateTo);
      }
      if (isEquCurrentLabel && isEquCurrentDate && (enKey.toLowerCase().indexOf(this.list.filter.toLowerCase()) >= 0 || this.selected.extraProperties[enKey].toLowerCase().indexOf(this.list.filter.toLowerCase()) >= 0 || this.originalValues[enKey].toLowerCase().indexOf(this.list.filter.toLowerCase()) >= 0)) {
        if (!this.addedKeys.has(enKey)) {
          if (this.getByNameData) {
            this.data.items.push({
              name: enKey,
              type: this.getLanguageType(enKey),
              description: this.selected.extraProperties[enKey],
              displayName: this.originalValues[enKey],
              creationTime: this.oldLanguage.extraProperties[enKey] ? this.selected.creationTime : new Date()
            });
            this.data.totalCount++;
          }
          else {
            this.data.items.push({
              name: enKey,
              type: this.getLanguageType(enKey),
              description: this.selected.extraProperties[enKey],
              displayName: this.originalValues[enKey],
            });
            this.data.totalCount++;
          }
          this.addedKeys.add(enKey);
        }
      }
    })
  }

  languageChange(e) {
    this.exportDisabled = false;
    this.selected.name = e.cultureName;
    this.updateOriginalValues(this.getLocalization$('en'));
    this.selected['user'] = null;
    this.selected.creationTime = null;
    this.selected.creatorId = null;
    this.selected.lastModificationTime = null;
    this.selected.lastModifierId = null;
    this.selected.displayName = this.languages.find(
      x => x.cultureName === this.selected.name
    )?.displayName;
    this.getLocalization$(this.selected.name).subscribe(data => {
      this.setData(data?.resources);
      this.search();
    });
  }

  setData(resource: Record<string, ApplicationLocalizationResourceDto>) {
    let ss: Record<string, string>;
    for (const item in resource) {
      ss = { ...ss, ...resource[item].texts };
    }
    for (const key in this.originalValues) {
      if (!ss[key]) {
        ss[key] = '';
      }
    }
    this.selected.extraProperties = ss;
    this.data = { items: [], totalCount: 0 };
    this.originalData.items = [];
    this.addedKeys = new Set();
    Object.keys(this.originalValues).forEach(enKey => {
      if (!this.addedKeys.has(enKey)) {
        if (this.getByNameData) {
          const newItem = {
            name: enKey,
            type: this.getLanguageType(enKey),
            description: this.selected.extraProperties[enKey],
            displayName: this.originalValues[enKey],
            lastModificationTime: this.oldLanguage.extraProperties[enKey] ? this.selected.lastModificationTime : new Date(),
            lastModifierId: this.selected.lastModifierId,
            creationTime: this.oldLanguage.extraProperties[enKey] ? this.selected.creationTime : new Date(),
            creatorId: this.selected.creatorId,
          };
          this.addedKeys.add(enKey);
          this.data.items.push(newItem);
          this.originalData.items.push(newItem);

          this.data.totalCount++;
          this.originalData.totalCount++;
        }
        else {
          const newItem = {
            name: enKey,
            type: this.getLanguageType(enKey),
            description: this.selected.extraProperties[enKey],
            displayName: this.originalValues[enKey],
          };
          this.addedKeys.add(enKey);
          this.data.items.push(newItem);
          this.originalData.items.push(newItem);

          this.data.totalCount++;
          this.originalData.totalCount++;
        }
        this.addedKeys.add(enKey);
      }
    })

  }

  getLocalization$(cultureName: string) {
    return this.service.getByName(cultureName).pipe(concatMap(data => {
      this.getByNameData = data;
      this.oldLanguage = data;
      if (data) {
        this.selected.creationTime = data.creationTime;
        this.selected.creatorId = data.creatorId;
        this.selected.lastModificationTime = data.lastModificationTime;
        this.selected.lastModifierId = data.lastModifierId;
      }
      if (cultureName) {
        return this.localizationService.get({ cultureName, onlyDynamics: false });
      } else {
        if (data) {
          let texts = data.extraProperties as Record<string, string>;
          return of({ resources: { [cultureName]: { texts: texts } } as Record<string, ApplicationLocalizationResourceDto> } as ApplicationLocalizationDto);
        }
      }
    }), concatMap(async data => {
      if (this.selected.lastModifierId ?? this.selected.creatorId) {
        let res = await this.userService.get([this.selected.lastModifierId ?? this.selected.creatorId], { skipHandleError: true }).toPromise()
        if (res && res.length > 0) {
          this.selected['user'] = res[0].userName;
        }
        else {
          this.selected['user'] = '-';
        }
      }
      return of(data).toPromise();
    }));
  }

  formatDate(data) {
    if (data) {
      return new Date(data).toLocaleString();
    }
    else {
      return '';
    }
  }

  getLanguageType(key: string): string {
    if (key.startsWith('CAPTION_')) return 'Captions';
    if (key.startsWith('LABEL_')) return 'Labels';
    if (key.startsWith('BTN_')) return 'Buttons';
    if (key.startsWith('MENU_')) return 'Menus';
    if (key.startsWith('TOOLTIP_')) return 'Tooltips';
    if (key.startsWith('NOTIF_')) return 'Notifications';
    if (key.startsWith('INSTR_')) return 'Instructions';
    if (key.startsWith('MSG_')) return 'General Messages';
    if (key.startsWith('ERROR_')) return 'Error Messages';
    if (key.startsWith('ALERT_')) return 'Alert Messages';
    return 'UNKNOWN';
  }

  onTypeChange(event) {
    this.typeFilter = event;
    this.search();
  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      creationTimeFrom: [null],
      creationTimeTo: [null],
    });
  }

  filterData() {
    const { creationTimeFrom, creationTimeTo } = this.filterForm.value;
    this.filterSearchHasValue = !!(creationTimeFrom || creationTimeTo);
    this.search();
  }

  clearAdvancedFilter() {
    this.filterForm.reset();
    this.filterSearchHasValue = false;
    this.currentSelectDateFrom = null;
    this.currentSelectDateTo = null;
    this.search();
  }
  exportClick(fileType) {
    this.selected.extraProperties = { ...this.selected.extraProperties, ...{} };
    let editform: CreateUpdateLanguagesDto = {
      name: this.selected.name,
      description: this.selected.description,
      displayName: this.selected.displayName,
      extraProperties: this.selected.extraProperties,
    };
    this.service.createOrUpdate(editform)
      .pipe(concatMap(async data => {
        this.selected = data;
        if (this.selected.lastModifierId ?? this.selected.creatorId) {
          let res = await this.userService.get([this.selected.lastModifierId ?? this.selected.creatorId], { skipHandleError: true }).toPromise()
          if (res && res.length > 0) {
            this.selected['user'] = res[0].userName;
          }
          else {
            this.selected['user'] = '-';
          }
        }
        return of(data).toPromise();
      }))
      .subscribe(data => {
        this.service.exportByFileTypeAndIds(fileType, [data.id]).subscribe({
          next: (res: any) => {
            saveAs(
              this.base64ToBlob(res, AppUtils.generateFileName('Languages', fileType)),
              AppUtils.generateFileName('Languages', fileType)
            );
          },
          error: error => {
            this.confirmationService.error(error.error.message, 'An error has occurred!', {
              hideCancelBtn: true,
              yesText: 'AbpAccount::Close',
            });
          },
        });
      });
  }

  exportAllClick(fileType) {
    this.service.exportAllByFileType(fileType).subscribe({
      next: (res: any) => {
        saveAs(
          this.base64ToBlob(res, AppUtils.generateFileName('Languages', fileType)),
          AppUtils.generateFileName('Languages', fileType)
        );
      },
      error: error => {
        this.confirmationService.error(error.error.message, 'An error has occurred!', {
          hideCancelBtn: true,
          yesText: 'AbpAccount::Close',
        });
      },
    });
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      const acceptedFormats = htmlEl.accept.split(',').map(ext => ext.trim());
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        this.confirmationService.error(
          `<b>${this.label_localizationService.instant('::LABEL_InvalidFileFormat')}</b><br>${this.label_localizationService.instant('::MSG_InvalidFileFormat').replace('{0}', htmlEl.accept)}`,
          '',
        { hideCancelBtn: true, yesText: 'AbpAccount::Close' });
        return;
      }
        const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = event => {
        const data = event.target?.result;
          if (typeof data === 'string') {
            this.importData = JSON.parse(data);
          }
      };
      if (this.importData.length) {
        this.checkExistingData();
      }
    } else {
      this.importData = [];
    }
  }

  checkExistingData() {
    this.existingData = [];
    this.newData = [];
    this.service.getExistInstances(this.importData).subscribe(res => {
      if (res.length === 0) {
        this.importData(this.importData);
      } else {
        this.importData.forEach((model: any) => {
          let existing = res.find((item) => item.name === model.Name);
          if (existing) {
            this.existingData.push(model);
          } else {
            this.newData.push(model);
          }
        });
        this.importConfirmVisible = true;
      }
    });
  }

  customeImport(selectedData) {
    this.importConfirmVisible = false;
    this.importFile([...this.newData, ...selectedData]);
  }
  importFile(data: any) {
    for (let data of this.importData) {
      data.Creator = data.Creator || 'defaultCreator';
      data.TenantId = data.TenantId || '00000000-0000-0000-0000-000000000000';
      data.LastModifier = data.LastModifier || 'defaultLastModifier';
      data.ExtraProperties = JSON.stringify(data.ExtraProperties);
      for (let key in data) {
        try {
          data[key] = JSON.parse(data[key]);
        } catch (e) {
        }
      }
    }

    this.service
      .importByDtosAndMode(data, this.overridingMode)
      .subscribe(res => {
        if (res.items?.length > 0) {
          this.importResult = res.items;
          this.isImportDetailsVisible = true;
        } else {
          this.toasterService.success('::LABEL_SuccessfullyImported');
        }
        this.getLocalization$(this.selected.name).subscribe(data => {
          this.setData(data?.resources);
        })
      });
  }
}
