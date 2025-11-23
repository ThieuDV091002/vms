import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { FileService } from '../../dashboard/services/file.service';
import { finalize } from 'rxjs';

// Mock data - replace with actual constants or services
const MOCK_AREAS = [
  { id: '1', name: 'Area 1', displayName: 'Area 1' },
  { id: '2', name: 'Area 2', displayName: 'Area 2' },
  { id: '3', name: 'Area 3', displayName: 'Area 3' }
];

const MOCK_CELLS = [
  { id: '1', name: 'Cell 1', displayName: 'Cell 1', areaId: '1' },
  { id: '2', name: 'Cell 2', displayName: 'Cell 2', areaId: '1' },
  { id: '3', name: 'Cell 3', displayName: 'Cell 3', areaId: '2' },
  { id: '4', name: 'Cell 4', displayName: 'Cell 4', areaId: '2' },
  { id: '5', name: 'Cell 5', displayName: 'Cell 5', areaId: '3' }
];

const MOCK_USERS = [
  { id: '1', name: 'User 1', displayName: 'User 1' },
  { id: '2', name: 'User 2', displayName: 'User 2' },
  { id: '3', name: 'User 3', displayName: 'User 3' },
  { id: '4', name: 'User 4', displayName: 'User 4' }
];

export interface ApprovalListItem {
  order: number;
  userId: string;
}

export interface RowItem {
  title: string;
  subtitle: string;
  type: 'text' | 'okng';
  images?: any[];
}

@Component({
  selector: 'app-checksheet-template',
  templateUrl: './checksheet-template.component.html',
  styleUrl: './checksheet-template.component.css hoặc .scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'ChecksheetTemplateComponent',
    },
  ],
})
export class ChecksheetTemplateComponent implements OnInit {
  selected: any;
  isModalVisible: boolean;
  isViewModalVisible: boolean;
  viewSelected: any;
  
  // Data for 4 tables
  data1: PagedResultDto<any> = { items: [], totalCount: 0 };
  data2: PagedResultDto<any> = { items: [], totalCount: 0 };
  data3: PagedResultDto<any> = { items: [], totalCount: 0 };
  data4: PagedResultDto<any> = { items: [], totalCount: 0 };
  
  // List services for 4 tables - using the same list service for now
  // In production, you may want to create separate providers for each table
  list1: ListService<any>;
  list2: ListService<any>;
  list3: ListService<any>;
  list4: ListService<any>;
  
  form: FormGroup;
  columns = [
    { displayKey: '::Name', field: 'name' },
  ];
  info: string;
  isCollapse = false;
  isViewCollapse = false;
  comment: string = '';

  // Constants for dropdowns
  areas = MOCK_AREAS;
  cells = MOCK_CELLS;
  users = MOCK_USERS;

  // Filtered cells based on selected area
  filteredCells: any[] = [];

  // Image map for view modal
  imageMap = new Map<string, string>();

  constructor(
    public list: ListService<any>,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
    private fileService: FileService
  ) {
    // Initialize list services - for now using the same instance
    // In production with APIs, you may want to create separate ListService instances
    // or use different query parameters/filters for each table
    this.list1 = this.list;
    this.list2 = this.list;
    this.list3 = this.list;
    this.list4 = this.list;
    // Note: This component doesn't extend ModelingBase since there's no service yet
    // When API is ready, extend ModelingBase similar to StateModelsComponent
  }

  ngOnInit(): void {
    this.localizationService.get('::ChecksheetTemplate').subscribe(data => {
      this.info = data;
    });
    // Initialize data for all 4 tables
    this.initializeTableData();
  }

