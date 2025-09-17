import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { FileType, OverridingMode } from '@apis/ticket';
import { LocalizationService } from '@abp/ng.core';
import { WorkCenterService } from '@apis/corporate';
import { WorkCenterDto } from '@apis/corporate/dtos';
import { read, utils } from 'xlsx-js-style';
import { UserService } from '@proxy/services';
import { FocusedItemService } from '@apis/ticket/role-board-settings';
import { CreateUpdateFocusedItemDto, FocusedItemDto, FocusedItemGetListInput } from '@apis/ticket/role-board-settings/dtos';
@Component({
  selector: 'app-focused-item',
  templateUrl: './focused-tiems.component.html',
  styleUrl: './focused-tiems.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'StateComponent',
    },
  ],
})
export class FocusedItemsComponent extends ModelingBase<FocusedItemService, FocusedItemGetListInput, CreateUpdateFocusedItemDto> implements OnInit {
  readonly FileType = FileType;
  readonly OverridingMode = OverridingMode;
  overridingMode = OverridingMode.Overwrite;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<FocusedItemDto> = { items: [], totalCount: 0 };
  // data = {items: [], totalCount: 0}
  form: FormGroup;
  pageSize = 10;
  selectedItems: FocusedItemDto[] = [];
  importData: any = [];
  userMap: { [key: string]: string } = {};
  info: string;
  infos: string;
  language: string;
  currentUserId: string;
  allWorkCenters: WorkCenterDto[] = [];
  filterWorkCenters: WorkCenterDto[] = [];
  acceptFileType = {
    [FileType.Json]: '.json',
    [FileType.Excel]: '.xls,.xlsx',
    // [FileType.Csv]: '.csv',
  };
  isTableHovered = false;
  workCenterLoading = false;
  tenantInfo: any;

