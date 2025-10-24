import { ListService, PermissionService, SessionStateService } from '@abp/ng.core';
import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { read, utils } from 'xlsx-js-style';
import { AppUtils } from '../utils/app.utils';
import { FileType } from '../utils/file-type.enum';
import { OverridingMode } from '@proxy';
import { UserService } from '@proxy/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import { TreeViewComponent } from 'src/app/shared/components/tree-view/tree-view.component';
import { ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Confirmation } from '@abp/ng.theme.shared';
import { LocalizationService } from "@abp/ng.core";
interface columnsType {
  displayKey: string;
  field: string;
  options?: any;
  sortDisable?: boolean;
  altField?: string;
}

interface copyFeildType {
  displayKey: string;
  field: string;
  required?: boolean;
  clearValue: boolean;
}

interface permissionType {
  create: boolean;
  edit: boolean;
  delete: boolean;
  copy: boolean;
  import: boolean;
  export: boolean;
  canDeleteOrExport?: boolean;
  notify?: boolean;
}

interface toolbarButtonsType {
  move?: boolean,
  import?: boolean;
  export?: boolean;
  create?: boolean;
  copy?: boolean;
  multiDelete?: boolean;
  notify?: boolean;
}

interface customActionType {
  displayKey: string;
  permission: string;
}
interface ColumnAction {
  displayKey: string;
  permission: string;
  func: EventEmitter<any>;
  parent: any
}
interface colorType {
  id: string;
  name: string;
}
@Component({
  selector: 'app-modeling-template',
  templateUrl: './modeling-template.component.html',
  styleUrl: './modeling-template.component.scss',
})
export class ModelingTemplateComponent implements OnInit, OnDestroy {
  @ContentChild('copyNgSelectField', {static: false}) copyNgSelectField: NgSelectComponent;
  @ContentChild('copyTreeViewField', {static: false}) copyTreeViewField: TreeViewComponent;

  protected readonly FileType = FileType;
  protected Object = Object;

  routes: Array<string> = [];
  @Input() hasLastUpdate = false;
  @Input() title!: string;
  @Input() objectType: string;
  @Input() copyPrefix: string;
  @Input() showAdvancendFilter: boolean = false;
  private _data: any;
  isSorted: boolean = false;
  showAdvancendFilterText: boolean = false;
  @Input() filterSearchHasValue: boolean = false;
  @Input() placeholder: string;
  @Input()
  @Input()
  private isPageChange = false;

  @Input()
  set data(data: any) {
    if (this.hasLastUpdate) {
      let ids = data.items.map(item => {
        if (!item.lastModifier) {
          return item.lastModifierId ? item.lastModifierId : item.creatorId;
        }
      });
      ids = [...new Set([...ids])];
      ids = ids.filter(id => id && !this.userMap.hasOwnProperty(id));
      if (ids.length > 0) {
        this.userService.get(ids, { skipHandleError: true }).subscribe(res => {
          for (let user of res) {
            this.userMap[user.id] = user.surname?( user.surname + ', ' + user.name): user.name;
          }
        }, error => {
          if (error)
            error = {}
        })
      }
    }

    this._data = data;

    if (this._data && this._data.items) {
      this.selected = this.getSelectedItemsForCurrentPage();
    }
  }
  get data(): any {
    return this._data;
  }
  @Input() columnActions: ColumnAction[] = [];
  @Input() copyFields: copyFeildType[] = [];
  @Input() columns: columnsType[] = [];
  @Input() toolbarButtons: toolbarButtonsType;
  @Input() copyDisabled = false;
  @Input() startDisabled = true;
  @Input() stopDisabled = true;
  @Input() executeHistoryDisabled = true;
  @Input() list: ListService;
  @Input() permissions: permissionType;
  @Input() customAction: customActionType;
  @Input() filterType: string;
  @Input() noNameCopy: boolean = false;
  @Input() noDisplayNameCopy = false;
  @Input() isRoleModeling: boolean;
  @Input() importAndExportOnlyJson: boolean = false;
  @Input() displayField: string = 'name';
  @Output() getCopyRoleName = new EventEmitter<string>();
  @Output() customActionTrigger: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();
  // toolbar event
  @Output() import: EventEmitter<any> = new EventEmitter<any>();
  @Output() export: EventEmitter<any> = new EventEmitter<any>();
  @Output() exportAll: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataAdd: EventEmitter<void> = new EventEmitter<void>();
  @Output() copyData: EventEmitter<any> = new EventEmitter<any>();
  @Output() multiDelete: EventEmitter<any> = new EventEmitter<any>();
  // table actions event
  @Output() dataEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataViewHistory: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveData: EventEmitter<any> = new EventEmitter<any>();
  @Output() copyModalOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() notifyData: EventEmitter<any> = new EventEmitter<any>();

