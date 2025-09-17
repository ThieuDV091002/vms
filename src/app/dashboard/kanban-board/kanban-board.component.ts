import { ConfigStateService, CurrentUserDto, LocalizationService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AreaService, SiteService } from '@apis/corporate';
import { AreaDto, SiteDto } from '@apis/corporate/dtos';
import { ActivityCardCategoryService, ActivityCardService, ActivityCardTypeService, DataTierInput, StateModelService, StateService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardDto, ActivityCardTypeDto, GetActivityCardListDto, GetActivityCardListSummaryDto, StateDto, StateModelDto } from '@apis/ticket/dtos';
import { TreeviewAssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { UserService } from '@proxy/services';
import { concatMap, debounceTime, forkJoin, of, Subject, Subscription, map } from 'rxjs';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { Router } from '@angular/router';
import { KochidService } from 'src/app/shared/services/kochid.service';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs/operators';

enum DragAction {
  Escalation = 'Escalation',
  DeEscalation = 'DeEscalation',
  Transfer = 'Transfer',
  Archive = 'Archived',
  Cancel = 'Cancelled'
}
enum CardTypes {
  Action = 'Action',
  Idea = 'Idea',
  RedTag = 'Red Tag',
  Support = 'Support',
}
@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() defaultDataTierLevel: string;
  @Input() selectedDataTier: any;
  @Input() queryId;
  @Input() selected: any = { title: '', url: '', hideTitle: false };
  @Input() index = -1;
  @Output() updateChange: EventEmitter<any> = new EventEmitter<any>();
  widget: string;
  DragAction = DragAction;
  readonly CardTypes = CardTypes;
  dragActions = Object.keys(DragAction);
  selectedQuickFilters = { 'cardType': [], owner: false };
  isCollapse = false;
  listView = false;
  data: GetActivityCardListSummaryDto = { activityCardList: [], noOfCardsNoUpdate: 0, noOfCardsActive: 0, noOfCardsTaskOverdue: 0, noOfCardsUnassignedTasks: 0, noOfCardsMissingDueDate: 0 };
  groupedCardData: any = [
    { status: 'New', statusLabel: '::LABEL_New', data: [], tooltip: '::TOOLTIP_New' },
    { status: 'Backlog', statusLabel: '::LABEL_PlanBacklog', data: [], tooltip: '::TOOLTIP_PlanBacklog' },
    { status: 'In Progress', statusLabel: '::LABEL_DoInProgress', data: [], tooltip: '::TOOLTIP_DoInProgress' },
    { status: 'Review', statusLabel: '::LABEL_CheckReview', data: [], tooltip: '::TOOLTIP_CheckReview' },
    { status: 'Completed', statusLabel: '::LABEL_ACTComplete', data: [], tooltip: '::TOOLTIP_ActComplete' }
  ];
  currentUser: CurrentUserDto;
  isCardTransferModalVisible = false;
  isCardDeEscalateModalVisible = false;
  areas: AreaDto[] = [];
  transferArea: AreaDto;
  isAddCardModalVisible = false;
  advancedFilters = {
    cardType: [],
    ownerType: [],
    status: [],
    priority: [],
    dueDate: [],
    dataTier: []
  };
  states: StateDto[] = [];
  stateModels: StateModelDto[] = [];
  activityCardTypes: ActivityCardTypeDto[] = [];
  defaultDataTier: TreeviewAssignedDataTierDto;
  assignedDataTiers: TreeviewAssignedDataTierDto[] = [];
  dragCard: GetActivityCardListDto;
  deDscalateDataTier: any;
  deDscalateDataTierList: any[] = [];
  drag = false;
  selectedCardType: ActivityCardTypeDto;
  card: ActivityCardDto;
  areaSearchInput$ = new Subject<string | null>();
  debounceTime = 500;
  filterForm: FormGroup;
  categoryData: ActivityCardCategoryDto[];
  dataTierDataOptions: any[] = [];
  userSelectOptions: any[] = [];
  input$ = new Subject<string | null>();
  userSubscription: Subscription;
  siteData: SiteDto;
  areaData = [];
  cellData = [];
  tenantInfo: any;
  cardStateModel: StateModelDto;
  info: string;
  showAdvancedFilter = false;
  filterSearchHasValue = false;
  searchFilter: string = '';
  accordingIndex = 0;
  userMap = new Map<string, IdentityUserDto>();
  isMyDirectEmployees: boolean = false;
  expandSubTiers = false;
  summaryItems = [
    { label: '::LABEL_NoUpdates10Days', value: () => this.data?.noOfCardsNoUpdate || 0, tooltip: '::TOOLTIP_NoUpdates10Days' },
    { label: '::LABEL_Open21Days', value: () => this.data?.noOfCardsActive || 0, tooltip: '::TOOLTIP_Open21Days' },
    { label: '::LABEL_OverdueTasks', value: () => this.data?.noOfCardsTaskOverdue || 0, tooltip: '::TOOLTIP_OverdueTasks' },
    { label: '::LABEL_UnassignedTasks', value: () => this.data?.noOfCardsUnassignedTasks || 0, tooltip: '::TOOLTIP_UnassignedTasks' },
    { label: '::LABEL_MissingDueDate', value: () => this.data?.noOfCardsMissingDueDate || 0, tooltip: '::TOOLTIP_NewMissingDueDate' }
  ];
  cardListsubscription: Subscription;
  currentFilter: string | null = null;
  cardListViewData: GetActivityCardListSummaryDto;
  isDropRequestInProgress: boolean = false;

  constructor(private configService: ConfigStateService, private areaService: AreaService,
    private confirmationService: ConfirmationService, private toasterService: ToasterService,
    private stateService: StateService, private activityCardService: ActivityCardService,
    private userService: UserService, public activityCardTypeService: ActivityCardTypeService,
    private siteService: SiteService, public stateModelService: StateModelService,
    private fb: FormBuilder,
    private activityCardCategoryservice: ActivityCardCategoryService,
    private identityUserService: IdentityUserService,
    private localizationService: LocalizationService,
    private platformService: PlatformService,
    private router: Router,
    private kochidService: KochidService,
  ) {
    this.currentUser = this.configService.getOne('currentUser');
    this.tenantInfo = this.configService.getOne('extraProperties');
    this.localizationService.get('::LABLE_ActivityCard').subscribe(data => {
      this.info = data
    });
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widget = data;
    });
  }

  ngOnInit(): void {
    this.buildFilterForm();
    this.userService.getTreeviewDataTiersByUser(this.currentUser.id).subscribe(res => {
      const area = res.assignedDataTiers
        .filter(d => d.areaId)
        .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area' }))
        .filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.id === value.id && t.name === value.name
          ))
        );
      this.areaService.getTreeViewList({
        ids: area.map(d => d.id),
        site: this.filterForm.controls['site'].value,
        tenantDataTierID: this.tenantInfo?.DataTierId,
        tenantDataTierType: this.tenantInfo?.DataTierType
      }).subscribe(response => {
        AppUtils.initTreeData(response);
        const haveAccessTreeNode = AppUtils.initHasAccessTreeNode(
          response,
          res.assignedDataTiers
        );
        const assignedDataTiers = JSON.parse(JSON.stringify(AppUtils.getAccessTreNode(haveAccessTreeNode)));
        assignedDataTiers.forEach(element => {
          if (element.disabled) {
            element.disabled = false;
          }
          element.children = element.children.filter(x => !x.disabled);
        });
        this.areaData = assignedDataTiers;


        if (this.tenantInfo && this.tenantInfo?.DataTierType === 'Site') {
          this.siteService.get(this.tenantInfo.DataTierId).subscribe(res => {
            this.siteData = res;
            this.filterForm.controls['site'].setValue(this.tenantInfo.DataTierId);
            if (this.defaultDataTierLevel === 'Site' || this.defaultDataTierLevel === undefined) {
              this.getActivityCards();
            }
          })
        }
        if (res.defaultDataTier?.dataTierType && res.defaultDataTier?.dataTierId && this.defaultDataTierLevel !== 'Site') {
          this.defaultDataTier = res.defaultDataTier;
          this.assignedDataTiers = res.assignedDataTiers;
          if (this.defaultDataTier && this.defaultDataTierLevel !== 'No') {
            // area, cell, workcenter, null
            this.filterForm.controls['area'].setValue([this.defaultDataTier.areaId]);
            if (this.defaultDataTier.cellId && this.defaultDataTierLevel !== 'Area') { // null, cell, workcenter
              this.filterForm.controls['cell'].setValue([this.defaultDataTier.cellId]);
            }
          }
          this.getActivityCards();
        }
      })
    });

    this.getActivityCardTypes();
    this.getStates();
    this.registSearchDebounce();
    this.getCardCategoryData();
    this.getUserData();
    this.input$.subscribe(newTerm => {
      this.getUserData(newTerm);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filterForm) {
      this.filterForm.controls['area'].setValue(this.selectedDataTier?.areas ? this.selectedDataTier?.areas.map(x => x.id) : []);
      // as kanban display area and cell, but data tier filter area/cell/workcenter. so need check, if selected cell in celldata then set cell in filter form
      // such as if use have workcenter access, then data tier filter will display the parent cell, but in kanbannot display that cell
      const availableCells = this.selectedDataTier?.cells?.filter(x => this.cellData.find(y => y.id === x.id));
      this.filterForm.controls['cell'].setValue(availableCells ? availableCells.map(x => x.id) : []);
      this.getActivityCards();
    }
  }

  getCardCategoryData() {
    this.activityCardCategoryservice.getAllInstances().subscribe(res => {
      this.categoryData = res;
    });
  }

  getUserData(name?) {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.userSubscription = this.userService.getUserList({ maxResultCount: 20, filter: name }).subscribe((res) => {
      this.userSelectOptions = [];
      res.items.forEach(user => {
        if (user.name !== null) {
          this.userSelectOptions.push({
            id: user.id,
            name: user.name,
            email: user.email
          });
        }
      });
    });
  }

  registSearchDebounce() {
    // area input search input debounce
    this.areaSearchInput$
      .pipe(debounceTime(this.debounceTime))
      .subscribe((searchItem) => {
        this.areaService.getTreeViewList({
          ids: [],
          name: searchItem,
          tenantDataTierID: this.tenantInfo?.DataTierId,
          tenantDataTierType: this.tenantInfo?.DataTierType
        }).subscribe(res => {
          this.areas = res;
        })
      });
  }

  getActivityCardTypes() {
    this.activityCardTypeService.getList({ maxResultCount: 10 })
      .subscribe(res => {
        this.activityCardTypes = res.items;
        // request stateModel by id based on stateModelIds
        // getList and allInstance API not return transitions details so need use get by id instead
        const stateModelIds = [...new Set(this.activityCardTypes.map(x => x.stateModelId))];
        forkJoin(stateModelIds.map(id => this.stateModelService.get(id)))
          .subscribe(res => {
            this.stateModels = res.filter(x => x?.id);
          });
      });
  }

  getMyDirectEmployeesCard() {
    this.isMyDirectEmployees = !this.isMyDirectEmployees;
    if (this.isMyDirectEmployees) {
      const user = this.configService.getOne('currentUser');
      const email = user.email;

      this.kochidService.getUserInfoByEmail(email, { skipAddingHeader: true }).pipe(
        concatMap(res => {
          if (res.resources.length === 0) {
            return of(null);
          } else {
            const managerDn = res.resources[0].dn.replace(/\\/g, '\\\\');
            return this.kochidService.getDirectEmployeeInfosByManagerDn(managerDn, { skipAddingHeader: true });
          }
        }),
        concatMap(res => {
          if (res === null) {
            return of(null);
          } else {
            const userEmails = res.resources.map(x => x.attributes.mail);
            return this.activityCardService.getCardListByOwnerEmailByOwnerEmail(userEmails);
          }
        }),
        concatMap(res => {
          if (res === null) {
            return of(null);
          } else {
            this.data = res;
            let ids = res.activityCardList?.map(x => x.assignedOwnerId).filter(x => x).filter(x => !this.userMap.has(x));
            ids = [...new Set(ids)];
            this.groupedCardData.forEach(x => x.data = []);
            res.activityCardList?.forEach(card => {
              this.groupedCardData.find(x => x.status === card.currentStateName)?.data.push(card);
            });
            return this.userService.get(ids);
          }
        })
      ).subscribe(res => {
        if (res !== null) {
          res.forEach(user => {
            if (!this.userMap.has(user.id)) {
              this.userMap.set(user.id, user);
            }
          });
        }
      });
    } else {
      this.getActivityCards();
    }
  }

  getStates() {
    if (this.states.length === 0) {
      this.stateService.getAllInstances().subscribe(res => {
        this.states = res;
      });
    }
  }

  editDataTierListParams() {
    const selectedCells = this.filterForm.controls['cell'].value || [];
    const selectedAreas = this.filterForm.controls['area'].value || [];

    if (selectedCells.length > 0) {
      const areasWithoutCells = selectedAreas.filter(areaId => {
        const area = this.areaData.find(a => a.id === areaId);
        return area && !area.children.some(child => selectedCells.includes(child.id));
      });

      return [
        ...selectedCells.map(id => ({ id, type: 'Cell' })),
        ...areasWithoutCells.map(id => ({ id, type: 'Area' }))
      ] as DataTierInput[];
    }

    if (selectedAreas.length > 0) {
      return selectedAreas.map(id => ({ id, type: 'Area' })) as DataTierInput[];
    }

    if (this.filterForm.controls['site'].value) {
      return [{ id: this.filterForm.controls['site'].value, type: 'Site' }] as DataTierInput[];
    }
    return [];
  }

  getActivityCards() {
    const { site, area, cell, status, category, owner } = this.filterForm.value;
    this.filterSearchHasValue = !!(site || area.length || cell.length || status.length || category.length || owner.length || this.searchFilter);
    const dataTier = this.editDataTierListParams();
    if (dataTier?.length === 0) {
      this.data = { activityCardList: [], noOfCardsNoUpdate: 0, noOfCardsActive: 0, noOfCardsTaskOverdue: 0, noOfCardsUnassignedTasks: 0, noOfCardsMissingDueDate: 0 };
      this.groupedCardData.forEach(x => x.data = []);
      return;
    }
    let owners = [];
    if (this.selectedQuickFilters.owner) {
      this.filterForm.controls['owner'].setValue([]);
      owners.push(this.currentUser.id);
    } else {
      owners = this.filterForm.controls['owner'].value;
    }
    if (this.cardListsubscription) {
      this.cardListsubscription.unsubscribe();
    }
    this.cardListsubscription = this.activityCardService.getActivityCardListByInput({
      filter: this.searchFilter,
      dataTierList: dataTier,
      cardTypeList: this.selectedQuickFilters.cardType,
      categoryList: this.filterForm.controls['category'].value,
      ownerList: owners,
      statusList: this.filterForm.controls['status'].value,
      expandSubTiers: this.expandSubTiers,
    }).subscribe(res => {
      this.data = res;
      this.cardListViewData = this.data;
      // get userids and then get corresponding list by API
      let ids = res.activityCardList.map(x => x.assignedOwnerId).filter(x => x).filter(x => !this.userMap.has(x));
      // remove duplicate ids
      ids = [...new Set(ids)];
      this.userService.get(ids).subscribe(res => {
        res.forEach(user => {
          if (!this.userMap.has(user.id)) {
            this.userMap.set(user.id, user);
          }
        });
      });
      this.groupedCardData.forEach(x => x.data = []);
      res.activityCardList.forEach(card => {
        this.groupedCardData.find(x => x.status === card.currentStateName)?.data.push(card);
      });
      this.isDropRequestInProgress = false;
    })
  }

  clearFilterData() {
    this.filterForm.reset();
    this.filterSearchHasValue = false;
  }

  cardChange() {
    // if (type === 'card') {
    this.getActivityCards();
    // }
  }

  filterCard(type, value = null) {
    if (!value) {
      this.selectedQuickFilters[type] = !this.selectedQuickFilters[type];
    } else {
      if (this.selectedQuickFilters[type].includes(value)) {
        this.selectedQuickFilters[type] = this.selectedQuickFilters[type].filter(x => x !== value);
      } else {
        this.selectedQuickFilters[type].push(value);
      }
    }
    this.getActivityCards();
  }

  quickFilterActive(type, value = null) {
    if (!value) {
      return this.selectedQuickFilters[type];
    } else {
      return this.selectedQuickFilters[type].includes(value);
    }

  }

  checkDragEnabled(action: string) {
    if (!this.dragCard || !this.drag) {
      return false;
    }
    // check current state is available for the action
    if (!DragAction[action] && this.dragCard?.currentStateName !== action) {
      return this.isSteteUpdateAvailable(action);
    }
    else if (action === DragAction.Escalation && this.dragCard?.dataTierType === 'Site') {
      return false;
    }
    else if (action === DragAction.DeEscalation && this.dragCard?.dataTierType === 'Cell') {
      return false;
    }
    else if (action === DragAction.Transfer && this.dragCard?.dataTierType !== 'Area') {
      return false;
    }
    else if (action === DragAction.Archive && this.dragCard?.currentStateName !== 'Completed') {
      return false;
    }
    else if (action === DragAction.Cancel && this.dragCard?.currentStateName === 'Completed') {
      return false;
    }
    else {
      return DragAction[action] ? true : false;
    }
  }

  escalateCard(card: GetActivityCardListDto) {
    if (card.dataTierType !== 'Site') {
      this.activityCardService.escalateActivityCardByCardId(card.id).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyEscalated', "", { life: 1000 });
        this.getActivityCards();
      })
    }
  }

  deEscalateCard(card: GetActivityCardListDto) {
    this.deDscalateDataTier = null;
    if (card.dataTierType === 'Cell') {
      this.isDropRequestInProgress = false;
      return;
    }

    this.deDscalateDataTierList = [];
    if (card.dataTierType === 'Site') {
      this.siteService.getTreeView(card.dataTierId).subscribe(res => {
        this.deDscalateDataTierList = res.areas;
        const previousArea = card['previousDataTierType'] === 'Area' && card.previousDataTierId
          ? res.areas.find(x => x.id === card.previousDataTierId)
          : null;
        if (previousArea) {
          this.deDscalateDataTier = previousArea;
        }
        this.isCardDeEscalateModalVisible = true;
        this.isDropRequestInProgress = false;
      })
    } else if (card.dataTierType === 'Area') {
      this.areaService.getTreeView(card.dataTierId).subscribe(res => {
        this.deDscalateDataTierList = res.cells;
        if (card['previousDataTierType'] === 'Cell' && card.previousDataTierId) {
          this.deDscalateDataTier = res.cells.find(x => x.id === card.previousDataTierId);
        }
        this.isCardDeEscalateModalVisible = true;
        this.isDropRequestInProgress = false;
      })
    } else {
      this.isDropRequestInProgress = false;
    }
  }

  deEscalateCardAction() {
    if (this.dragCard.dataTierType !== 'Cell') {
      this.activityCardService.deescalateActivityCardByInput({
        cardId: this.dragCard.id,
        toDataTierId: this.deDscalateDataTier.id,
        toDataTierType: this.deDscalateDataTier.type
      }).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyDeEscalated', "", { life: 1000 });
        this.getActivityCards();
        this.isCardDeEscalateModalVisible = false;
      })
    }
  }

  checkTransfer(card: GetActivityCardListDto) {
    if (card.dataTierType !== 'Area') {
      this.isDropRequestInProgress = false;
      return;
    }
    this.isCardTransferModalVisible = true;
    if (this.areas.length === 0) {
      this.areaService.getTreeViewList({ ids: [], tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(res => {
        this.areas = res;
        this.isDropRequestInProgress = false;
      });
    }
  }

  isSteteUpdateAvailable(toStateName: string) {
    // check if complete card have open task
    if (toStateName === 'Completed' && this.dragCard.noOfTaskOpen > 0) {
      return false;
    }
    const availableStateTrans = this.cardStateModel.transitions
      .filter(x => x.fromState === this.dragCard.currentStateId);
    return availableStateTrans.find(x => x.toState === this.states.find(x => x.name === toStateName)?.id);
  }

  updateCardState(state: string) {
    // check current state and target state is available for the action
    // if not return, else call the update service
    if (this.isSteteUpdateAvailable(state)) {
      this.activityCardService.updateActivityCardStatusByCardIdAndNewStatusId(
        this.dragCard.id, this.states.find(x => x.name === state).id
      ).subscribe(res => {
        this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
          messageLocalizationParams: [this.info, this.dragCard.instructions],
          life: 1000
        });
        // remove card from origin group and add to the new state group instead of after get list done which may need some time and seems stuck to user
        // so need to update the UI immediately, anyway when get list done, it will update the UI again with true data from DB.
        const originGroup = this.groupedCardData.find(x => x.status === this.dragCard.currentStateName);
        originGroup.data = originGroup.data.filter(x => x.id !== this.dragCard.id);
        this.dragCard.currentStateName = state;
        this.groupedCardData.find(x => x.status === state)?.data.push(this.dragCard);
        this.getActivityCards();
      })
    } else {
      this.isDropRequestInProgress = false;
    }
  }

  transferCard() {
    this.activityCardService.transferActivityCardByInput({
      cardId: this.dragCard.id,
      toDataTierId: this.transferArea.id,
      toDataTierType: 'Area'
    }).subscribe(res => {
      this.toasterService.success('::LABEL_SuccessfullyTransferred', "", { life: 1000 });
      this.getActivityCards();
      this.isCardTransferModalVisible = false;
      this.transferArea = null;
    })
  }

  archiveCard(card: GetActivityCardListDto) {
    if (card.currentStateName === 'Completed') {
      this.activityCardService.updateActivityCardStatusByCardIdAndNewStatusId(
        card.id, this.states.find(x => x.name === 'Archived').id
      ).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyArchived', "", { life: 1000 });
        this.getActivityCards();
      })
    } else {
      this.isDropRequestInProgress = false;
    }
  }

  cancelCard(card: GetActivityCardListDto) {
    if (card.currentStateName !== 'Completed') {
      this.activityCardService.updateActivityCardStatusByCardIdAndNewStatusId(
        card.id, this.states.find(x => x.name === 'Cancelled').id
      ).subscribe(res => {
        this.toasterService.success('::LABEL_SuccessfullyCancelled', "", { life: 1000 });
        this.getActivityCards();
      })
    }
  }

  createCard() {
    this.card = {} as ActivityCardDto;
    if (this.platformService.isMobile) {
      this.router.navigate(['/mobile/card-creator']);
    } else {
      this.isAddCardModalVisible = true;
    }
  }

  editCard(card: GetActivityCardListDto, index = 0) {
    if (this.platformService.isMobile) {
      this.card = { ...card } as unknown as ActivityCardDto;
      this.router.navigate(['/mobile/card-creator'], { queryParams: { id: this.card.id } });
    } else {
      this.selectedCardType = this.activityCardTypes.find(x => x.id === card.cardTypeId);
      this.card = { ...card } as unknown as ActivityCardDto;
      this.isAddCardModalVisible = true;
    }
    this.accordingIndex = index;
  }

  applyAdvancedFilter() {

  }

  buildFilterForm() {
    this.filterForm = this.fb.group({
      site: [undefined],
      area: [[]],
      cell: [[]],
      status: [[]],
      category: [[]],
      owner: [[]]
    });

    // this.filterForm.controls['site'].valueChanges.subscribe(value => {
    //   if (value) {
    //     this.areaService.getTreeViewList({ ids: [], site: value }).subscribe(response => {
    //       this.areaData = response;
    //       this.filterForm.controls['area'].setValue([]);
    //       this.filterForm.controls['cell'].setValue([]);
    //     });
    //   }
    // });

    this.filterForm.controls['area'].valueChanges.subscribe((value) => {
      this.cellData = [];
      if (value.length > 0) {
        value.forEach(item => {
          this.cellData = this.cellData.concat(this.areaData.find(x => x.id === item)?.children || []);
        });
        this.filterForm.controls['cell'].value?.forEach(item => {
          if (!this.cellData.map(x => x.id).includes(item)) {
            this.filterForm.controls['cell'].setValue(this.filterForm.controls['cell'].value.filter(x => x !== item));
          }
        });
      } else {
        this.filterForm.controls['cell'].setValue([]);
      }
    })
  }

  updateCardStatus(event) {
    this.getActivityCards();
  }

  selectedChanges(event, type) {
    if (type === 'area') {
      if (event.length > 0) {
        this.filterForm.controls['area'].setValue(event.map(e => e.id));
      } else {
        this.filterForm.controls['area'].setValue([]);
      }
    }
    if (type === 'cell') {
      if (event.length > 0) {
        this.filterForm.controls['cell'].setValue(event.map(e => e.id));
      } else {
        this.filterForm.controls['cell'].setValue([]);
      }
    }
    if (type === 'status') {
      if (event.length > 0) {
        this.filterForm.controls['status'].setValue(event.map(e => e.id));
      } else {
        this.filterForm.controls['status'].setValue([]);
      }
    }
    if (type === 'category') {
      if (event.length > 0) {
        this.filterForm.controls['category'].setValue(event.map(e => e.id));
      } else {
        this.filterForm.controls['category'].setValue([]);
      }
    }
    if (type === 'owner') {
      if (event.length > 0) {
        this.filterForm.controls['owner'].setValue(event.map(e => e.id));
      } else {
        this.filterForm.controls['owner'].setValue([]);
      }
    }
  }

  toggleView() {
    this.listView = !this.listView;
  }

  ngOnDestroy(): void {
    if (this.cardListsubscription) {
      this.cardListsubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  deleteWidget() {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [this.widget, this.selected.name]
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.updateChange.emit({ type: 'delete', widget: this.selected });
      }
    });
  }

  filterBySummaryType(label: string): void {
    let filteredData: GetActivityCardListDto[] = [];

    if (this.currentFilter === label) {
      this.currentFilter = null;
      filteredData = this.data.activityCardList;
    } else {
      this.currentFilter = label;
      switch (label) {
        case '::LABEL_NoUpdates10Days':
          filteredData = this.data.activityCardList.filter(dto => {
            const referenceTime = (dto.lastModificationTime && new Date(dto.lastModificationTime).getTime() > new Date('1900-01-01').getTime())
              ? dto.lastModificationTime
              : dto.creationTime;
            console.log('referenceTime', referenceTime);
            return referenceTime &&
              (new Date().getTime() - new Date(referenceTime).getTime()) / (1000 * 60 * 60 * 24) >= 10 &&
              !this.isCardInactive(dto.currentStateName);
          });

          break;

        case '::LABEL_Open21Days':
          filteredData = this.data.activityCardList.filter(dto =>
            (new Date().getTime() - new Date(dto.creationTime).getTime()) / (1000 * 60 * 60 * 24) >= 21 &&
            !this.isCardInactive(dto.currentStateName)
          );
          break;

        case '::LABEL_OverdueTasks':
          filteredData = this.data.activityCardList.filter(dto =>
            !this.isCardInactive(dto.currentStateName) &&
            dto.tasks?.some(task =>
              task.dueDate && new Date(task.dueDate).getTime() < new Date().getTime() &&
              !this.isTaskInactive(task.status)
            )
          );
          break;

        case '::LABEL_UnassignedTasks':
          filteredData = this.data.activityCardList.filter(dto =>
            !this.isCardInactive(dto.currentStateName) &&
            dto.tasks?.some(task =>
              (!task.ownerId || task.ownerId === '') &&
              !this.isTaskInactive(task.status)
            )
          );
          break;

        case '::LABEL_MissingDueDate':
          filteredData = this.data.activityCardList.filter(dto =>
            !this.isCardInactive(dto.currentStateName) &&
            dto.tasks?.some(task =>
              !task.dueDate &&
              !this.isTaskInactive(task.status)
            )
          );
          break;

        default:
          filteredData = this.data.activityCardList;
          break;
      }
    }

    this.cardListViewData = { ...this.data, activityCardList: filteredData };
    this.groupedCardData.forEach(group => group.data = []);
    filteredData.forEach(card => {
      this.groupedCardData.find(group => group.status === card.currentStateName)?.data.push(card);
    });
  }

  private isCardInactive(stateName: string): boolean {
    return ['Completed', 'Cancelled', 'Archived'].includes(stateName);
  }

  private isTaskInactive(status: string): boolean {
    return ['Completed', 'Cancelled'].includes(status);
  }

  ExpandSubTiers() {
    this.expandSubTiers = !this.expandSubTiers;
    this.getActivityCards();
  }

  onCardDragStarted(event: CdkDragStart<GetActivityCardListDto>) {
    if (this.drag || this.isDropRequestInProgress) {
      return;
    }
    this.cardStateModel = null;
    this.dragCard = event.source.data;

    const cardType = this.activityCardTypes.find(x => x.id === this.dragCard.cardTypeId);
    this.cardStateModel = this.stateModels.find(x => x.id === cardType.stateModelId);
    this.drag = true;
  }

  onCardDropped(event: CdkDragDrop<GetActivityCardListDto[]>) {
    try {
      if (!this.drag) return;
      const { dropPoint } = event;
      const containerElement = document.querySelector('.kanban-board') as HTMLElement;
      const statusPoolElement = document.querySelector('.kanban-board-footer') as HTMLElement;

      if (!containerElement || !statusPoolElement) return;

      const containerRect = containerElement.getBoundingClientRect();
      const statusPoolRect = statusPoolElement.getBoundingClientRect();

      // Calculate column index based on drop position
      const columnWidth = (containerRect.width - 12.8) / 5;
      const relativeX = dropPoint.x - containerRect.left;
      const columnIndex = Math.floor(relativeX / columnWidth);
      // Determine drop zone and corresponding actions
      const statusPoolActions = ['Escalation', 'DeEscalation', 'Transfer', 'Archived', 'Cancelled'];
      const isInStatusPool = dropPoint.y >= (statusPoolRect.bottom - statusPoolElement.offsetHeight * 2);

      if (isInStatusPool) {
        const dragAction = statusPoolActions[columnIndex];
        if (dragAction) {
          this.handleCardDrop(dragAction);
        }
      } else {
        if (event.previousContainer === event.container) {
          return; // No change in container, do nothing
        } else {
          const targetStatus = this.getStatusFromContainer(event.container.id);
          if (targetStatus) {
            this.handleCardDrop(targetStatus);
          }
        }
      }
    } finally {
      this.drag = false;
    }
  }

  private getStatusFromContainer(containerId: string): string {
    const statusMap = {
      'new-container': 'New',
      'backlog-container': 'Backlog',
      'inprogress-container': 'In Progress',
      'review-container': 'Review',
      'completed-container': 'Completed'
    };
    return statusMap[containerId] || '';
  }

  private handleCardDrop(dragAction: string) {
    this.isDropRequestInProgress = true;
    const relevantTasks = this.dragCard.tasks?.filter(task => task.status !== 'Cancelled');

    if (['In Progress', 'Review', 'Completed'].includes(dragAction)) {
      const hasValidTask = relevantTasks?.some(task =>
        task.status === 'Open' || task.status === 'Completed'
      );

      if (!hasValidTask) {
        this.toasterService.error(
          this.localizationService.instant('::LABEL_CreateTaskRequired'),
          this.localizationService.instant('::LABEL_ActionNotAllowed'),
        );
        this.isDropRequestInProgress = false;
        return;
      }
    }

    if (dragAction === 'Completed') {
      const allTasksCompleted = relevantTasks?.every(task => task.status === 'Completed');

      if (!allTasksCompleted) {
        this.toasterService.error(
          this.localizationService.instant('::LABEL_AllTasksMustBeCompleted'),
          this.localizationService.instant('::LABEL_ActionNotAllowed'),
        );
        this.isDropRequestInProgress = false;
        return;
      }
    }

    switch (dragAction) {
      case 'New':
      case 'Backlog':
      case 'In Progress':
      case 'Review':
      case 'Completed':
        this.updateCardState(dragAction);
        break;
      case DragAction.Escalation:
        this.escalateCard(this.dragCard);
        break;
      case DragAction.DeEscalation:
        this.deEscalateCard(this.dragCard);
        break;
      case DragAction.Transfer:
        this.checkTransfer(this.dragCard);
        break;
      case DragAction.Archive:
        this.archiveCard(this.dragCard);
        break;
      case DragAction.Cancel:
        this.cancelCard(this.dragCard);
        break;
      default:
        break;
    }
  }
}
