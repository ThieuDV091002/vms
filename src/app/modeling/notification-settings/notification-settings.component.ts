import { Component, OnInit } from '@angular/core';
import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ListService, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { ModelingBase } from '../modeling-base';
import { NotificationSettingService } from '@apis/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { CreateUpdateNotificationSettingDto, ExportNotificationDetailDto, NotificationDetailDto, NotificationSettingDto, NotificationSettingGetListInput } from '@apis/notification/dtos/notification-settings';
import { ApiDefinitionService } from 'src/app/shared/services/api-definition.service';
import { ApiNames } from 'src/app/shared/interfaces/api-definition';
import { ControllerActionDto } from 'src/app/shared/models/controller-action.model';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { UserGroupDto } from '@proxy/dtos/user-group';
import { ContentTemplateService } from '@apis/notification';
import { UserService } from '@proxy/services';
import { UserGroupService } from '@proxy';
import { ContentTemplateDto } from '@apis/notification/dtos/content-templates';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "NotificationSettingsComponent",
    },
  ]
})

export class NotificationSettingsComponent extends ModelingBase<NotificationSettingService, NotificationSettingGetListInput, CreateUpdateNotificationSettingDto>
  implements OnInit {
  currentNotificationSetting: NotificationSettingDto;
  isModalVisible: boolean;
  isHistoryModalVisible: boolean;
  data: PagedResultDto<NotificationSettingDto> = { items: [], totalCount: 0 };
  form: FormGroup;
  columns = [
    { displayKey: '::LABEL_Microservice', field: 'microservice' },
    { displayKey: '::LABEL_Object', field: 'object' },
    { displayKey: '::LABEL_Action', field: 'action' },
    { displayKey: '::LABEL_API', field: 'api' }
  ];
  info: string;
  isCollapse = false;
  microserviceSelectList = [
    { 'name': 'Permission', 'value': ApiNames.Permission },
    { 'name': 'Corporate', 'value': ApiNames.Corporate },
    { 'name': 'Dashboard', 'value': ApiNames.Dashboard },
    { 'name': 'General', 'value': ApiNames.General },
    { 'name': 'Ticket', 'value': ApiNames.Ticket },
    { 'name': 'Notification', 'value': ApiNames.Notification },
    { 'name': 'Scheduler', 'value': ApiNames.Scheduler }
  ];
  objectSelectList = [];
  actionSelectList = [];
  apiSelectList = [];
  allActions: ControllerActionDto[] = [];
  currentDetail: ExportNotificationDetailDto[];
  currentDetailUserList: IdentityUserDto[] = [];
  currentDetailUserGroupList: UserGroupDto[] = [];
  initContentTemplateList: ContentTemplateDto[]= [];
  initUserList: IdentityUserDto[]= [];
  initUserGroupList: UserGroupDto[]= [];

  constructor(
    public list: ListService<NotificationSettingGetListInput>,
    public service: NotificationSettingService,
    public fb: FormBuilder,
    public confirmationService: ConfirmationService,
    public toasterService: ToasterService,
    private localizationService: LocalizationService,
    private apiDefinitionService: ApiDefinitionService,
    private contentTemplateSerice : ContentTemplateService,
    private userService: UserService,
    private userGroupService: UserGroupService,
  ) {
    super(service, list, 'notification-setting');
  }

  ngOnInit(): void {
    this.hookToQuery();
    this.getModelingData();
    this.localizationService.get('::LABEL_NotificationSetting').subscribe(data => {
      this.info = data;
    });
  }

  private hookToQuery() {
    this.list
      .hookToQuery(query => this.service.getList(query))
      .subscribe(res => {
        this.data = res;
      });
  }

  private getModelingData() {
    this.contentTemplateSerice.getList({maxResultCount: 10}).subscribe(data => {
      this.initContentTemplateList = data.items;
    });
    this.userGroupService.getList({maxResultCount: 10, ids: []}).subscribe(data => {
      this.initUserGroupList = data.items;
    });
    this.userService.getUserList({maxResultCount: 10}).subscribe(data => {
      this.initUserList = data.items;
    })
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.currentNotificationSetting?.name || ''],
      displayName: [this.currentNotificationSetting?.displayName || ''],
      description: [this.currentNotificationSetting?.description || ''],
      microservice: [this.currentNotificationSetting?.microservice || '', Validators.required],
      object: [this.currentNotificationSetting?.object || '', Validators.required],
      action: [this.currentNotificationSetting?.action || '', Validators.required],
      api: [this.currentNotificationSetting?.api || '', Validators.required],
      topic: [this.currentNotificationSetting?.topic || ''],
      sender: [this.currentNotificationSetting?.sender || '', Validators.email],
      tenantId: [this.currentNotificationSetting.tenantId || ''],
      notificationDetails: [[], Validators.required],
    });
  }

  add() {
    this.currentNotificationSetting = {} as NotificationSettingDto;
    this.currentDetail = [];
    this.currentDetailUserList = [];
    this.currentDetailUserGroupList = [];
    this.resetSelectLists();
    this.buildForm();
    this.isModalVisible = true;
  }

  edit(row) {
    this.service.get(row.id).subscribe(data => {
      this.currentNotificationSetting = data;
      this.currentDetail = data.notificationDetails.map(detail => {
        return {
          mode: detail.mode,
          contentTemplate: detail.contentTemplate.id,
          recipientTypes: detail.recipientTypes.map(type => type.recipientTypeValue),
          recipientUserGroups: detail.recipientUserGroups.map(group => group.userGroupName),
          recipientUsers: detail.recipientUsers.map(user => user.userName)
        };
      });
      this.currentDetailUserList = data.notificationDetails
        .flatMap(detail => detail.recipientUsers as IdentityUserDto[])
        .filter((user, index, self) => self.findIndex(u => u.id === user.id) === index);
      this.currentDetailUserGroupList = data.notificationDetails.flatMap(detail =>
        detail.recipientUserGroups.map(group => ({ ...group, name: group.userGroupName })) as UserGroupDto[]
      );
      this.buildForm();
      const selectedMicroservice = this.microserviceSelectList.find(x => x.name === data.microservice)?.value;
      if (selectedMicroservice) {
        this.loadActions(selectedMicroservice, this.currentNotificationSetting.object);
      }
      this.isModalVisible = true;
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const request = this.currentNotificationSetting.id
      ? this.service.update(this.currentNotificationSetting.id, this.form.value)
      : this.service.create(this.form.value);

    request.subscribe(() => {
      const messageKey = this.currentNotificationSetting.id ? '::LABEL_UpdatedSuccessfully' : '::LABEL_CreatedSuccessfully';
      this.toasterService.success(messageKey, '', {
        messageLocalizationParams: [this.info, this.form.value.name],
      });
      this.isModalVisible = false;
      this.form.reset();
      this.list.get();
    });
  }

  delete(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.name],
      })
      .subscribe(status => {
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

  search(e) {
    this.list.filter = e.target.value;
  }

  onMicroserviceChange(event) {
    this.resetFormControls(['object', 'action', 'api']);
    if (event) {
      this.loadActions(event.value);
    } else {
      this.resetSelectLists();
    }
  }

  onObjectChange(selectedObject) {
    if(selectedObject) {
      this.updateSelectLists(selectedObject, 'Object');
    } else {
      this.resetFormControls(['action', 'api']);
      this.resetSelectLists(['object']);
    }
  }

  onActionChange(selectedAction) {
    if (selectedAction) {
      this.updateSelectLists(selectedAction, 'Action');
    } else {
      this.resetFormControls(['api']);
      this.updateSelectLists(this.form.controls['object'].value, 'Object');
    }
  }

  onApiChange(selectedApi) {
    if (selectedApi) {
      this.form.controls['name'].setValue(selectedApi);
      this.form.controls['displayName'].setValue(selectedApi);
      this.form.controls['action'].setValue(this.allActions.find(action => action.API === selectedApi)?.Action);
      this.updateSelectLists(selectedApi, 'API');
    } else {
      this.resetFormControls(['action']);
      this.updateSelectLists(this.form.controls['object'].value, 'Object');
    }
  }

  private resetFormControls(controls: string[]) {
    controls.forEach(control => this.form.controls[control].setValue(''));
  }

  private resetSelectLists(exclude: string[] = []) {
    if (!exclude.includes('object')) this.objectSelectList = [];
    if (!exclude.includes('action')) this.actionSelectList = [];
    if (!exclude.includes('api')) this.apiSelectList = [];
  }

  private loadActions(microservice: ApiNames, object: string = '') {
    const filterAppModule = microservice !== ApiNames.Permission;
    this.apiDefinitionService.getControllerAction(microservice, {}, filterAppModule).subscribe(actions => {
      this.allActions = actions;
      this.updateSelectLists(object, 'Object');
    });
  }

  private updateSelectLists(selectedValue: string, type: 'Object' | 'Action' | 'API') {
    const filteredActions = this.allActions.filter(action => action[type] === selectedValue);
    if (type === 'Object') {
      this.objectSelectList = [...new Set(this.allActions.map(action => action.Object))];
      this.apiSelectList = [...new Set(filteredActions.map(action => action.API))];
      this.actionSelectList = [...new Set(filteredActions.map(action => action.Action))];
    } else if (type === 'Action') {
      this.apiSelectList = filteredActions.filter(action => action.Object === this.form.controls["object"].value).map(action => action.API);
    } else if (type === 'API') {
      this.actionSelectList = [...new Set(filteredActions.map(action => action.Action))];
    }
  }

  saveDetail(detail) {
    this.form.controls['notificationDetails'].setValue(detail);
  }
}