  @Output() dataStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataStop: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataViewExecutionHistory: EventEmitter<any> = new EventEmitter<any>();

  isTableHovered = false;
  isSelectedItemsModalOpen = false;
  pageSize = 10;
  language: string
  selected = [];
  editRow: any;
  isModalOpen = false;
  newData: any = {};
  uploadType: FileType;
  userMap: { [key: string]: string } = {};
  importData: any = [];
  overridingMode: OverridingMode = OverridingMode.Overwrite;
  private readonly OverridingMode = OverridingMode;
  acceptFileType = {
    [FileType.Json]: '.json',
    [FileType.Excel]: '.xls,.xlsx',
    // [FileType.Csv]: '.csv',
  };
  form!: FormGroup;
  subscription: Subscription;
  constructor(private userService: UserService, private session: SessionStateService,
    private localizationService: LocalizationService,
    private permissionService: PermissionService, private fb: FormBuilder,
    private toasterService: ToasterService,
    private confirmationService: ConfirmationService) {
    this.language = session.getLanguage();
    this.calculatePermissions();

    // Monkey patch the confirmation service to detect confirmations
    const originalWarn = this.confirmationService.warn.bind(this.confirmationService);
    this.confirmationService.warn = (...args) => {
      const result = originalWarn(...args);
      result.subscribe((status) => {
        if (status === Confirmation.Status.confirm && this.pendingDeleteIds.length > 0) {
          this.checkAndRemovePendingDeleteIds();
        }
      });
      return result;
    };
  }

  ngOnInit(): void {
    this.adjustPageSize();
  }

  private calculatePermissions() {
    if (this.permissions) {
      this.permissions.canDeleteOrExport = this.permissions.delete || this.permissions.export;
    }
  }
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
  getLocalDate(date: string) {
    return AppUtils.getLocalDate(date);
  }

  adjustPageSize() {
    const width = window.screen.height;
    if (width >= 1440) {
      this.list.maxResultCount = 30;
      this.pageSize = 30;
    } else if (width >= 1080) {
      this.list.maxResultCount = 20;
      this.pageSize = 20;
    }
    else if (width >= 864) {
      this.list.maxResultCount = 15;
      this.pageSize = 15;
    }
    else {
      this.list.maxResultCount = 10;
      this.pageSize = 10;
    }
  }

  exportClick(type: FileType) {
    this.export.emit({ objectType: this.objectType, fileType: type, objectIds: this.selected.map(s => s.id) });
  }

  exportAllClick(type: FileType) {
    this.exportAll.emit({ objectType: this.objectType, fileType: type });
  }

  add() {
    this.dataAdd.emit();
  }