  initializeTableData() {
    // Mock data initialization for 4 tables
    // In real implementation, these would be separate API calls
    this.data1 = { items: [], totalCount: 0 };
    this.data2 = { items: [], totalCount: 0 };
    this.data3 = { items: [], totalCount: 0 };
    this.data4 = { items: [], totalCount: 0 };
    
    // Hook each list service to query (when API is ready)
    // For now, just initialize empty data
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      areaId: [this.selected?.areaId || '', Validators.required],
      cellId: [this.selected?.cellId || '', Validators.required],
      approvalList: [this.selected?.approvalList || []],
      rows: [this.selected?.rows || []],
      comment: ['']
    });

    // Watch for area changes to filter cells
    this.form.get('areaId').valueChanges.subscribe(areaId => {
      if (areaId) {
        this.filteredCells = this.cells.filter(cell => cell.areaId === areaId);
      } else {
        this.filteredCells = [];
      }
      // Reset cell selection if area changes
      if (this.form.get('cellId').value) {
        const currentCell = this.cells.find(c => c.id === this.form.get('cellId').value);
        if (!currentCell || currentCell.areaId !== areaId) {
          this.form.get('cellId').setValue('');
        }
      }
    });

    // Initialize filtered cells if area is already selected
    if (this.form.get('areaId').value) {
      this.filteredCells = this.cells.filter(cell => cell.areaId === this.form.get('areaId').value);
    }
  }

  add() {
    this.selected = {};
    this.buildForm();
    this.isModalVisible = true;
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    // API call will be implemented later
    console.log('Form value:', this.form.value);
    this.toasterService.success('::LABEL_SavedSuccessfully');
    this.isModalVisible = false;
    this.form.reset();
  }

  edit(row) {
    // API call will be implemented later
    this.selected = row;
    this.buildForm();
    this.isModalVisible = true;
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          // API call will be implemented later
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, row.name],
          });
        }
      });
  }

  multiDelete(e) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info + '<br/>', e.objectNames.join(',<br/>')],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          // API call will be implemented later
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, e.objectNames],
          });
        }
      });
  }

  updateApprovalList(approvalList: ApprovalListItem[]) {
    this.form.controls['approvalList'].setValue(approvalList);
  }

  updateRows(rows: RowItem[]) {
    this.form.controls['rows'].setValue(rows);
  }

  view(row) {
    // API call will be implemented later
    // For now, use mock data
    this.viewSelected = { ...row };
    this.comment = '';
    this.imageMap.clear();
    this.loadRowImages();
    this.isViewModalVisible = true;
  }

  loadRowImages() {
    if (!this.viewSelected?.rows) return;
    
    this.viewSelected.rows.forEach((row: RowItem) => {
      if (row.type === 'okng' && row.images) {
        row.images.forEach(image => {
          if (image.fileId && !this.imageMap.has(image.fileId)) {
            this.fileService.get(image.fileId).subscribe({
              next: (res: any) => {
                let imageUrl;
                if (typeof res === 'string') {
                  imageUrl = 'data:image/jpeg;base64,' + res;
                } else {
                  const blob = this.convertBase64ToBlob(res, 'image/jpeg');
                  imageUrl = URL.createObjectURL(blob);
                }
                this.imageMap.set(image.fileId, imageUrl);
                // Update the image object with the URL
                if (image) {
                  image.url = imageUrl;
                }
              },
              error: (err) => {
                console.error('Error loading image:', err);
              }
            });
          } else if (image.fileId && this.imageMap.has(image.fileId)) {
            image.url = this.imageMap.get(image.fileId);
          }
        });
      }
    });
  }

  convertBase64ToBlob(base64Data: string, contentType: string = 'application/octet-stream'): Blob {
    const sliceSize = 512;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  getAreaName(areaId: string): string {
    const area = this.areas.find(a => a.id === areaId);
    return area ? area.displayName : areaId;
  }

  getCellName(cellId: string): string {
    const cell = this.cells.find(c => c.id === cellId);
    return cell ? cell.displayName : cellId;
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.displayName : userId;
  }

  getImageUrl(image: any): string {
    if (image.url) return image.url;
    if (image.fileId && this.imageMap.has(image.fileId)) {
      return this.imageMap.get(image.fileId);
    }
    return '';
  }

  previewImage(url: string) {
    // Open image in new window or modal
    window.open(url, '_blank');
  }

  getSortedApprovalList(): ApprovalListItem[] {
    if (!this.viewSelected?.approvalList) return [];
    return [...this.viewSelected.approvalList].sort((a, b) => a.order - b.order);
  }

  // Methods for each table
  addTable1() {
    this.add();
  }

  editTable1(row) {
    this.edit(row);
  }

  deleteTable1(row) {
    this.delete(row);
  }

  viewTable1(row) {
    this.view(row);
  }

  addTable2() {
    this.add();
  }

  editTable2(row) {
    this.edit(row);
  }

  deleteTable2(row) {
    this.delete(row);
  }

  viewTable2(row) {
    this.view(row);
  }

  addTable3() {
    this.add();
  }

  editTable3(row) {
    this.edit(row);
  }

  deleteTable3(row) {
    this.delete(row);
  }

  viewTable3(row) {
    this.view(row);
  }

  addTable4() {
    this.add();
  }

  editTable4(row) {
    this.edit(row);
  }

  deleteTable4(row) {
    this.delete(row);
  }

  viewTable4(row) {
    this.view(row);
  }

  multiDeleteTable1(e) {
    this.multiDelete(e);
  }

  multiDeleteTable2(e) {
    this.multiDelete(e);
  }

  multiDeleteTable3(e) {
    this.multiDelete(e);
  }

  multiDeleteTable4(e) {
    this.multiDelete(e);
  }
}
