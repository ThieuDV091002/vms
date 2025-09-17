import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import { ConfigStateService, CurrentUserDto, ListService, PagedResultDto, SessionStateService } from '@abp/ng.core';
import { IdentityRoleDto, IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { LocalizationService } from '@abp/ng.core';
import { LinkCategoryDto } from '@apis/general/links/dtos';
import { ShiftDto } from '@apis/general/dtos';
import { ToDoListSetupDto } from '@apis/ticket/to-do-setups/dtos';
import { ActivityCardDto, StateDto } from '@apis/ticket/dtos';
import { ShiftService } from '@apis/general';
import { UserService } from '@proxy/services';
import { ToDoListSetupService, ToDoTypeService } from '@apis/ticket/to-do-setups';
import { ActivityCardService, StateService } from '@apis/ticket';
import { ToDoTaskDto } from '@apis/ticket/to-do-tasks/dtos';
import { StandardService } from '@apis/general/services/widget';
import { StandardDto } from '@apis/general/dtos/widget';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { ToDoTaskService } from '@apis/ticket/to-do-tasks';

@Component({
  selector: 'app-todo-list-manage-widget',
  templateUrl: './todo-list-manage-widget.component.html',
  styleUrl: './todo-list-manage-widget.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: "TodoListManageWidgetComponent"
    }
  ]
})