  copyDataClick(row) {
    this.editRow = row;
    this.newData = Object.assign({}, row);
    // build form
    this.form = this.fb.group({});
    if (this.copyFields && this.copyFields.length) {
      for (let copyField of this.copyFields) {
        this.form.addControl(copyField.field,
          this.fb.control(copyField.clearValue ? '' : this.newData[copyField.field],
            [Validators.required, copyField.field === 'email' || copyField.field === 'emailAddress' ? Validators.email : null])
        );
        if (copyField.clearValue) {
          this.newData[copyField.field] = null;
        }
      }
    } else {
      this.form.addControl('name', this.fb.control(this.newData.name, Validators.required));
      this.form.addControl('displayName', this.fb.control('', this.noDisplayNameCopy ? null : Validators.required));
    }
    if (this.copyTreeViewField) {
      this.copyTreeViewField.nodes.forEach(node => {
        node.checked = false;
        if (node.children && node.children.length) {
          node.children.forEach(child => {
            child.checked = false;
          });
        }
      });
    }
    if(this.copyNgSelectField && this.copyNgSelectField.element.id) {
      this.form.addControl(this.copyNgSelectField.element.id, this.fb.control('', Validators.required));
      this.copyNgSelectField.clearModel();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.copyNgSelectField) {
      this.subscription = this.copyNgSelectField.changeEvent.subscribe((e) => {
        if (e && e.id) {
          this.form.patchValue({ [this.copyNgSelectField.element.id]: e.id });
        } else {
          this.form.patchValue({ [this.copyNgSelectField.element.id]: '' });
        }
      });
    }
    if(this.isRoleModeling) {
      this.getCopyRoleName.emit(row.name);
    }
    this.copyModalOpen.emit();
    this.isModalOpen = true;
  }

  isTreeViewAval() {
    if (this.copyTreeViewField) {
      return !AppUtils.hasCheckedDataTier(this.copyTreeViewField.nodes);
    } else {
      return false;
    }
  }

  saveCopyData() {
    for (let copyField in this.form.value) {
      this.newData[copyField] = this.form.value[copyField];
    }
    if (this.copyTreeViewField) {
      this.newData[this.copyTreeViewField.element.nativeElement.id] = this.copyTreeViewField.nodes;
    }
    this.copyData.emit({ objectType: this.objectType, data: this.newData });
  }



  displayCheck() {
    return true;
  }

  allSelected: { [key: string]: any } = {};

  onSelect({ selected }) {
    if (selected && Array.isArray(selected)) {
      this.selected = selected;

      this._data.items.forEach(item => {
        if (item.id) {
          const isSelected = selected.some(s => s.id === item.id);
          if (isSelected) {
            this.allSelected[item.id] = item;
          } else {
            delete this.allSelected[item.id];
          }
        }
      });
    }
  }

  getSelectedItemsForCurrentPage() {
    if (!this.data || !this.data.items) {
      return [];
    }
    return this.data.items.filter(item =>
      item.id && this.allSelected[item.id]
    );
  }

  pageChange(event: any) {
    if (event.offset !== undefined) {
      if (this.list) {
        this.list.page = event.offset;
      }
      // Update selected items for current page
      setTimeout(() => {
        if (this._data && this._data.items) {
          this.selected = this.getSelectedItemsForCurrentPage();
        }
      });
    }
    else {
      this.pageSize = Number(event);
    }
  }

  edit(row) {
    this.dataEdit.emit({ id: row.id, name: row.userName ? row.userName : row.name });
  }

  delete(row) {
    this.dataDelete.emit({ id: row.id, name: row.userName || row.name || row.areaName || row.heading || row.section || row.fullName });
    this.pendingDeleteIds = [row.id];
  }

  pendingDeleteIds: string[] = [];

  multiDeleteClick() {
    const selectedItems = Object.values(this.allSelected);
    const idsToDelete = selectedItems.map(item => item.id);

    this.multiDelete.emit({
      objectType: this.objectType,
      objectIds: idsToDelete,
      objectNames: selectedItems.map(s => s.name),
      userNames: selectedItems.map(s => s.userName)
    });

    this.pendingDeleteIds = idsToDelete;
  }

  viewHistory(row) {
    this.dataViewHistory.emit({ id: row.id, name: row.userName ? row.userName : row.name });
  }

  customActionClick(row) {
    this.customActionTrigger.emit({ id: row.id, name: row.userName ? row.userName : row.name });
  }

  start(row) {
    this.dataStart.emit({ id: row.id, name: row.userName ? row.userName : row.name });
  }

  stop(row) {
    this.dataStop.emit({ id: row.id, name: row.userName ? row.userName : row.name });
  }