  constructor(
    public list: ListService<FocusedItemGetListInput>,
    public service: FocusedItemService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private session: SessionStateService,
    private localizationService: LocalizationService,
    private userService: UserService,
    private workCenterService: WorkCenterService,
  ) {
    super(service, list, 'focused-item');
    this.language = this.session.getLanguage();
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getCurrentUser();
    this.localizationService.get('::LABEL_FocusedItem').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::MENU_FocusedItem').subscribe(data => {
      this.infos = data
    });
  }

  getCurrentUser() {
    const user = this.configService.getOne('currentUser');
    this.currentUserId = user.id;
    this.userMap[user.id] = user.userName;
  }

  // displayCheck() {
  //   return true;
  // }

  getCheckboxClass() {
    if (this.selectedItems.length > 0)
      return ''
    else
      return this.isTableHovered ? '' : 'd-none'
  }

  filterOptions(searchText) {
    if (searchText) {
      this.filterWorkCenters = this.allWorkCenters.filter(w => w.name.toLowerCase().includes(searchText.toLowerCase())).slice(0, 20);
    } else {
      this.filterWorkCenters = this.allWorkCenters.slice(0, 20);
    }
  }

  allSelectedMap: { [key: string]: any } = {};

  onSelect({selected}) {
    if (selected && Array.isArray(selected)) {
      this.selectedItems = selected;

      this.data.items.forEach(item => {
        if (item.id) {
          const isSelected = selected.some(s => s.id === item.id);
          if (isSelected) {
            this.allSelectedMap[item.id] = item;
          } else {
            delete this.allSelectedMap[item.id];
          }
        }
      });
    }
  }

  getSelectedItemsForCurrentPage() {
    return this.data.items.filter(item =>
      item.id && this.allSelectedMap[item.id]
    );
  }

  multiDelete() {
    const selectedItems = Object.values(this.allSelectedMap);
    const partNumbersToDelete = selectedItems
      .filter(s => s.partNumber)
      .map(s => s.partNumber);

    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.infos + '<br/>', partNumbersToDelete.join(',<br/>')],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        const deleteIds = selectedItems.filter(s => s.id).map(s => s.id);
        this.service['multipleDeleteByIds'](deleteIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.infos, partNumbersToDelete.join(', ')],
          });
          this.list.get();
          this.selectedItems = [];
          this.allSelectedMap = {};
        });
      }
    });
  }

  displayCheck(row) {

    return true;
  }

  isRowSelected(row) {
    return row.id && this.allSelectedMap[row.id] !== undefined;
  }

  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      const acceptedFormats = htmlEl.accept.split(',').map(ext => ext.trim());
      const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!acceptedFormats.includes(fileExtension)) {
        this.confirmationService.error(
          `<b>${this.localizationService.instant('::LABEL_InvalidFileFormat')}</b><br>${this.localizationService.instant('::MSG_InvalidFileFormat').replace('{0}', htmlEl.accept)}`,
          '',
        { hideCancelBtn: true, yesText: 'AbpAccount::Close' });
        return;
      }
      const isJsonFile = fileExtension === '.json' || file.type === 'application/json';
      const reader = new FileReader();
      if (isJsonFile) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
      reader.onload = (event) => {
        const data = event.target?.result;
        if (isJsonFile) {
          if (typeof data === 'string') {
            this.importData = JSON.parse(data);
          }
        } else {
          const workbook = read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          this.importData = utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true });
        }
        if (this.importData.length) {
          this.importFile();
        }
      }
    } else {
      this.importData = [];
    }
  }

  exportClick(type) {
    this.export({objectType: 'FocusedItems', fileType: type, objectIds: this.selectedItems.filter(item => item.id).map(item => item.id)});
  }

  exportAllClick(type) {
    this.exportAll({objectType: 'FocusedItems', fileType: type});
  }

  exportDisabled() {
    return this.selectedItems.filter(item => item.id).length === 0;
  }

  importFile() {
    this.import({data: this.importData, overridingMode: this.overridingMode, objectType: 'FocusedItems'});
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  buildUserMap() {
    for (let item of this.data.items) {
      const userId = item.lastModifierId ? item.lastModifierId : item.creatorId;
      if (!userId || this.userMap.hasOwnProperty(userId)) { continue }
      this.userMap[userId] = null;

      this.userService.get([userId]).subscribe(res => {
        if (res?.length > 0)
          this.userMap[userId] = res[0].userName;
      }, error => {
        if (error)
          error = {}

      })
    }
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList({...query, workCenterName: query['filter']}))
      .subscribe(res => {
        this.data = res;
        this.resetOptions("resetOptions", {});
        this.buildUserMap();
      });
  }

  resetOptions(value, row) {
    if(value === undefined) {
      row.workCenterId = '00000000-0000-0000-0000-000000000000';
    }
    const resetOp = () => {
      this.filterWorkCenters = this.allWorkCenters.slice(0, 20);
      this.data.items.forEach(item => {
        if (item.workCenterId && !this.filterWorkCenters.find(w => w?.id === item.workCenterId) && this.allWorkCenters.find(w => w?.id === item.workCenterId)) {
          this.filterWorkCenters.push(this.allWorkCenters.find(w => w?.id === item.workCenterId));
        }
      })
    }
    if (!this.allWorkCenters.length) {
      this.workCenterLoading = true;
      this.workCenterService.getAllInstancesByTenantInfo(this.tenantInfo?.DataTierType, this.tenantInfo?.DataTierId).subscribe(res => {
        this.allWorkCenters = res;
        this.workCenterLoading = false;
        resetOp();
      })
    } else {
      resetOp();
    }

  }

  add() {
    this.data.items = [{
      workCenterId: '00000000-0000-0000-0000-000000000000',
      workCenter: {} as WorkCenterDto,
      partNumber: '',
      priority: 1,
      creationTime: new Date(),
      creatorId: this.currentUserId,
      tenantId: '',
    },...this.data.items]
    this.data.totalCount += 1;
    this.selectedItems = [];
  }

  isSaveButtonDisabled(row): boolean {
    return row.workCenterId === '00000000-0000-0000-0000-000000000000' && row.partNumber === '';
  }

  save(row) {
if ((row.workCenterId || row.partNumber) && row.priority) {
        const workCenter = this.allWorkCenters.find(w => w.id === row.workCenterId);
        const request = row.id
          ? this.service.update(row.id, {...row, workCenterName: workCenter?.name || ''})
          : this.service.create({...row, workCenterName: workCenter?.name || ''});
        request.subscribe(() => {
            const workCenter = this.filterWorkCenters.find(w => w.id === row.workCenterId);
            const nameToShow = workCenter?.name || row.partNumber;
            if (!row.id) {
                this.toasterService.success('::LABEL_CreatedSuccessfully','',{
                    messageLocalizationParams: [this.info,nameToShow],
                });
            }
            else{
                this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
                    messageLocalizationParams: [this.info,nameToShow],
                });
            }
            this.list.get();
        });
    }
}

  // multiDelete() {
  //   const partNumbersToDelete = this.selectedItems
  //   .filter(s => s.partNumber)
  //   .map(s => s.partNumber);

  //   this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
  //     messageLocalizationParams: [this.infos,partNumbersToDelete.join(', ')],
  //   }).subscribe((status) => {
  //     if (status === Confirmation.Status.confirm) {
  //       const deleteIds = this.selectedItems.filter(s => s.id).map(s => s.id);
  //       this.service['multipleDeleteByIds'](deleteIds).subscribe(() => {
  //         this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
  //           messageLocalizationParams: [this.infos,partNumbersToDelete.join(', ')],
  //         });
  //         this.list.get();
  //         this.selectedItems = [];
  //       });

  //     }
  //   });
  // }

  pageChange(event) {
    this.pageSize = Number(event);
  }

  isSelectedItemsModalOpen = false;
  protected readonly Object = Object;

  showSelectedItems(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.tagName === 'SELECT' ||
        target.tagName === 'OPTION' ||
        target.closest('select') ||
        target.closest('.ms-2')) {
      return;
    }

    if (target.closest('.selected-count-wrapper')) {
      this.isSelectedItemsModalOpen = true;
      event.stopPropagation();
      return;
    }

    if (target.tagName === 'SPAN' && target.textContent?.includes('selected')) {
      this.isSelectedItemsModalOpen = true;
      return;
    }

    const selectedCountWrapper = target.closest('.selected-count-wrapper');
    if (selectedCountWrapper) {
      const textContent = target.textContent || '';
      if (textContent.includes('total')) {
        this.isSelectedItemsModalOpen = true;
      }
    }
  }

  getSelectedItems() {
    return Object.values(this.allSelectedMap);
  }
}