export class TodoListManageWidgetComponent implements OnInit, OnChanges, AfterViewInit {
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() index = -1;
  @Input() selectedWidget: any;
  @Input() expandChart = false;
  @Input() queryId;
  @Input() selectedDataTier;
  @Input() assignedAndDefaultDataTiers;
  isSettingsModalVisible = false;
  pageSize: number;
  widgetTitle: string;
  form: FormGroup;
  data: PagedResultDto<ToDoTaskDto> = { totalCount: 0, items: [] };
  searchKeyword = '';
  @ViewChild('myTable') table: DatatableComponent;
  isModalVisible = false;
  modalBusy = false;
  linkCategoriesData: LinkCategoryDto[];
  roleData: IdentityRoleDto[];
  selectedRoles = [];
  widgetInfo: string;
  assigneeInfo: string;
  isAssignUserModalOpen: boolean = false;
  isCancelConfirmationModalOpen: boolean = false;
  isViewStandardsModalOpen: boolean = false;
  isViewLinksModalOpen: boolean = false;
  showAdvancedFilter: boolean = false;
  filterSearchHasValue: boolean = false;
  quickFilterMyTodoListHasValue: boolean = false;
  selected: ToDoTaskDto[] = [];
  shiftList: ShiftDto[] = [];
  userList: any[] = [];
  initUserList: any[] = [];
  todoListSetupList: ToDoListSetupDto[] = [];
  stateList: StateDto[] = [];
  selectedShift: string[] = [];
  selectedUser: string[] = [];
  selectedTodoListSetup: string[] = [];
  selectedState: string[] = [];
  assigneeUserRows: Array<{ assignUserId: string; expiryDateAndTime: Date }> = [];
  viewStandardsData: any;
  currentIndex = 0;
  selectedLayout = '1x1';
  currentTodoData: ToDoTaskDto;
  isAddEditCommentModalOpen: boolean;
  isAddEditCardModalOpen: boolean;
  card: ActivityCardDto;
  editorConfig = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['code-block'],
      ['clean'],
    ]
  }
  comment: string;
  initComment: string;
  currentUser: CurrentUserDto;
  dataTier = {
    workCenters: [],
    cells: [],
    areas: []
  };
  currentStandardViewDto: StandardDto;
  isCheckBoxShown: boolean = false;
  input$ = new Subject<string | null>();
  userSubscription: Subscription;
  refreshSignal: boolean = false;
  taskDateFrom: Date;
  taskDateTo: Date;
  taskDateFromString: string;
  taskDateToString: string;
  isChangeToIncompleteShouldCommentModalOpen: boolean = false;
  wantToIncompleteTaskId: string = "";
  searchTaskFilter: string;
  language: string

  constructor(
    private confirmation: ConfirmationService,
    private toasterService: ToasterService,
    private service: ToDoTaskService,
    private todoTypeSerice: ToDoTypeService,
    public list: ListService<ToDoTaskService>,
    private localizationService: LocalizationService,
    private shiftService: ShiftService,
    private userService: UserService,
    private todoListSetupService: ToDoListSetupService,
    private stateService: StateService,
    private configService: ConfigStateService,
    private standardService: StandardService,
    private cardService: ActivityCardService,
    private cdr: ChangeDetectorRef,
    private session: SessionStateService,
    private datePipe: DatePipe
  ) {
    this.currentUser = this.configService.getOne('currentUser');
    this.language = session.getLanguage();
  }

  ngOnInit(): void {
    this.getPageData();
    this.getLocalizationData();
    this.input$.subscribe(newTerm => {
      this.getUserData(newTerm);
    });
    this.initComment = "";
    const today = new Date();
    this.taskDateFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    this.taskDateTo = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    this.taskDateFromString = this.taskDateFrom.toISOString();
    this.taskDateToString = this.taskDateTo.toISOString();
  }

  getPageData() {
    forkJoin({
      shiftList: this.shiftService.getAllInstances(),
      userList: this.userService.getUserList({ filter: this.searchKeyword, maxResultCount: 10 }),
      todoListSetupList: this.todoListSetupService.getAllInstances(),
      stateList: this.stateService.getAllInstances()
    }).subscribe(({ shiftList, userList, todoListSetupList, stateList }) => {
      this.shiftList = shiftList;
      this.userList = userList.items;
      this.initUserList = userList.items;
      this.todoListSetupList = todoListSetupList;
      this.stateList = stateList;
      this.selectedState = stateList.filter(x => x.name === 'New').map(x => x.id);
      this.filterSearchHasValue = this.selectedShift.length > 0 || this.selectedUser.length > 0 || this.selectedTodoListSetup.length > 0 || this.selectedState.length > 0;
      this.hookToQuery();
    });
  }

  getLocalizationData() {
    forkJoin({
      widgetInfo: this.localizationService.get('::LABEL_ToDoList'),
      assigneeInfo: this.localizationService.get('::LABEL_AssignedUsers')
    }).subscribe(({ widgetInfo, assigneeInfo }) => {
      this.widgetInfo = widgetInfo;
      this.assigneeInfo = assigneeInfo;
    });
  }

  hookToQuery() {
    this.list.hookToQuery(query => {
      return this.service.searchTaskByFilterByInput({
        ...query,
        areaIds: this.dataTier.areas,
        cellIds: this.dataTier.cells,
        workCenterIds: this.dataTier.workCenters,
        filter: this.searchTaskFilter,
        shiftIds: this.selectedShift,
        toDoListSetupIds: this.selectedTodoListSetup,
        assigneeIds: this.selectedUser,
        statusIds: this.selectedState,
        skipCount: this.table.offset * this.pageSize,
        maxResultCount: this.pageSize,
        taskDateFrom: this.taskDateFromString,
        taskDateTo: this.taskDateToString
      })
    }).subscribe(res => {
      res.items.forEach(item => {
        if (item.taskDate) {
          item.taskDate = this.formatDate(item.taskDate);
        }
        if (item.expiryDate) {
          item.expiryDate = this.formatDate(item.expiryDate);
        }
      });
      this.data = res;
    });
  }
  
  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  onTaskDateFromChange(newDate: Date): void {
    this.taskDateFromString = newDate ? newDate.toISOString() : null;
  }

  onTaskDateToChange(newDate: Date): void {
    this.taskDateToString = newDate ? newDate.toISOString() : null;
  }

  getUserData(name?) {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.userSubscription = this.userService.getUserList({ maxResultCount: 20, filter: name }).subscribe((res) => {
      this.userList = [];
      res.items.forEach(user => {
        if (user.name !== null) {
          this.userList.push({
            id: user.id,
            name: user.name
          });
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedWidget && changes.selectedWidget.currentValue) {
      this.pageSize = Number(this.selectedWidget.extraProperties.pageSize);
      this.widgetTitle = this.selectedWidget.name;
      this.list.get();
    }

    if (changes.selectedDataTier && changes.selectedDataTier.currentValue) {
      this.dataTier = {
        workCenters: [],
        cells: [],
        areas: []
      };
      const selectedDataTier = changes.selectedDataTier.currentValue;
      if (selectedDataTier.workCenters?.length > 0) {
        this.dataTier.workCenters = selectedDataTier.workCenters.map(x => x.id);
      } else if (selectedDataTier.cells?.length > 0) {
        this.dataTier.cells = selectedDataTier.cells.map(x => x.id);
      } else if (selectedDataTier.areas?.length > 0) {
        this.dataTier.areas = selectedDataTier.areas.map(x => x.id);
      }
      this.list.get();
    }
  }

  ngAfterViewInit(): void {
    this.table.limit = this.pageSize;
  }

  searchTodoTask(filter) {
    this.searchTaskFilter = filter;
    this.list.get();
  }

  assignUser() {
    if (this.selected.length === 0) {
      this.toasterService.warn(this.localizationService.instant('::LABEL_PleaseSelectAtLeastOneTodo'));
      return;
    }
    this.assigneeUserRows = [];
    this.isAssignUserModalOpen = true;
  }

  addAssigneeUserRows() {
    this.assigneeUserRows = [
      ...this.assigneeUserRows,
      { assignUserId: '', expiryDateAndTime: new Date('Thu Dec 31 2099 00:00:00') }
    ];
    this.userList = this.initUserList;
  }

  assignUserSave() {
    const nonEmptyAssigneeUserRows = this.assigneeUserRows.filter(row => row.assignUserId && row.expiryDateAndTime);
    this.service.assignUsersToTasksByInput({
      taskIds: this.selected.map(item => item.id),
      users: nonEmptyAssigneeUserRows.map(row => {
        return {
          userId: row.assignUserId,
          expiryDate: row.expiryDateAndTime.toISOString()
        }
      })
    }).subscribe(res => {
      this.isAssignUserModalOpen = false;
      if (res.status) {
        this.toasterService.success('::LABEL_TaskAssigneeUserSuccessfully', '');
      } else {
        this.toasterService.error('::LABEL_Error', '', {
          messageLocalizationParams: [res.message],
        });
      }
      this.list.get();
      this.assigneeUserRows = [];
      this.selected = [];
    });
  }

  setStatusCancelled() {
    if (this.selected.length === 0) {
      this.toasterService.warn(this.localizationService.instant('::LABEL_PleaseSelectAtLeastOneTodo'));
      return;
    }

    const alreadyCancelled = this.selected.some(task => task.currentStatusName === 'Cancelled');
    if (alreadyCancelled) {
      this.toasterService.error(this.localizationService.instant('::LABEL_AlreadyCancelledError'));
      return;
    }

    const message = this.selected.length > 1
      ? this.localizationService.instant('::LABEL_CancelConfirmationMessagePlural')
      : this.localizationService.instant('::LABEL_CancelConfirmationMessage');

    this.confirmation.warn(message, 'AbpUi::AreYouSure')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.updateTodoStatusToCancel();
        }
      });
  }

  updateTodoStatusToCancel() {
    var taskIds = this.selected.map(x => x.id);
    this.service.cancelTaskByIdsByIds(taskIds).subscribe(res => {
      this.selected = [];
      this.toasterService.success(this.localizationService.instant('::LABEL_TodoCancelledSuccessfully'));
      this.list.get();
    });
  }

  cancelCurrentTask(task) {
    this.confirmation.warn('::LABEL_CancelConfirmationMessage', 'AbpUi::AreYouSure')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.cancelTaskByIdsByIds([task.id]).subscribe(_ => {
            this.toasterService.success(this.localizationService.instant('::LABEL_TodoCancelledSuccessfully'));
            this.list.get();
          });
        }
      });
  }

  restoreTask() {
    if (this.selected.length === 0) {
      this.toasterService.warn(this.localizationService.instant('::LABEL_PleaseSelectAtLeastOneTodo'));
      return;
    }

    const notCancelled = this.selected.some(task => task.currentStatusName !== 'Cancelled');
    if (notCancelled) {
      this.toasterService.error(this.localizationService.instant('::LABEL_NotCancelledError'));
      return;
    }

    const message = this.selected.length > 1
      ? this.localizationService.instant('::LABEL_RestoreConfirmationMessagePlural')
      : this.localizationService.instant('::LABEL_RestoreConfirmationMessage');

    this.confirmation.warn(message, 'AbpUi::AreYouSure')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.restoreSelectedTasks();
        }
      });
  }

  restoreSelectedTasks() {
    const taskIds = this.selected.map(task => task.id);
    this.service.restoreTaskByIdsByIds(taskIds).subscribe(() => {
      this.selected = [];
      this.toasterService.success(this.localizationService.instant('::LABEL_TasksRestoredSuccessfully'));
      this.list.get();
    });
  }

  restoreCurrentTask(task) {
    this.confirmation.warn('::LABEL_RestoreConfirmationMessage', 'AbpUi::AreYouSure')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.service.restoreTaskByIdsByIds([task.id]).subscribe(_ => {
            this.toasterService.success(this.localizationService.instant('::LABEL_TasksRestoredSuccessfully'));
            this.list.get();
          });
        }
      });
  }

  deleteLinksWidget() {
    this.confirmation.warn('::LABEL_DeletionConfirmationMessage', 'AbpUi::AreYouSure', {
      messageLocalizationParams: [this.widgetInfo, this.selectedWidget.name],
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

  advancedSelectChange(event, type) {
    if (type === 'shift') {
      this.selectedShift = event ? event.id : '';
    } else if (type === 'todoListSetup') {
      this.selectedTodoListSetup = event ? event.id : '';
    } else if (type === 'assignee') {
      this.selectedUser = event ? event.id : '';
    } else if (type === 'state') {
      this.selectedState = event ? event.id : '';
    }
  }

  filterData() {
    this.filterSearchHasValue =
      (this.selectedShift && this.selectedShift.length > 0) ||
      (this.selectedUser && this.selectedUser.length > 0) ||
      (this.selectedTodoListSetup && this.selectedTodoListSetup.length > 0) ||
      (this.selectedState && this.selectedState.length > 0);
    this.list.get();
  }

  clearAdvancedFilter() {
    this.selectedShift = [];
    this.selectedUser = [];
    this.selectedTodoListSetup = [];
    this.selectedState = [];
    this.taskDateFromString = "";
    this.taskDateFromString = "";
    this.taskDateFrom = null;
    this.taskDateTo = null;
    this.filterSearchHasValue = false;
  }

  quickFilterMyTodoList() {
    if (this.quickFilterMyTodoListHasValue) {
      this.selectedUser = [];
      this.quickFilterMyTodoListHasValue = false;
    } else {
      this.selectedUser = [this.currentUser.id];
      this.quickFilterMyTodoListHasValue = true;
    }
    this.list.get();
  }

  viewStandards(todoData) {
    this.currentIndex = 0;
    this.service.get(todoData.id).subscribe(data => {
      if (!data.standards || data.standards.length === 0) {
        this.toasterService.warn(this.localizationService.instant('::LABEL_NoStandardsAvailable'));
        return;
      }
      const standardObservables = data.standards.map(standard => this.standardService.get(standard.standardId));
      forkJoin(standardObservables).subscribe(standards => {
        this.viewStandardsData = standards;
        this.isViewStandardsModalOpen = true;
      });
    });
  }

  getLayoutArray() {
    switch (this.selectedLayout) {
      case '1x1':
        return [0];
      case '1x2':
        return [0, 1];
      case '2x2':
        return [0, 1, 2, 3];
      default:
        return [0];
    }
  }

  getColClass() {
    switch (this.selectedLayout) {
      case '1x1':
        return 'col-12';
      case '1x2':
        return 'col-6';
      case '2x2':
        return 'col-6';
      default:
        return 'col-12';
    }
  }

  navigateToPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.getLayoutArray().length;
    }
  }

  navigateToNext() {
    if (this.currentIndex + this.getLayoutArray().length < this.viewStandardsData.length) {
      this.currentIndex += this.getLayoutArray().length;
    }
  }

  viewLinks(todoData) {
    this.service.get(todoData.id).subscribe(data => {
      if (!data.links || data.links.length === 0) {
        this.toasterService.warn(this.localizationService.instant('::LABEL_NoLinksAvailable'));
        return;
      }
      this.currentTodoData = data;
      this.isViewLinksModalOpen = true;
    });
  }

  addEditComment(todoData) {
    this.service.get(todoData.id).subscribe(data => {
      this.currentTodoData = data;
      if (this.currentTodoData.comments.length === 0) {
        this.comment = this.initComment;
      } else {
        this.comment = this.currentTodoData.comments[0].commentText;
      }
      this.isAddEditCommentModalOpen = true;
    });
  }

  saveComment() {
    if (this.currentTodoData.comments.length === 0) {
      this.service.addCommentToToDoTaskByIdAndContent(this.currentTodoData.id, this.comment).subscribe(res => {
        this.isAddEditCommentModalOpen = false;
        this.list.get();
        this.toasterService.success(this.localizationService.instant('::LABEL_CommentAddedSuccessfully'));
      });
    } else {
      this.service.editCommentOnToDoTaskByIdAndCommentIdAndContent(this.currentTodoData.id, this.currentTodoData.comments[0].id, this.comment).subscribe(res => {
        this.isAddEditCommentModalOpen = false;
        this.list.get();
        this.toasterService.success(this.localizationService.instant('::LABEL_CommentUpdatedSuccessfully'));
      });
    }
  }

  addEditCard(todoData) {
    this.currentTodoData = todoData;
    if(todoData.assignedCardId) {
      this.cardService.get(todoData.assignedCardId).subscribe(res => {
        this.card = res;
        this.isAddEditCardModalOpen = true;
      });
    } else {
      this.todoTypeSerice.get(todoData.toDoTypeId).subscribe(res => {
        this.card = {} as ActivityCardDto;
        this.card.cardTypeId = res.cardTypeId;
        this.card.categoryId = res.cardCategoryId;
        this.card.instructions = `${this.localizationService.instant('::LABEL_ToDoTask')}: ${todoData.taskInfo || ''}`;

        let details = '';
        if (todoData.shiftName) {
          details += `${this.localizationService.instant('::LABEL_Shift')}: ${todoData.shiftName}<br>`;
        }
        if (todoData.assigneeName) {
          details += `${this.localizationService.instant('::LABEL_Assignee')}: ${todoData.assigneeName}<br>`;
        }
        if (todoData.taskDate) {
          details += `${this.localizationService.instant('::LABEL_TaskDate')}: ${this.datePipe.transform(todoData.taskDate, 'dd MMM yyyy hh:mm a')}<br>`;
        }
        if (todoData.comments && todoData.comments.length > 0) {
          details += `${this.localizationService.instant('::LABEL_Comments')}: ${todoData.comments[0].commentText}`;
        }
     
        this.card.longInstruction = details;
        this.isAddEditCardModalOpen = true;
      });
    }
  }

  onCardIdChange(cardId): void {
    this.service.assignActivityCardToToDoTaskByIdAndActivityCardId(this.currentTodoData.id, cardId).subscribe(_ => {
      this.isAddEditCardModalOpen = false;
      this.list.get();
    });
  }

  filterUsers(searchTerm: string) {
    if (!searchTerm) {
      this.userList = this.initUserList;
      return;
    }
    this.userService.getUserList({ filter: searchTerm, maxResultCount: 10 }).subscribe((res) => {
      this.userList = res.items;
    });
  }

  onSelect(event) {
    this.selected = event.selected;
  }

  standExpandChange(index: number) {
  }

  restore() {
    if (this.selected.length === 0) {
      this.toasterService.warn(this.localizationService.instant('::LABEL_PleaseSelectAtLeastOneTodo'));
      return;
    }

    const message = this.selected.length > 1
      ? this.localizationService.instant('::LABEL_CancelConfirmationMessagePlural')
      : this.localizationService.instant('::LABEL_CancelConfirmationMessage');

    this.confirmation.warn(message, 'AbpUi::AreYouSure')
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          this.updateTodoStatusToCancel();
        }
      });
  }

  selectedChanges(event, type) {
    const selectedIds = event.length > 0 ? event.map(e => e.id) : [];
    switch (type) {
      case 'shift':
        this.selectedShift = selectedIds;
        break;
      case 'todoListSetup':
        this.selectedTodoListSetup = selectedIds;
        break;
      case 'assignee':
        this.selectedUser = selectedIds;
        break;
      case 'state':
        this.selectedState = selectedIds;
        break;
      default:
        break;
    }
  }

  selectShift(shiftId: string): void {
    if (this.selectedShift.includes(shiftId)) {
      this.selectedShift = this.selectedShift.filter(id => id !== shiftId);
    } else {
      this.selectedShift.push(shiftId);
    }
    this.list.get();
  }

  select() {
    this.isCheckBoxShown = !this.isCheckBoxShown;
    if (!this.isCheckBoxShown) {
      this.selected = [];
    }
  }

  handleStatusChange(event: { todoTaskId: string; nextStatus: string }) {
    this.wantToIncompleteTaskId = event.todoTaskId;
    this.comment = this.initComment;
    this.isChangeToIncompleteShouldCommentModalOpen = true;
  }

  saveWhyIncompleteComment() {
    this.service.addCommentToToDoTaskByIdAndContent(this.wantToIncompleteTaskId, this.comment).subscribe(_ => {
      this.service.updateTaskStatusByIdByIdAndEvent(this.wantToIncompleteTaskId, "InCompleted").subscribe(_ => {
        this.comment = this.initComment;
        this.list.get();
        this.isChangeToIncompleteShouldCommentModalOpen = false;
        this.toasterService.success('::TaskStatusUpdatedSuccessfully', '', {
          messageLocalizationParams: ["InCompleted"],
        });
      });
    });
  }
}
