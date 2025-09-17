import { ConfigStateService, CurrentUserDto, LocalizationService } from '@abp/ng.core';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaService, CellService, SiteService } from '@apis/corporate';
import { AreaDto, CellDto, SiteDto } from '@apis/corporate/dtos';
import { LocalDowntimeReasonService, LocalScrapReasonService } from '@apis/general';
import { ActivityCardCategoryService, ActivityCardPriorityService, ActivityCardReasonService, ActivityCardService, ActivityCardTypeService, StateService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardCreateDto, ActivityCardDto, ActivityCardNotifyInput, ActivityCardPriorityDto, ActivityCardReasonDto, ActivityCardTypeDto, CreateUpdateActivityCardTaskDto, LocalDowntimeReasonDto, RootCauseAnalysisDto } from '@apis/ticket/dtos';
import { UserGroupUsersDto } from '@proxy/dtos/user-group';
import { UserService } from '@proxy/services';
import { concatMap, debounceTime, finalize, forkJoin, map, of, Subject, switchMap } from 'rxjs';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { FileService } from '../services/file.service';
import { DashboardUtils } from '../utils';
import { AssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { ProfilePictureService } from '../services/profile-picture.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { GetTenantTimezoneService } from 'src/app/shared/services/get-tenant-timezone.service';
import { AssessmentResultService, AssessmentService, AssessmentTypeService } from '@apis/ticket/assessment-management';
import { AssessmentGuidelineDto, AssessmentTypeDto } from '@apis/ticket/assessment-management/dtos';

enum DataTierTypes {
  Site = 'Site',
  Area = 'Area',
  Cell = 'Cell'
}
enum DuplicateDataTierType {
  Area = 'Area',
  Cell = 'Cell'
}
enum ReasonsType {
  LocalDowntimeReason = 'LocalDowntimeReason',
  LocalScrapReason = 'LocalScrapReason'
}
enum AttachmentType {
  General = 'General',
  RootCauseAnalysis = 'RootCauseAnalysis',
  Task = 'Task'
}

@Component({
  selector: 'app-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrl: './card-editor.component.scss'
})
export class CardEditorComponent implements OnInit {
  @ViewChild('commentList') commentList!: ElementRef;
  @ViewChildren('accordionItem') accordionItemList!: QueryList<ElementRef>;
  cardTypes: ActivityCardTypeDto[] = [];
  selectedCardType: ActivityCardTypeDto;
  @Input() card: ActivityCardDto;
  @Input() accordingIndex = 0;
  @Input() filter: any;
  @Output() cardChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() cardIdChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() cardClose: EventEmitter<void> = new EventEmitter<void>();
  users: IdentityUserDto [] | UserGroupUsersDto [] = [];
  userSearchInput$ = new Subject<string | null>();
  dataTierInput$ = new Subject<string | null>();
  debounceTime = 500;
  reasons: LocalDowntimeReasonDto[] = [];
  dataTierTypes = Object.keys(DataTierTypes);
  defaultDataTier: AssignedDataTierDto;
  dataTiers: SiteDto[] | AreaDto[] | CellDto[] = [];
  duplicateDataTierTypes = Object.keys(DuplicateDataTierType);
  duplicatedataTiers: AreaDto[] | CellDto[] = [];
  userAssignedAreasAndCells: any;
  sites: SiteDto[] = [];
  areas: AreaDto[] = [];
  cells: CellDto[] = [];
  assignedDataTiers: AssignedDataTierDto[] = [];
  cardCategories: ActivityCardCategoryDto[] = [];
  cardForm: FormGroup;
  status = '';
  info: string;
  createdUser: IdentityUserDto;
  originalDataTier: SiteDto | AreaDto | CellDto;
  selectedRootCauseAnalysis: RootCauseAnalysisDto[] = [];
  selectedCardTask: CreateUpdateActivityCardTaskDto[] = [];
  updateCardTaskList: any[] = [];
  commentColors = ['#e7f3fe', '#eeeeee'];
  commentUserAvaMap = new Map<string, string>();
  editorConfig = {
    toolbar: [
      [{'size': ['small', false, 'large', 'huge']}],
      [{'font': []}],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      // [{'script': 'sub'}, {'script': 'super'}],
      // [{'indent': '-1'}, {'indent': '+1'}],
      // [{'direction': 'rtl'}],

      [{'color': []}, {'background': []}],    // dropdown with defaults from theme

      [{'align': []}],

      ['link', 'image'],             // link and image, video
      ['code-block'],
      ['clean'],
    ]
  }
  selectedUserMap = new Map<string, IdentityUserDto | UserGroupUsersDto | CurrentUserDto>();
  isWeb = true;
  isUploadModalOpen = false;
  uploadFile: File;
  readonly AttachmentType = AttachmentType;
  uploadType = AttachmentType.General;
  attachmentMap = new Map<string, string>();
  generalAttachments: any[] = [];
  rootCauseAnalysisAttachments: any[] = [];
  cardPriorities: ActivityCardPriorityDto[] = [];
  taskAttachments: any[] = [];
  isAttachementPreviewOpen = false;
  previewAttchmentId: string;
  inProgress = false;
  selectedTaskAttachments: string[] = [];
  selectedRootAttachments: string[] = [];
  currentUser: CurrentUserDto |IdentityUserDto;
  tenantInfo: any;
  siteData: SiteDto;
  saving = false;
  defaultCardTypeName = 'Action';
  isTakePhoto: boolean = false;
  isScan: boolean = false;
  timeZoneOffset: string = '+00:00';
  defaultEmptyGuid = '00000000-0000-0000-0000-000000000000';
  assessmentTypes: AssessmentTypeDto[];
  guideLines: AssessmentGuidelineDto[];
  assessmentTypeName: string = '';
  assessmentQuestion: string = '';
  minDate = new Date('2020-01-01');
  maxDate = new Date('2050-12-31');
  isDuplicateModalOpen = false;
  selectedDuplicateDataTierType: string;
  selectedDuplicateDataTier: string;

  constructor(
    private identityUserService: IdentityUserService,
    private userService: UserService,
    private localDowntimeReasonService: LocalDowntimeReasonService,
    private siteService: SiteService,
    private areaService: AreaService,
    private cellSeervice: CellService,
    private cardCategoriesService: ActivityCardCategoryService,
    private cardService: ActivityCardService,
    private fb: FormBuilder,
    private stateService: StateService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private platformService: PlatformService,
    private fileService: FileService,
    private configService: ConfigStateService,
    private localScrapReasonService: LocalScrapReasonService,
    private cardPriorityService: ActivityCardPriorityService,
    private profilePictureService: ProfilePictureService,
    private cardTypeService: ActivityCardTypeService,
    private activityCardReasonService: ActivityCardReasonService,
    private getTenantTimezoneService: GetTenantTimezoneService,
    private assessmentTypeService: AssessmentTypeService,
    private assessmentService: AssessmentService,
    private assessmentResultService: AssessmentResultService
  ) {
    this.isWeb = this.platformService.isWeb();
    this.currentUser = this.configService.getOne('currentUser');
    this.tenantInfo = this.configService.getOne('extraProperties');
    this.identityUserService.get(this.currentUser.id).subscribe((res) => {
      this.currentUser = res;
      this.addUserToUserMap(this.currentUser);
    });
  }

  ngOnInit(): void {
    this.getTenantTimezoneService.getTimeZoneOffset().subscribe(offset => {
      this.timeZoneOffset = offset;
      if (!this.card?.id) {
        const date = this.getTenantTimezoneService.getDateWithOffset(new Date(), offset);
        this.cardForm.patchValue({ incidentDate: new Date(date) });
      }
    });
    this.buildCardForm();
    this.getDependencyModeling();
    this.registSearchDebounce();
    this.localizationService.get('::LABLE_ActivityCard').subscribe(data => {
      this.info = data
    });
    if (this.card.id) {
      this.getCardById();
    } else if (this.card.cardTypeId) {
      this.setSelectedCardType(this.card.cardTypeId);
    }
  }

  setSelectedCardType(cardTypeId: string) {
    this.cardTypeService.get(cardTypeId).subscribe((res) => {
      this.selectedCardType = res;
      this.getStatus();
      this.getCardCategories();
    });
  }

  onCardTypeChange(e, userAction = true) {
    this.selectedCardType = e;
    this.getStatus();
    if (userAction) {
      this.cardForm.patchValue({categoryId: null});
      this.cardForm.patchValue({reasonCode: null});
    }
    this.getCardCategories();
  }

  getCardPriorities() {
    if (!this.cardPriorities.length) {
      this.cardPriorityService.getAllInstances().subscribe((res) => {
        this.cardPriorities = res;
      })
    }
  }

  conditionalFieldValid() {
    // validator for categoryId/reasonCode/location/priorityId/incidentDate/externalProjectNo
    if (this.selectedCardType?.categoryField === 'Required' && !this.cardForm.get('categoryId').value) {
      return false;
    }
    if (this.selectedCardType?.reasonField === 'Required' && !this.cardForm.get('reasonCode').value) {
      return false;
    }
    if (this.selectedCardType?.locationField === 'Required' && !this.cardForm.get('location').value) {
      return false;
    }
    if (this.selectedCardType?.priorityField === 'Required' && !this.cardForm.get('priorityId').value) {
      return false;
    }
    if (this.selectedCardType?.incidentDateField === 'Required' && !this.cardForm.get('incidentDate').value) {
      return false;
    }
    if (this.selectedCardType?.extraProjectNumField === 'Required' && !this.cardForm.get('externalProjectNo').value) {
      return false;
    }
    return true;
  }

  // ngOnChanges(): void {
  //   this.buildCardForm();
  // }

  closeCardEditor() {
    this.cardClose.emit();
  }

  initAccording(): void {
    setTimeout(() => {
      if (this.accordionItemList.length) {
        this.accordionItemList.toArray()[3].nativeElement.addEventListener('show.bs.collapse', () => {
          setTimeout(() => {
            this.scrollToCommentBottom();
          }, 50);
        });
        this.openSpecificAccordion(this.accordingIndex);
      }
    }, 50);
  }

  openSpecificAccordion(index: number) {
    if (this.accordionItemList.length) {
      this.compressAll();
      const item = this.accordionItemList.toArray()[index];
      if (item) {
        item.nativeElement.classList.add('show');
        // find slibing accordion-button and add class collapsed
        const button = item.nativeElement.parentElement.querySelector('.accordion-button');
        if (button) {
          button.classList.remove('collapsed');
        }
      }
      if (index === 3) {
        setTimeout(() => {
          this.scrollToCommentBottom();
        }, 50);
      }
    }
  }

  onRootCauseSelect({selected}) {
    this.selectedRootCauseAnalysis = selected;
  }

  onCardTaskSelect({selected}) {
    this.selectedCardTask = selected;
  }

  expandAll() {
    if (this.accordionItemList) {
      this.accordionItemList.toArray().forEach((item) => {
        item.nativeElement.classList.add('show');
        // find slibing accordion-button and remove class collapsed
        const button = item.nativeElement.parentElement.querySelector('.accordion-button');
        if (button) {
          button.classList.remove('collapsed');
        }
      })
    }
  }

  compressAll() {
    if (this.accordionItemList) {
      this.accordionItemList.toArray().forEach((item) => {
        item.nativeElement.classList.remove('show');
        // find slibing accordion-button and add class collapsed
        const button = item.nativeElement.parentElement.querySelector('.accordion-button');
        if (button) {
          button.classList.add('collapsed');
        }
      })
    }
  }

  getLocalDate(date: string | Date) {
    // time string from server based on +00:00, convert to local time
    return date ? new Date(date).toLocaleString() : date;
  }

  initTaskList() {
    this.updateCardTaskList = Object.assign(this.card.tasks);
    this.updateCardTaskList.forEach((item) => {
      if (item.dueDate) {
        item.dueDate = new Date(item.dueDate.split('T')[0]);
      }
    });
  }

  getCardById() {
    this.cardService.getActivityCardByInput({
      cardId: this.card.id,
      includeRootCauseAnalysis: true,
      includeTasks: true,
      includeComments: true
    }).subscribe((res) => {
      this.card = res;
      this.buildCardForm();
      this.getAssessmentType();
      this.cardTypeService.get(this.card.cardTypeId).subscribe((res) => {
        this.selectedCardType = res;
        this.initTaskList();
        this.initDataFromCardDetail();
        this.initAccording();
      });
    })
  }

  initDataFromCardDetail() {
    if (this.card?.cardTypeId) {
      this.getStatus();
      this.getCardCategories();
    }

    if (this.card?.categoryId && this.card?.categoryId !== this.defaultEmptyGuid) {
      this.cardCategoriesService.get(this.card.categoryId, {
        skipHandleError: true
      }).subscribe((res) => {
        this.getReasons(res.reasonsDataSource);
      }, () => {
        this.cardForm.patchValue({categoryId: null});
        this.card.categoryId = null;
      })
    }

    if (this.card?.currentStateId) {
      this.stateService.get(this.card.currentStateId).subscribe((res) => {
        this.status = res.name;
      })
    }
    if (this.card?.creatorId) {
      this.identityUserService.get(this.card.creatorId).subscribe((res) => {
        this.createdUser = res;
      })
    }
    if (this.card?.teams.length) {
      this.cardForm.patchValue({teams: this.card.teams});
      this.userService.get(this.card.teams.map((item) => item.memberId)).subscribe((res) => {
        res.forEach((user) => {
          this.addUserToUserMap(user);
        })
      })
    }
    if (this.card?.attachments.length) {
      this.card.attachments.forEach((item) => {
        if (item.fileId) {
          this.fileService.get(item.fileId)
            .subscribe((res: any) => {
              const url = URL.createObjectURL(DashboardUtils.convertBase64ToBlob(res));
              if (!this.attachmentMap.has(item.fileId)) {
                this.attachmentMap.set(item.fileId, url);
              }
            })
         }
      })
      this.generalAttachments = this.card.attachments.filter((item) => item.attachmentType === AttachmentType.General);
      this.rootCauseAnalysisAttachments = this.card.attachments.filter((item) => item.attachmentType === AttachmentType.RootCauseAnalysis);
      this.taskAttachments = this.card.attachments.filter((item) => item.attachmentType === AttachmentType.Task);
      this.cardForm.patchValue({attachments: [...this.generalAttachments]});
    }

    // check if data tier and data tier ID exist
    if (this.card?.dataTierType && this.card?.dataTierId) {
      switch(this.card.dataTierType) {
        case DataTierTypes.Site:
          this.siteService.get(this.card.dataTierId, { skipHandleError: true }).subscribe((res) => {
            if (!res) {
              this.cardForm.patchValue({dataTierId: null});
              this.card.dataTierId = null;
            }
          },() => {
            this.cardForm.patchValue({dataTierId: null});
            this.card.dataTierId = null;
          })
          break;
        case DataTierTypes.Area:
          this.areaService.get(this.card.dataTierId, { skipHandleError: true }).subscribe((res) => {
            if (!res) {
              this.cardForm.patchValue({dataTierId: null});
              this.card.dataTierId = null;
            }
          },() => {
            this.cardForm.patchValue({dataTierId: null});
            this.card.dataTierId = null;
          })
          break;
        case DataTierTypes.Cell:
          this.cellSeervice.get(this.card.dataTierId, { skipHandleError: true }).subscribe((res) => {
            if (!res) {
              this.cardForm.patchValue({dataTierId: null});
              this.card.dataTierId = null;
            }
          }, () => {
            this.cardForm.patchValue({dataTierId: null});
            this.card.dataTierId = null;
          })
          break;
        default:
          break;
      }
    }

    if (this.card?.originalDataTierType && this.card?.originalDataTierId) {
      switch(this.card.originalDataTierType) {
        case DataTierTypes.Site:
          this.siteService.get(this.card.originalDataTierId, { skipHandleError: true }).subscribe((res) => {
            this.originalDataTier = res;
          })
          break;
        case DataTierTypes.Area:
          this.areaService.get(this.card.originalDataTierId, { skipHandleError: true }).subscribe((res) => {
            this.originalDataTier = res;
          })
          break;
        case DataTierTypes.Cell:
          this.cellSeervice.get(this.card.originalDataTierId, { skipHandleError: true }).subscribe((res) => {
            this.originalDataTier = res;
          })
          break;
        default:
          break;
      }
    }
    if (this.card?.comments.length) {
      let ids = this.card.comments.map((item) => item.creatorId).filter((item) => !this.selectedUserMap.has(item) || !this.commentUserAvaMap.has(item));
      // convert UTC time to tenant time
      this.card.comments.forEach((comment) => {
        comment.creationTime = this.getTenantTimezoneService.getDateWithOffset(new Date(comment.creationTime+'Z'), this.timeZoneOffset, true);
      })
      ids = [...new Set(ids)];
      this.userService.get(ids).subscribe((res) => {
        res.forEach((user) => {
          this.addUserToUserMap(user);
          // get comment user profile pictures
          if (!this.commentUserAvaMap.has(user.id)) {
            this.profilePictureService.get(user.id).subscribe((res) => {
              if (res && res.fileContent){
                this.commentUserAvaMap.set(user.id, res.fileContent);
              } else {
                this.commentUserAvaMap.set(user.id, null);
              }
            })
          }
        })
      })
    }
    // if (this.card?.rootCauseAnalysiss.length) {
    //   const ids = this.card.rootCauseAnalysiss.map((item) => item.creatorId).filter((item) => !this.selectedUserMap.has(item));
    //   this.userService.get(ids).subscribe((res) => {
    //     res.forEach((user) => {
    //       this.addUserToUserMap(user);
    //     })
    //   })
    // }

    if (this.card?.tasks.length) {
      const ids = this.card.tasks.filter(item => item.ownerId).map((item) => item.ownerId).filter((item) => !this.selectedUserMap.has(item));
      this.userService.get(ids).subscribe((res) => {
        res.forEach((user) => {
          this.addUserToUserMap(user);
          if (!this.users.find((u) => u.id === user.id)) {
            this.users = [...this.users, user];
          }
        })
      })
    }
  }

  getUserDisplayName(user: any) {
    return DashboardUtils.getUserDisplayName(user);
  }

  getCommentUser(id: string, initial = false) {
    if (id && this.selectedUserMap.has(id)) {
      const user = this.selectedUserMap.get(id);
      if (!initial) {
        return DashboardUtils.getUserDisplayName(user);
      } else {
        // // if fullname exist, get the first word and last word 's first character
        // if (fullName.replace(/\s+/g, '')) {
        //   const words = fullName.split(', ');
        //   if (words.length > 1) {
        //     return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`;
        //   } else {
        //     return `${words[0].charAt(0)}`;
        //   }
        // } else {
          return user['userName'].slice(0,2);
        // }
      }
    }
  }

  copyLink() {
    if (this.card?.code) {
      const link = `${window.location.origin}/#/dashboard/card/${this.card?.code}`;
      navigator.clipboard.writeText(link).then(() => {
        this.toasterService.success('::LABEL_LinkCopied');
      });
    }
  }

  buildCardForm() {
    this.cardForm = this.fb.group({
      instructions: [this.card?.instructions || '', Validators.required],
      longInstruction: [this.card?.longInstruction || '', Validators.required],
      cardTypeId: [this.card?.cardTypeId || '', Validators.required],
      priorityId: [this.card?.priorityId || ''],
      currentStateId: [this.card?.currentStateId || '',],
      dataTierType: [this.card?.dataTierType || '', Validators.required],
      dataTierId: [this.card?.dataTierId || '', Validators.required],
      categoryId: [this.card?.categoryId || ''],
      reasonCode: [this.card?.reasonCode || ''],
      location: [this.card?.location || ''],
      onSupport: [this.card?.onSupport || false],
      assignedOwnerId: [this.card?.assignedOwnerId || ''],
      teams: [this.card?.teams || []],
      incidentDate: [this.card?.incidentDate ? new Date(this.card?.incidentDate?.split('T')[0]) : ''],
      results: [this.card?.results || ''],
      valueRealization: [this.card?.valueRealization || false],
      externalProjectNo: [this.card?.externalProjectNo || ''],
      attachments: [this.card?.attachments || []],
      assessmentId: [this.card?.assessmentId || ''],
      assessmentResultId: [this.card?.assessmentResultId || ''],
    });
    if (this.card?.rootCauseAnalysiss && this.card?.rootCauseAnalysiss?.length) {
      this.card.rootCauseAnalysiss.forEach((item) => {
        if (!item?.category) {
          item.category = 'Occurrences'
        }
      })
    }
    if (!this.card?.rootCauseAnalysiss || !this.card?.rootCauseAnalysiss?.length) {
      this.card.rootCauseAnalysiss = [{
        cardId: this.card.id,
        why: '• \n• \n• \n• \n•',
        category: 'Occurrences',
        creationTime: new Date(),
        creatorId: this.currentUser.id
      }]
    }
    this.card.tasks = this.card?.tasks || [];
    this.card.comments = this.card?.comments || [];
    this.card.teams = this.card?.teams || [];
    this.card.attachments = this.card?.attachments || [];
  }

  displayCheck() {
    return true;
  }

  registSearchDebounce() {
    // user input search input debounce
    this.userSearchInput$
    .pipe(debounceTime(this.debounceTime))
    .subscribe((searchItem) => {
        this.getUsers(searchItem);
    })
  }

  getDependencyModeling() {
    this.getCardTypes();
    this.getUsers();
    this.getCardCategories();
    this.getStatus();
    this.getCardPriorities();
  }

  getAssessmentType() {
    const assessmentType$ = this.card?.assessmentId ? 
      this.assessmentService.get(this.card.assessmentId).pipe(
        switchMap(assessment => this.assessmentTypeService.get(assessment.typeId)),
        map(type => ({ assessmentTypeName: type.displayName }))
      ) : 
      of({ assessmentTypeName: null });

    const assessmentResult$ = this.card?.assessmentResultId ? 
      this.assessmentResultService.get(this.card.assessmentResultId).pipe(
        map(result => ({ assessmentQuestion: result.question }))
      ) : 
      of({ assessmentQuestion: null });

    forkJoin({
      typeData: assessmentType$,
      resultData: assessmentResult$
    })
    .subscribe(({ typeData, resultData }) => {
      if (typeData.assessmentTypeName) {
        this.assessmentTypeName = typeData.assessmentTypeName;
      }
      if (resultData.assessmentQuestion) {
        this.assessmentQuestion = resultData.assessmentQuestion;
      }
    });
  }

  getCardTypes() {
    this.cardTypeService.getList({maxResultCount: 999}).subscribe((res) => {
      this.cardTypes = res.items;
      if (!this.card.cardTypeId) {
        if (this.defaultCardTypeName) {
          this.selectedCardType = this.cardTypes.find(item => item.name === this.defaultCardTypeName);
        }
        if (!this.selectedCardType) {
          this.selectedCardType = this.cardTypes[0];
        }
        this.cardForm.patchValue({
          cardTypeId: this.selectedCardType?.id,
        });
        this.getStatus();
        this.getCardCategories();
      }
    })
  }

  getStatus() {
    if (!this.selectedCardType) {
      return;
    } else if(!this.card?.id){
      this.stateService.get( this.selectedCardType.initialStatusId).subscribe((res) => {
        this.status = res.name;
      })
    }
  }

  getUsers(userSearchItem = ''): void {
    this.identityUserService.getList({ filter: userSearchItem, maxResultCount: 10 }).subscribe((res) => {
      this.users = res.items;
      if (this.selectedUserMap.size) {
        for (const [id, selectedUser] of this.selectedUserMap) {
          if (!this.users.find((user) => user.id === id)) {
            this.users = [...this.users, selectedUser];
          }
        }
      }
    });
  }

  getReasons(reasonType: string) {
    this.reasons = [];
    if (reasonType === ReasonsType.LocalDowntimeReason) {
      this.localDowntimeReasonService.getAllInstances().subscribe((res) => {
        this.reasons = res
      })
    } else if (reasonType === ReasonsType.LocalScrapReason) {
      this.localScrapReasonService.getAllInstances().subscribe((res) => {
        this.reasons = res
      })
    }
    else {
      const categoryId = this.cardForm.get('categoryId').value;
      if (categoryId) {
        this.activityCardReasonService.getList({
          maxResultCount: 999,
          cardCategoryId: categoryId
        }).subscribe((res) => {
          this.reasons = res.items;
        });
      }
    }
  }

  // select corresponding modeling based on selected data tier
  dataTierChange() {

  }

  getCardCategories() {
    this.inProgress = true;
    if (!this.selectedCardType) {
      return;
    } else {
      this.cardCategoriesService.getList({cardTypeId: this.selectedCardType.id, maxResultCount: 999}).subscribe((res) => {
        this.cardCategories = res.items;
        this.inProgress = false;
      })
    }
  }

  userChange(user: IdentityUserDto) {

  }

  addUserToUserMap(user: IdentityUserDto | UserGroupUsersDto | CurrentUserDto, field = 'id') {
    if (!this.selectedUserMap.has(user[field])) {
      if (user.hasOwnProperty('surname')) {
        this.selectedUserMap.set(user[field], user);
      } else {
        this.identityUserService.get(user[field]).subscribe((res) => {
          this.selectedUserMap.set(user[field], res);
        });
      }
    }
    // get current user response in constructor response maybe done after get users response and before task owner response
    // in that case, current user will not in users list but in selectedUserMap, then task owner will not request current user again and missed in users list
    // so when add to users map, check if user not in users list, add to users list to make use not miss current user
    // in this case, users list will always contain current user but not depend on the response order
    if (!this.users.find((u) => u.id === user[field])) {
      this.users = [...this.users, user];
    }
  }

  // attachments
  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.uploadFile = file;
    }
    this.uploadImage(htmlEl);
  }

  insertRootcause(e) {
    if(e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 在光标处插入换行符和 "•"
      const textBefore = textarea.value.substring(0, start);
      const textAfter  = textarea.value.substring(end);
      textarea.value = textBefore + '\n• ' + textAfter;

      // 将光标位置移动到新插入的符号之后
      textarea.selectionStart = textarea.selectionEnd = start + 3;
    }
  }

  selectedAttchmentsChange(e, id: string, type) {
    if (e.target.checked) {
      if (type === AttachmentType.Task) {
        this.selectedTaskAttachments = [...this.selectedTaskAttachments, id];
      } else if (type === AttachmentType.RootCauseAnalysis) {
        this.selectedRootAttachments = [...this.selectedRootAttachments, id];
      }
    } else {
      if (type === AttachmentType.Task) {
        this.selectedTaskAttachments = this.selectedTaskAttachments.filter((item) => item !== id);
      } else if (type === AttachmentType.RootCauseAnalysis) {
        this.selectedRootAttachments = this.selectedRootAttachments.filter((item) => item !== id);
      }
    }
  }

  attachmentDelete(type: string) {
    if (type === AttachmentType.RootCauseAnalysis) {
      this.rootCauseAnalysisAttachments = this.rootCauseAnalysisAttachments.filter((item) => !this.selectedRootAttachments.includes(item.fileId));
      this.selectedRootAttachments = [];
    } else if (type === AttachmentType.Task) {
      this.taskAttachments = this.taskAttachments.filter((item) => !this.selectedTaskAttachments.includes(item.fileId));
      this.selectedTaskAttachments = [];
    }
    this.generalAttachments = this.card.attachments.filter((item) => item.attachmentType === AttachmentType.General);
    this.card.attachments = [...this.generalAttachments, ...this.rootCauseAnalysisAttachments, ...this.taskAttachments];
    this.cardForm.patchValue({attachments: [...this.generalAttachments]});
  }

  uploadImage(el) {
    if (this.uploadFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const arrayBuffer = reader.result.split(',')[1];
          this.inProgress = true;
          this.fileService.create(this.uploadFile.name, arrayBuffer).subscribe({
            next: res => {
              this.inProgress = false;
              const attachment = {
                  cardId: this.card.id,
                  attachmentType: this.uploadType,
                  fileId: res.url,
                  mimeType: this.uploadFile.type
              }
              this.attachmentMap.set(res.url, <string>reader.result);
              if (this.uploadType === AttachmentType.General) {
                this.generalAttachments = [...this.generalAttachments, attachment];
              } else if (this.uploadType === AttachmentType.RootCauseAnalysis) {
                this.rootCauseAnalysisAttachments = [...this.rootCauseAnalysisAttachments, attachment];
              } else if (this.uploadType === AttachmentType.Task) {
                this.taskAttachments = [...this.taskAttachments, attachment];
              }
              this.generalAttachments = this.card.attachments.filter((item) => item.attachmentType === AttachmentType.General);
              this.card.attachments = [...this.generalAttachments, ...this.rootCauseAnalysisAttachments, ...this.taskAttachments];
              this.cardForm.patchValue({attachments: [...this.generalAttachments]});
              this.isUploadModalOpen = false;
              if (el) {
                el.value = '';
              }
            },
          })
        }

      };
      reader.readAsDataURL(this.uploadFile);
    }
  }

  takePhoto(isEdit: boolean, attachmentType: AttachmentType) {
    this.isTakePhoto = true;
    this.isScan = false;
    Camera.getPhoto({
      quality: 90,
      allowEditing: isEdit,
      resultType: CameraResultType.Uri
    }).then((result) => {
      if (result.webPath) {
        this.convertWebPathToFile(result.webPath).then(file => {
          this.uploadFile = file;
          this.uploadType = attachmentType;
          this.uploadImage(null);
        });
      }
    });
  }

