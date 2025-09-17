import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ModelingBase } from '../modeling-base';
import { LocalizationService } from '@abp/ng.core';
import { UserQueryService } from '@proxy';
import { CreateUpdateUserQueryDto, CreateUpdateUserQueryParameterDto, UserQueryDto, UserQueryGetListInput } from '@proxy/dtos/user-query';

@Component({
  selector: 'app-user-queries',
  templateUrl: './user-queries.component.html',
  styleUrls: ['./user-queries.component.scss'],
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'UserQueriesComponent',
    },
  ],
})

export class UserQueriesComponent extends ModelingBase<UserQueryService, UserQueryGetListInput, CreateUpdateUserQueryDto> implements OnInit {
  displayName: string = 'UserQuery';
  selected: UserQueryDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<UserQueryDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  editing = {};
  columns = [
    { displayKey: '::Name', field: 'name' },
  ];
  info: string;

  constructor(
    public list: ListService<UserQueryGetListInput>,
    public service: UserQueryService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private session: SessionStateService,
    private localizationService: LocalizationService
  ) {
    super(service, list, 'user-query');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.localizationService.get('::UserQuery').subscribe(data => {
      this.info = data
    });
  }

  private hookToQuery() {
    this.list.hookToQuery(query => this.service.getList(query)).subscribe(res => {
      this.data = res;
    });
  }

  add() {
    this.selected = {} as UserQueryDto;
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row) {
    this.service.get(row.id).subscribe((data) => {
      this.selected = data;
      this.buildForm();
      this.isModalVisible = true;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.selected?.name || '', Validators.required],
      queryText: [this.selected?.queryText || '', Validators.required],
      displayName: [this.selected?.displayName || ''],
      tenantId: [this.selected?.tenantId || ''],
      parameters: this.fb.array(
        (this.selected?.parameters || []).map(param => this.createParameterFormGroup({
          name: param.name || '',
          valueType: param.valueType || 0,
          defaultValue: param.defaultValue || ''
        } as CreateUpdateUserQueryParameterDto))
      ),
    });
  }

  createParameterFormGroup(parameter: CreateUpdateUserQueryParameterDto): FormGroup {
    return this.fb.group({
      name: [parameter.name || '', Validators.required],
      valueType: [parameter.valueType || 0, Validators.required],
      defaultValue: [parameter.defaultValue || '']
    });
  }

  delete(row) {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.info,row.name],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service.delete(row.id).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [this.info, row.name],
          });
          this.list.get();
        });
      }
    });
  }

  sort(data: any) {
    const { prop, dir } = data.sorts[0];
    this.list.sortKey = prop;
    this.list.sortOrder = dir;
  }

  search(e) {
    this.list.filter = e.target.value;
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.test().then(isValid => {
      if (!isValid) {
        return;
      }
      this.form.patchValue({ displayName: this.form.value.name });
      const request = this.selected.id
        ? this.service.update(this.selected.id, this.form.value)
        : this.service.create(this.form.value);
      request.subscribe(() => {
        if (!this.selected.id) {
          this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
            messageLocalizationParams: [this.info, this.form.value.name],
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
    });
  }

  test(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.form.valid) {
        const input: CreateUpdateUserQueryDto = this.form.value;
        this.service.validateSql(input).subscribe({
          next: (result) => {
            console.log(result)
            this.toasterService.success('::InvalidSqlStatement');
            resolve(true);
          },
          error: (error) => {
            console.log(error);
            this.toasterService.error('::ValidSqlStatement');
            resolve(false);
          }
        });
      }
    });
  }


  extractParameters() {
    const queryText = this.form.get('queryText').value;
    const paramPattern = /:(\w+)/g;
    const parameters = [];
    let match;

    console.log('this.selected?.parameters:', this.selected?.parameters);

    const existingParameters = this.selected?.parameters || [];

    while ((match = paramPattern.exec(queryText)) !== null) {
      const paramName = match[1];
      const existingParam = existingParameters.find(param => param.name === paramName);

      if (existingParam) {
        parameters.push({
          name: existingParam.name,
          valueType: existingParam.valueType,
          defaultValue: existingParam.defaultValue
        });
      } else {
        parameters.push({
          name: paramName,
          valueType: 0,
          defaultValue: 'default'
        });
      }
    }

    const paramFormArray = this.form.get('parameters') as FormArray;
    paramFormArray.clear();
    parameters.forEach(param => {
      paramFormArray.push(this.createParameterFormGroup(param));
    });
  }

  editType(rowIndex: number) {
    this.editing[rowIndex + '-valueType'] = true;
  }

  saveType(rowIndex: number, value: string) {
    this.editing[rowIndex + '-valueType'] = false;
    const parameters = this.form.get('parameters') as FormArray;
    const parameter = parameters.at(rowIndex) as FormGroup;
    parameter.get('valueType').setValue(parseInt(value));
    if (parseInt(value) === 1) {
      parameter.get('defaultValue').setValue('0');
    }
  }

  editValue(rowIndex: number) {
    this.editing[rowIndex + '-defaultValue'] = true;
  }

  saveValue(rowIndex: number, value: string) {
    this.editing[rowIndex + '-defaultValue'] = false;
    const parameters = this.form.get('parameters') as FormArray;
    const parameter = parameters.at(rowIndex) as FormGroup;
    parameter.get('defaultValue').setValue(value);
  }

  // import(e) {
  //   const createUpdateUserQuery: CreateUpdateUserQueryDto[] = e.data;
  //   this.service.importByDtosAndMode(createUpdateUserQuery, e.overridingMode).subscribe((res) => {
  //     this.toasterService.success('::LABEL_SuccessfullyImported');
  //     this.list.get();
  //   });
  // }

  copy(e) {
    console.log(e);
    this.service['create'](e.data).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [this.info, e.data.name],
      });
      this.list.get();
      this.edit(res);
    });
  }
}


