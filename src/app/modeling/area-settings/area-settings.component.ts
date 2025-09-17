import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { AreaDto } from '@apis/ticket/dtos';
import { LocalizationService } from '@abp/ng.core';
import { AreaSettingService } from '@apis/general/production-review';
import { AreaSettingDto, AreaSettingGetListInput, CreateUpdateAreaSettingDto } from '@apis/general/production-review/dtos';
import { debounceTime, Subject } from 'rxjs';
import { AreaService } from '@apis/corporate';
@Component({
  selector: 'app-area-settings',
  templateUrl: './area-settings.component.html',
  styleUrl: './area-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'AreaSettingsComponent',
    },
  ],
})
export class AreaSettingsComponent
  extends ModelingBase<AreaSettingService, AreaSettingGetListInput, CreateUpdateAreaSettingDto>
  implements OnInit
{
  selected: AreaSettingDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<AreaSettingDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::Area', field: 'name'},
  ];
  info: string;
  areaInput$ = new Subject<string | null>();
  debounceTime = 500;
  areas: AreaDto[] = [];
  selectedArea: AreaDto;
  inputNumberErrorType = '';
  isCollapse = false;
  tenantInfo: any;
  kpiReviewTypeOptions = [
    { value: 'MachineFocus', label: '::LABEL_MachineFocus' },
    { value: 'LaborFocus', label: '::LABEL_LaborFocus' },
  ];
  isMachineFocus = true;

  constructor(
    public list: ListService<AreaSettingGetListInput>,
    public service: AreaSettingService,
    public areaService: AreaService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
  ) {
    super(service, list, 'area-setting');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::LABEL_AreaSetting').subscribe(data => {
      this.info = data});
    this.areaInput$
    .pipe(debounceTime(this.debounceTime))
    .subscribe((searchItem) => {
        this.getAreas(searchItem);
    })
  }

  getAreas(searchItem = '', ids = []) {
    this.areaService
      .getList({
        ids: ids,
        name: searchItem,
        maxResultCount: 10,
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      })
      .subscribe(data => {
        // const filteredAreas = this.areas.filter(area => !data.items.some(item => item.id === area.id));
        // this.areas = [ ...data.items, ...filteredAreas];
        this.areas = data.items;
      });
  }

 areaChange(e) {
  if (e) {
    this.selectedArea = e;
    this.form.patchValue({
      name: e.displayName,     
      areaName: e.displayName   
    });
  }
}

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
        // const ids = this.data.items.map(x => x.areaId);
        this.data.items.forEach(x => {
          x.areaName = x.name;
        })
        // this.areaService.getList({ ids: ids, maxResultCount: 10 }).subscribe(data => {
        //   // set area name

        // });
      });
  }


  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || ''],
      areaName: [this.selected?.areaName || ''],
      areaId: [this.selected?.areaId || null, Validators.required],
      yearlyInternalQNsTarget: [this.selected.yearlyInternalQNsTarget || 0, Validators.required],
      kpiReviewType: [this.selected.kpiReviewType || 'MachineFocus', Validators.required],
      yearlyExternalQNsTarget: [this.selected?.yearlyExternalQNsTarget || 0, Validators.required],
      unsafeConditionTarget: [this.selected?.unsafeConditionTarget || 0, Validators.required],
      planActualDiffTol: [this.selected?.planActualDiffTol || 0, Validators.required],
      fpyTargetTol: [this.selected?.fpyTargetTol || 0, Validators.required],
      sppmTargetTol: [this.selected?.sppmTargetTol || 0, Validators.required],
      machineCOPQTarget: [this.selected?.machineCOPQTarget || 0],
      machineCOPQTargetTol: [this.selected?.machineCOPQTargetTol || 0],
      poeeTarget: [this.selected?.poeeTarget || 0],
      poeeTargetTol: [this.selected?.poeeTargetTol || 0],
      performanceTargetTol: [this.selected?.performanceTargetTol || 0],
      udtTargetTol: [this.selected?.udtTargetTol || 0],
      laborCOPQTarget: [this.selected?.laborCOPQTarget || 0],
      laborCOPQTargetTol: [this.selected?.laborCOPQTargetTol || 0],
      oleTarget: [this.selected?.oleTarget || 0],
      oleTargetTol: [this.selected?.oleTargetTol || 0],
      upphTargetTol: [this.selected?.upphTargetTol || 0],
      costCenter: [this.selected?.costCenter || ''],
      tenantId: [this.selected?.tenantId || null],
    });

    if (this.form.controls['kpiReviewType'].value === 'MachineFocus') {
      this.isMachineFocus = true;
    } else {
      this.isMachineFocus = false;
    }

    this.form.controls['kpiReviewType'].valueChanges.subscribe(value => {
      if (value === 'MachineFocus') {
        this.isMachineFocus = true;
        // this.form.patchValue({
        //   laborCOPQTarget: 0,
        //   laborCOPQTargetTol: 0,
        //   oleTarget: 0,
        //   oleTargetTol: 0,
        //   upphTargetTol: 0
        // });
      } else {
        this.isMachineFocus = false;
        // this.form.patchValue({
        //   machineCOPQTarget: 0,
        //   machineCOPQTargetTol: 0,
        //   poeeTarget: 0,
        //   poeeTargetTol: 0,
        //   performanceTargetTol: 0,
        //   udtTargetTol: 0
        // });
      }
    });
  }


  add() {
    this.getDependentData();
    this.selected = {} as AreaSettingDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  getDependentData() {
    this.getAreas();
  }

  save() {
    if (this.form.invalid) {
      return;
    }
    this.areaService.get(this.form.value.areaId).subscribe(area => {
      const formData = {
        ...this.form.value,
        name: area?.displayName,
        areaName: area?.displayName || '',
        displayName: area?.displayName
      };

      const request = this.selected.id
        ? this.service.update(this.selected.id, formData)
        : this.service.create(formData);

      request.subscribe((response) => {
        if (!this.selected.id) {
          this.toasterService.success('::LABEL_CreatedSuccessfully','',{
            messageLocalizationParams: [this.info,area.displayName],
          });
        }
        else{
          this.toasterService.success('::LABEL_UpdatedSuccessfully','',{
            messageLocalizationParams: [this.info,this.selected.displayName],
          });
        }
        this.isModalVisible = false;
        this.form.reset();
        this.list.get();
      });
    });
  }

  copyModalOpen(event: any) {
    this.getAreas();
  }

  copySetting(e) {
    const info = this.removeLastS(e.objectType);
    this.areaService.get(e.data.areaId).subscribe(area => {
      const copyData = {
        ...e.data,
        areaName: area?.displayName,
        name: area?.displayName,
        displayName: area?.displayName
      };

      this.service.create(copyData).subscribe(res => {
        this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
          messageLocalizationParams: [info, res.displayName],
        });
        this.list.get();
        this.edit(res);
      });
    });
  }

  edit(row) {
    this.getDependentData();
    this.service.get(row.id).subscribe(data => {
      this.selected = data;
      this.getAreas('', [data.areaId]);
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info,row.name],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.delete(row.id).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted','',{
              messageLocalizationParams: [this.info,row.name],
            });
            this.list.get();
          });
        }
      });
  }

  onInputLimit(event: any) {
  const input = event.target;
  let value = Number(input.value);
  if (value > 100) value = 100;
  if (value < 0) value = 0;
  if (input.value !== value.toString()) {
    input.value = value;
    const formControlName = input.getAttribute('formControlName');
    if (formControlName && this.form && this.form.get(formControlName)) {
      this.form.get(formControlName).setValue(value, { emitEvent: false });
    }
  }
}
}