async convertWebPathToFile(webPath: string): Promise<File> {
  const response = await fetch(webPath);
  const blob = await response.blob();
  const fileName = `photo_${new Date().getTime()}.jpg`;
  return new File([blob], fileName, { type: 'image/jpeg' });
}

  saveCard(edit = false) {
    const card = this.cardForm.value as ActivityCardCreateDto;
    if (this.cardForm.invalid) {
      return;
    }
    this.saving = true;
    if (this.card?.id) {
      this.saveRootcCauseAnaly().pipe(
        concatMap(() =>  this.saveCardTask()),
        concatMap(() =>this.saveCardResults()),
        concatMap(() => this.cardService.update(this.card.id, card)),
        finalize(() => this.saving = false)
      ).subscribe((res) => {
          this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
            messageLocalizationParams: [this.info, res.instructions],
          });
          this.cardChange.emit();
          this.cardIdChange.emit(this.card.id);
          // this.card = res;
          this.cardClose.emit();
          // this.card.rootCauseAnalysiss.forEach((item) => {
          //   if (item['edit']) {
          //     delete item['edit'];
          //   }
          // })
      })
      // this.saveCardTask();
      // this.saveRootcCauseAnaly();
      // this.saveCardResults();
      // setTimeout(() => {
      //   this.cardService.update(this.card.id, card).subscribe((res) => {
      //     this.toasterService.success('::LABEL_UpdatedSuccessfully', '', {
      //       messageLocalizationParams: [this.info, res.instructions],
      //     });
      //     this.cardChange.emit();
      //     this.card = res;
      //     this.saving = false;
      //     this.cardClose.emit();
      //   })
      // }, 1000);
    } else {
      this.cardService.create(card)
      .pipe(finalize(() => this.saving = false))
      .subscribe((res) => {
        this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
          messageLocalizationParams: [this.info, res.instructions],
        });
        this.cardChange.emit();
        this.cardForm.patchValue({id: res.id});
        this.cardIdChange.emit(res.id);
        this.card = res;
        this.createdUser = this.currentUser as any as IdentityUserDto;
        this.originalDataTier = this.dataTiers.find((item) => item.id === res.dataTierId);
        if (!edit) {
          this.cardClose.emit();
        } else {
          setTimeout(() => {
            this.openSpecificAccordion(1);
          }, 50);
        }
      })

    }
  }

  // root cause analysis
  addRootCause() {
    this.card.rootCauseAnalysiss = [
      ...this.card.rootCauseAnalysiss,
      {
        cardId: this.card.id,
        why: '• \n• \n• \n• \n•',
        category: 'Occurrences',
        creationTime: new Date(),
        creatorId: this.currentUser.id
      }];
  }

  deleteRootCause(e) {
    this.card.rootCauseAnalysiss = this.card.rootCauseAnalysiss.filter((item) => item !== e);
    if (!this.card?.rootCauseAnalysiss || !this.card?.rootCauseAnalysiss?.length) {
      this.card.rootCauseAnalysiss = [{
        cardId: this.card.id,
        why: '• \n• \n• \n• \n•',
        category: 'Occurrences',
        creationTime: new Date(),
        creatorId: this.currentUser.id
      }]
    }
  }

  saveRootcCauseAnaly() {
    // filter why empty
    this.card.rootCauseAnalysiss = this.card.rootCauseAnalysiss.filter((item) => item.why);
    return this.cardService.updateRootCauseAnalysisByInput({
      cardId: this.card.id,
      rootCauseAnalysisDtos: this.card.rootCauseAnalysiss,
      attachments: this.rootCauseAnalysisAttachments
    })
  }

  // Task
  addCardTask() {
    this.updateCardTaskList = [...this.updateCardTaskList, {
      cardId: this.card.id,
      taskDescription: '',
      ownerId: '',
      dueDate: null,
      originalDueDate: null,
      completeDate: null,
      action: '',
      status: 'Open'
    }];
  }

  openCardTask(task: any) {
    task.status = 'Open';
    task.completeDate = '';
    task.action = task?.id ? 'Update' : 'Create';
  }

  completeCardTask(task: any) {
    if (task && !task.completeDate) {
      task.completeDate = (new Date()).toISOString();
      task.status = 'Completed';
      // this.updateCardTaskList.find((item) => item.id === task.id).completeDate = (new Date()).toISOString();
      // this.saveCardTask();
    }

  }

  cancelCardTask(task: any) {
    task.status = 'Cancelled';
    task.action = task?.id ? 'Update' : 'Create';
  }

  deleteCardTask(e) {
    this.updateCardTaskList = this.updateCardTaskList.filter((item) => item !== e);
  }

  saveCardTask() {
    // filter taskdescrption, ownerId and duedate not empty
    this.updateCardTaskList = this.updateCardTaskList.filter((item) => item.taskDescription);
    // compare card.tasks and updateCardTaskList, get the difference
    let deletedItems = [];
    this.card.tasks.forEach((item) => {
      const updateItem = this.updateCardTaskList.find((updateItem) => updateItem.id === item.id);
      if (updateItem) {
        updateItem.action = 'Update'
      } else {
        item['action'] = 'Delete';
        if (item.id) {
          deletedItems.push(item);
        }
      }
    });
    this.updateCardTaskList.forEach((item) => {
      if (!item.action) {
        item.action = 'Create';
      }
    });
    return this.cardService.updateTasksByInput({
      cardId: this.card.id,
      tasks: [...this.updateCardTaskList, ...deletedItems],
      attachments: this.taskAttachments
    })
  }

  // comment
  scrollToCommentBottom() {
    if (this.commentList) {
      this.commentList.nativeElement.scrollTop = this.commentList.nativeElement.scrollHeight;
    }
  }

  commentEnter($event, commentInput) {
    if ($event.key === 'Enter') {
      if ($event.ctrlKey) {
        commentInput.value += '\n';
        return;
      } else {
        this.addComment(commentInput.value);
        commentInput.value='';
        $event.preventDefault();
      }
    }
  }

  addComment(comment: string) {
    if (!this.card.id || this.saving) {return}
    if (comment) {
      this.cardService.addActivityCardCommentByDto({
        parentId: this.card.id,
        commentText: comment,
        extraProperties: {}
      }).subscribe((res) => {
        // convert local time to tenant time
        this.card.comments = [...this.card.comments, {parentId: this.card.id, commentText: comment, creationTime: this.getTenantTimezoneService.getDateWithOffset(new Date(), this.timeZoneOffset, true), creatorId: this.currentUser.id}];
        this.cardChange.emit();
        if (!this.commentUserAvaMap.has(this.currentUser.id)) {
            this.profilePictureService.get(this.currentUser.id).subscribe((res) => {
              if (res && res.fileContent){
                this.commentUserAvaMap.set(this.currentUser.id, res.fileContent);
              } else {
                this.commentUserAvaMap.set(this.currentUser.id, null);
              }
            })
        }
        this.toasterService.success('::LABEL_CommentAddedSuccessfully');
        setTimeout(() => {
          this.scrollToCommentBottom();
        }, 50);
      })
    }
  }

  // result
  saveCardResults() {
    // if have changes then call api to update
    if (this.card.valueRealization !== this.cardForm.value.valueRealization ||
      this.card.externalProjectNo !== this.cardForm.value.externalProjectNo||
      this.card.results !== this.cardForm.value.results) {
      return this.cardService.updateActivityCardResultByDto({
        cardId: this.card.id,
        results: this.card.results,
        valueRealization: this.card.valueRealization,
        externalProjectNo: this.card.externalProjectNo
      })
    } else {
      return of(null);
    }
  }

  showRequestUpdateForTaskOwner(): boolean {
    return !!this.card?.id &&
    this.updateCardTaskList?.length > 0 &&
    this.updateCardTaskList.some(task => task.status === 'Open' && !['',null, undefined].includes(task.ownerId) && task?.id);
  }

  requestUpdateForCardOwner(requestBody: ActivityCardNotifyInput) {
    this.cardService.notifyCardOwnerByInput(requestBody).subscribe(res => {
      this.toasterService.success('::LABEL_RequestUpdateForCardOwnerSuccessfully');
    });
  }

  requestUpdateForTaskOwner(cardTask: CreateUpdateActivityCardTaskDto) {
    this.cardService.notifyTaskOwnerByInput({
      userId: this.currentUser.id,
      notifyUserIds: cardTask.ownerId ? [cardTask.ownerId] : [],
      activityCardId: this.card.id,
      taskId: cardTask.id,
      baseLink: window.location.origin
    }).subscribe(res => {
      this.toasterService.success('::LABEL_RequestUpdateForTaskOwnerSuccessfully');
    });
  }

  requestUpdateForAllTaskOwner() {
    // only saved and status is Open and ownerId is not empty task could request update
    const taskList = this.updateCardTaskList.filter(item => item.id && item.status === 'Open' && !['', null, undefined].includes(item.ownerId));

    const requestBodyArray = [];
    taskList.forEach(item => {
      requestBodyArray.push({
        userId: this.currentUser.id,
        notifyUserIds: item.ownerId ? [item.ownerId] : [],
        activityCardId: this.card.id,
        taskId: item.id,
        baseLink: window.location.origin
      });
    });

    forkJoin(requestBodyArray.map(item => this.cardService.notifyTaskOwnerByInput(item))).subscribe(responses => {
      this.toasterService.success('::LABEL_RequestUpdateForTaskOwnerSuccessfully');
    });
  }

  openDuplicate() {
    this.isDuplicateModalOpen = true;
  }

  duplicateCard() {
    if(!this.selectedDuplicateDataTierType || !this.selectedDuplicateDataTier) {
      return;
    }
    this.cardService.duplicateActivityCard({
      cardId: this.card.id,
      dataTierType: this.selectedDuplicateDataTierType,
      dataTierId: this.selectedDuplicateDataTier,
      userId: this.currentUser.id
    }).subscribe(res => {
      this.isDuplicateModalOpen = false;
      this.toasterService.success('::LABEL_CardDuplicatedSuccessfully');
    });

  }

  getUserAssignedAreasAndCells(event: any) {
    this.userAssignedAreasAndCells = event;
  }

  getDataTiers(event) {
    if (event === DuplicateDataTierType.Area) {
      this.duplicatedataTiers = this.userAssignedAreasAndCells.areas;
      this.selectedDuplicateDataTier = null;
    }

    if (event === DuplicateDataTierType.Cell) {
      this.duplicatedataTiers = this.userAssignedAreasAndCells.cells;
      this.selectedDuplicateDataTier = null;
    }
  }

}