  viewExecutionHistory(row) {
    this.dataViewExecutionHistory.emit({ id: row.id, name: row.userName ? row.userName : row.name });
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
        { hideCancelBtn: true, yesText: 'AbpAccount::Close'});
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
            try {
              this.importData = JSON.parse(data);
            } catch (error) {
              this.confirmationService.error('::LABEL_InvalidJsonFile', '', {
                hideCancelBtn: true,
                yesText: 'AbpAccount::Close',
              });
              return;
            }
          }
        } else {
          const workbook = read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          if (this.objectType === 'UserMenus') {
            this.importData = AppUtils.convertMenuData(utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true, defval: '' }));
          } else if(['StateModels', 'UserGroup', 'ShiftPatterns', 'UserQueries'] .includes(this.objectType)) {
            this.importData = AppUtils.convertExcelFileImportData(utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true, defval: '' }), this.objectType);
          } else {
            this.importData = utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true, defval: '' });
            if (this.objectType === 'Users') {
              this.importData = this.importData.map(item => { item.RoleNames = item.RoleNames.split(',').map(role => role.trim()); return item });
            }
          }
        }
        if (this.importData.length) {
          this.importFile();
        } else {
          this.toasterService.info('::NoDataAvailableInDatatable');
        }
      }
    } else {
      this.importData = [];
    }
  }

  importFile() {
    // convert json string value to json
    for (let data of this.importData) {
      for (let key in data) {
        try {
          if(key.startsWith('__EMPTY')){
            delete data[key];
            continue;
          }
          if (this.objectType !== 'SiteSettings') {
            data[key] = JSON.parse(data[key]);
          }
        } catch (e) { }
      }
      if (this.objectType === "Roles") {
        if (typeof data.Permissions === "string") {
          data.Permissions = data.Permissions.split(",").map((p: string) => p.trim());
        } else if (!Array.isArray(data.Permissions)) {
          data.Permissions = [];
        }
      }
    }

    // Split importData into chunks of 500 and emit each chunk separately
    const chunkSize = 500;
    for (let i = 0; i < this.importData.length; i += chunkSize) {
      const chunk = this.importData.slice(i, i + chunkSize);
      this.import.emit({ objectType: this.objectType, data: chunk, overridingMode: this.overridingMode });
    }
    this.importData = [];
  }
  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  performFunc(action: ColumnAction, data: any) {
    action.parent[action.func.name](data);
  }
  getPermission(permission: string) {
    if (permission)
      return this.permissionService.getGrantedPolicy(permission);
    else
      return true;
  }

  search(event: string) {
    event = event.trim();
    this.filterChange.emit(event)
  }

  move() {
    this.moveData.emit({ objectIds: this.selected.map(s => s.id) });
  }

  notify() {
    const selectedItems = Object.values(this.allSelected);
    if (selectedItems.length === 0) {
      return;
    }
    const idsToNotify = selectedItems.map(item => item.id);
    const namesToNotify = selectedItems.map(item => item.fullName);
    this.notifyData.emit({
      objectType: this.objectType,
      objectIds: idsToNotify,
      objectNames: namesToNotify
    });
    console.log('IDs to notify:', idsToNotify);
  }

  // pageChange(event) {
  //   this.pageSize = Number(event);
  // }

  getCheckboxClass() {
    if (this.selected.length > 0)
      return ''
    else
      return this.isTableHovered ? '' : 'd-none'
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSort() {
    this.isSorted = !this.isSorted;
    this.showAdvancendFilterText = !this.showAdvancendFilterText;
  }

  onSort(event: any) {
    // Get the sort field
    const column = this.columns.find(col => col.field === event.column.prop);
    const sortField = column && column.altField ? column.field : event.column.prop;

    // Set the query parameter directly
    if (!event.newValue) {
      // Clear the sort
      this.list['query'] = { ...this.list['query'], sorting: undefined };
    } else {
      // Set the sorting parameters
      this.list['query'] = {
        ...this.list['query'],
        sorting: `${sortField} ${event.newValue}`
      };
    }

    this.list.get();
  }

  clearSelection() {
    this.selected = [];
    this.allSelected = {};
  }

  checkAndRemovePendingDeleteIds() {
    if (this.pendingDeleteIds.length > 0) {
      const deleteIds = this.pendingDeleteIds;
      deleteIds.forEach(id => {
        delete this.allSelected[id];
      });
      this.selected = this.getSelectedItemsForCurrentPage();
      this.pendingDeleteIds = [];
    }
  }
}
