import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityCardCategoryService, ActivityCardPriorityService, ActivityCardService, ActivityCardSettingsService, ActivityCardTypeService, StateService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardCreateDto, ActivityCardDto, ActivityCardPriorityDto, ActivityCardSettingsDto, ActivityCardTypeDto, LocalDowntimeReasonDto } from '@apis/ticket/dtos';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { UserGroupUsersDto } from '@proxy/dtos/user-group';
import { ConfigStateService, CurrentUserDto, LocalizationService } from '@abp/ng.core';
import { LocalDowntimeReasonService, LocalScrapReasonService } from '@apis/general';
import { debounceTime, Subject } from 'rxjs';
import { AreaDto, CellDto, SiteDto } from '@apis/corporate/dtos';
import { TreeviewAssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { UserService } from '@proxy/services';
import { AreaService, CellService, SiteService } from '@apis/corporate';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { FileService } from '../services/file.service';
import { ToasterService } from '@abp/ng.theme.shared';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentGuidelineDto, AssessmentTypeDto } from '@apis/ticket/assessment-management/dtos';
import { AssessmentTypeService } from '@apis/ticket/assessment-management';
import { DashboardUtils } from 'src/app/dashboard/utils';

enum ReasonsType {
  LocalDowntimeReason = 'LocalDowntimeReason',
  LocalScrapReason = 'LocalScrapReason'
}

enum DataTierTypes {
  Site = 'Site',
  Area = 'Area',
  Cell = 'Cell'
}
@Component({
  selector: 'app-mobile-card-creator',
  templateUrl: './mobile-card-creator.component.html',
  styleUrl: './mobile-card-creator.component.scss'
})
export class MobileCardCreatorComponent implements OnInit {
  @Input() initialCardData: any;
  @Input() hideBackButton: boolean = false;
  cardTypes: ActivityCardTypeDto[] = [];
  selectedCardType: ActivityCardTypeDto;
  cardForm: FormGroup;
  status = '';
  users: IdentityUserDto[] | UserGroupUsersDto[] = [];
  selectedUserMap = new Map<string, IdentityUserDto | UserGroupUsersDto | CurrentUserDto>();
  cardCategories: ActivityCardCategoryDto[] = [];
  reasons: LocalDowntimeReasonDto[] = [];
  userSearchInput$ = new Subject<string | null>();
  cardPriorities: ActivityCardPriorityDto[] = [];
  dataTierTypes = Object.keys(DataTierTypes);
  dataTiers: SiteDto[] | AreaDto[] | CellDto[] = [];
  siteData: SiteDto;
  areas: AreaDto[] = [];
  cells: CellDto[] = [];
  sites: SiteDto[] = [];
  assignedDataTiers: TreeviewAssignedDataTierDto[] = [];
  tenantInfo: any;
  currentUser: CurrentUserDto | IdentityUserDto;
  defaultDataTier: TreeviewAssignedDataTierDto;
  debounceTime = 500;
  cardSettings: ActivityCardSettingsDto[] = [];
  uploadFile: File;
  generalAttachments: any[] = [];
  info: string;
  card: ActivityCardDto;
  attachmentMap = new Map<string, string>();
  selectedAttachments: string[] = [];
  isAttachmentPreviewOpen = false;
  previewAttachmentId: string = null;
  assessmentTypes: AssessmentTypeDto[] = [];
  assessmentQuestions: AssessmentGuidelineDto[] = [];

  constructor(private cardCategoriesService: ActivityCardCategoryService,
    private cardTypeService: ActivityCardTypeService,
    private identityUserService: IdentityUserService,
    private stateService: StateService,
    private fb: FormBuilder,
    private localScrapReasonService: LocalScrapReasonService,
    private localDowntimeReasonService: LocalDowntimeReasonService,
    private cardPriorityService: ActivityCardPriorityService,
    private userService: UserService,
    private siteService: SiteService,
    private areaService: AreaService,
    private cellSeervice: CellService,
    private configService: ConfigStateService,
    private cardSettingService: ActivityCardSettingsService,
    private fileService: FileService,
    private cardService: ActivityCardService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private route: ActivatedRoute,
    private router: Router,
    private assessmentTypeService: AssessmentTypeService,
    @Optional() public activeModal: NgbActiveModal
  ) {
    this.currentUser = this.configService.getOne('currentUser');
    this.tenantInfo = this.configService.getOne('extraProperties');
  }

  ngOnInit(): void {
    this.buildCardForm();
    this.getDependencyModeling();
    this.registSearchDebounce();
   
    if (this.initialCardData) {
      this.processInitialCardData();
    } else {
      this.route.queryParams.subscribe(params => {
        if (params?.id) {
          this.getCardById(params.id);
        }
      });
    }
    
    this.localizationService.get('::LABLE_ActivityCard').subscribe(data => {
      this.info = data
    });
  }

  /**
 * Processes initial card data from assessment component.
 * Handles complex async coordination between data tier prefilling and card type setup.
 */
  processInitialCardData(): void {
  // Handle data tier prefilling first (most complex due to async dependencies)
  if (this.initialCardData.dataTierType && this.initialCardData.dataTierId) {
    this.waitForDataTiersAndSetValues();
  }

    if (this.initialCardData.cardTypeId) {
      this.cardTypeService.get(this.initialCardData.cardTypeId).subscribe(res => {
        this.selectedCardType = res;
        this.getStatus();
        this.getCardCategories();

        if (this.selectedCardType?.assessmentField !== 'Hidden') {
          this.getAssessmentTypes();
        }
        
        // Delay form value setting to ensure data tier processing completes first
        setTimeout(() => {
          this.setFormValuesAndProcessData();
        }, 200);
      });
    } else {
      this.cardForm.patchValue(this.initialCardData);
    }
    
    // Convert assessment photos to activity card attachments
    if (this.initialCardData.assessmentData?.photos?.length > 0) {
      this.processAssessmentPhotos();
    }

    // Load owner information for prefill
    const ownerId = this.initialCardData.assignedOwnerId;
    if (ownerId) {
      this.loadAndSetOwner(ownerId);
    }
  }

  private waitForDataTiersAndSetValues(): void {
  const checkDataTiers = () => {
    if (this.assignedDataTiers.length > 0) {
      
      // Step 1: Set data tier type first
      this.cardForm.patchValue({
        dataTierType: this.initialCardData.dataTierType
      });
      
      setTimeout(() => {
        // Step 2: Manually trigger getDataTiers() to populate dropdown options
        // (patchValue doesn't trigger HTML change events)
        this.getDataTiers();
        setTimeout(() => {
          // Step 3: Set specific data tier ID after options are populated
          this.cardForm.patchValue({
            dataTierId: this.initialCardData.dataTierId
          });
          
        }, 100);
      }, 100);
    } else {
      // Keep polling until assignedDataTiers are loaded
      setTimeout(checkDataTiers, 100);
    }
  };
  
  checkDataTiers();
}

  private setFormValuesAndProcessData(): void {
    if (this.initialCardData.assessmentData?.assessmentTypeId) {
      this.assessmentTypeService.get(this.initialCardData.assessmentData.assessmentTypeId).subscribe({
        next: (assessmentType) => {
          this.assessmentQuestions = assessmentType.guideLines?.sort((a, b) => a.questionNo - b.questionNo) || [];
          this.setFormValues();
        },
        error: (error) => {
          console.error('Failed to load assessment questions:', error);
          this.setFormValues();
        }
      });
    } else {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    const currentPriorityId = this.cardForm.get('priorityId')?.value;
    this.cardForm.patchValue({
      priorityId: this.initialCardData.priorityId || currentPriorityId || '',
      instructions: this.initialCardData.instructions,
      longInstruction: this.initialCardData.longInstruction,
      cardTypeId: this.initialCardData.cardTypeId,
      categoryId: this.initialCardData.categoryId,
      assignedOwnerId: this.initialCardData.assignedOwnerId,
      assessmentTypeId: this.initialCardData.assessmentData?.assessmentTypeId,
      assessmentQuestionId: this.initialCardData.assessmentData?.questionId,
      assessmentId: this.initialCardData.assessmentData?.assessmentId,
      assessmentResultId: this.initialCardData.assessmentData?.AssessResultId,
    });
    
    if (this.initialCardData.assessmentData?.assessmentTypeId) {
      this.onAssessmentTypeChange(this.initialCardData.assessmentData.assessmentTypeId);
    }
  }

  loadAndSetOwner(ownerId: string): void {
    if (!ownerId) return;
    
    const existingUser = this.users.find(user => user.id === ownerId);
    if (existingUser) {
      this.addUserToUserMap(existingUser);
      return;
    }
    
    this.identityUserService.get(ownerId).subscribe(res => {
      this.addUserToUserMap(res);
      if (!this.users.find(user => user.id === res.id)) {
        this.users = [...this.users, res];
      }
    });
  }

  processAssessmentPhotos(): void {
    const assessmentPhotos = this.initialCardData.assessmentData.photos;

    //Upload photos of the assessment card to Fileservice
    const uploadPromises = assessmentPhotos.map(photo => {
      const base64Data = photo.attachment.split(',')[1];
      const fileName = `assessment_photo_${photo.id}.${this.getFileExtension(photo.mimeType)}`;

      return this.fileService.create(fileName, base64Data).toPromise().then(res => ({
        attachmentType: 'General',
        fileId: res.url,
        mimeType: photo.mimeType,
      }));
    });

    Promise.all(uploadPromises).then(attachments => {
      this.generalAttachments = [...attachments];
      this.cardForm.patchValue({ attachments: this.generalAttachments });

      attachments.forEach((attachment, index) => {
        this.attachmentMap.set(attachment.fileId, assessmentPhotos[index].attachment);
      });
    });
  }

  private getFileExtension(mimeType: string): string {
    const extensions = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    return extensions[mimeType] || 'jpg';
  }

  getCardById(cardId) {
    this.cardService.getActivityCardByInput({
      cardId: cardId,
      includeRootCauseAnalysis: true,
      includeTasks: true,
      includeComments: true
    }).subscribe((res) => {
      this.card = res;
      this.buildCardForm();
      this.cardTypeService.get(this.card.cardTypeId).subscribe((res) => {
        this.selectedCardType = res;
        if (this.card?.cardTypeId) {
          this.getStatus();
          this.getCardCategories();
        }
        if (this.card?.categoryId) {
          this.cardCategoriesService.get(this.card.categoryId).subscribe((res) => {
            this.getReasons(res.reasonsDataSource);
          })
        }
        if (this.card?.assignedOwnerId) {
          this.identityUserService.get(this.card.assignedOwnerId).subscribe((res) => {
            this.addUserToUserMap(res);
            if (!this.users.find((user) => user.id === res.id)) {
              this.users = [...this.users, res];
            }
          })
        }
      });
    })
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
    this.getUserDataTiers();
    this.getCardTypes();
    this.getUsers();
    //this.getCardCategories();
    this.getStatus();
    this.getCardSettings();
    this.getCardPriorities();
  }

  getCardPriorities() {
    if (!this.cardPriorities.length) {
      this.cardPriorityService.getList({ maxResultCount: 50 }).subscribe((res) => {
        this.cardPriorities = res.items;
      })
    }
  }

  getCardTypes() {
    this.cardTypeService.getList({ maxResultCount: 10 }).subscribe((res) => {
      this.cardTypes = res.items;
      
      if (!this.initialCardData && !this.card?.cardTypeId) {
        this.selectedCardType = this.cardTypes[0];
        this.cardForm.patchValue({
          cardTypeId: this.selectedCardType.id,
        });
        this.getStatus();
        this.getCardCategories();
      }
    });
  }

  getStatus() {
    if (!this.selectedCardType) {
      return;
    } else {
      this.stateService.get(this.selectedCardType.initialStatusId).subscribe((res) => {
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

  getCardCategories() {
    if (!this.selectedCardType) {
      return;
    } else {
      this.cardCategoriesService.getList({ cardTypeId: this.selectedCardType.id, maxResultCount: 50 }).subscribe((res) => {
        this.cardCategories = res.items;
      })
    }
  }

  onCardTypeChange(e, userAction = true) {
    this.selectedCardType = e;
    this.getStatus();
    if (userAction) {
      this.cardForm.patchValue({ categoryId: null });
      this.cardForm.patchValue({ reasonCode: null });
      this.cardForm.patchValue({ assessmentTypeId: null });
      this.cardForm.patchValue({ assessmentQuestionId: null });
    }
    this.getCardCategories();
    
    if (this.selectedCardType?.assessmentField !== 'Hidden') {
      this.getAssessmentTypes();
    }
  }

  getReasons(reasonType: string) {
    this.reasons = [];
    if (reasonType === ReasonsType.LocalDowntimeReason) {
      this.localDowntimeReasonService.getList({ maxResultCount: 50 }).subscribe((res) => {
        this.reasons = res.items
      })
    } else if (reasonType === ReasonsType.LocalScrapReason) {
      this.localScrapReasonService.getList({ maxResultCount: 50 }).subscribe((res) => {
        this.reasons = res.items
      })
    }
  }

  getCardSettings() {
    if (!this.cardSettings.length) {
      this.cardSettingService.getList({ maxResultCount: 100 }).subscribe((res) => {
        this.cardSettings = res.items
      })
    }
  }

  getDataTiers() {
  const isPrefilledData = this.initialCardData?.dataTierId;
  if (!isPrefilledData) {
    this.cardForm.patchValue({ dataTierId: null });
  }

  if (this.cardForm.get('dataTierType')?.value === DataTierTypes.Site) {
    this.dataTiers = this.siteData ? [this.siteData] : [];
  } else if (this.cardForm.get('dataTierType')?.value === DataTierTypes.Area) {
    if (this.areas.length > 0) {
      this.dataTiers = this.areas;
    } else {
      this.buildAreasFromAssigned();
    }
  } else if (this.cardForm.get('dataTierType')?.value === DataTierTypes.Cell) {
    if (this.cells.length > 0) {
      this.dataTiers = this.cells;
    } else {
      this.buildCellsFromAssigned();
    }
  } else {
    this.dataTiers = [];
  }

}

private buildAreasFromAssigned(): void {
  if (this.assignedDataTiers.length > 0) {
    const areaMap = new Map();
    
    this.assignedDataTiers.forEach(tier => {
      if (tier.areaId && tier.areaName) {
        areaMap.set(tier.areaId, {
          id: tier.areaId,
          name: tier.areaName,
          displayName: tier.areaName
        });
      }
    });
    
    const areasFromAssigned = Array.from(areaMap.values());
    this.areas = areasFromAssigned;
    this.dataTiers = this.areas;
    
  } else {
    console.warn('No assignedDataTiers available for building areas');
  }
}

private buildCellsFromAssigned(): void {
  if (this.assignedDataTiers.length > 0) {
    const cellMap = new Map();
    
    this.assignedDataTiers.forEach(tier => {
      if (tier.dataTierId && tier.dataTierName && tier.dataTierType === 'Cell') {
        cellMap.set(tier.dataTierId, {
          id: tier.dataTierId,
          name: tier.dataTierName,
          displayName: tier.dataTierName
        });
      }
    });
    
    const cellsFromAssigned = Array.from(cellMap.values());
    this.cells = cellsFromAssigned;
    this.dataTiers = this.cells;
    
  } else {
    console.warn('No assignedDataTiers available for building cells');
  }
}

  getUserDataTiers() {
    if (!this.assignedDataTiers.length) {
      this.userService.getTreeviewDataTiersByUser(this.configService.getOne('currentUser').id).subscribe(res => {
        this.assignedDataTiers = res.assignedDataTiers;
        const area = res.assignedDataTiers
          .filter(d => d.areaId)
          .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area' }))
          .filter((value, index, self) =>
            index === self.findIndex((t) => (
              t.id === value.id && t.name === value.name
            ))
          );
        this.areaService.getTreeViewList({ ids: area.map(d => d.id), tenantDataTierID: this.tenantInfo?.DataTierId, tenantDataTierType: this.tenantInfo?.DataTierType }).subscribe(response => {
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
          this.areas = assignedDataTiers.filter(x => x.children.length > 0);
          this.areas.forEach(area => {
            if (area.cells && area.cells.length > 0) {
              this.cells = [...this.cells, ...area.cells];
            }
          });

          if (this.tenantInfo && this.tenantInfo?.DataTierType === 'Site') {
            this.siteService.get(this.tenantInfo.DataTierId).subscribe(res => {
              this.siteData = res;
              this.sites = [res];
            })
          }

          if (res.defaultDataTier?.dataTierType && res.defaultDataTier?.dataTierId) {
            this.defaultDataTier = res.defaultDataTier;
            // for edit, need set default data tier values
            const shouldSetDefaults = !this.card?.id && 
                                     (!this.initialCardData?.dataTierType || !this.initialCardData?.dataTierId);
            if (shouldSetDefaults) {
              this.cardForm.patchValue({ dataTierType: this.defaultDataTier.dataTierType });
              this.cardForm.patchValue({ dataTierId: this.defaultDataTier.dataTierId });
              
              if (this.defaultDataTier?.dataTierType === DataTierTypes.Site) {
                this.dataTiers = this.sites;
                if (this.sites.length === 0) {
                  this.siteService.get(this.cardForm.get('dataTierId')?.value).subscribe((res) => {
                    this.dataTiers = [res];
                  })
                }
              } else if (this.defaultDataTier?.dataTierType === DataTierTypes.Area) {
                this.dataTiers = this.areas;
              } else if (this.defaultDataTier?.dataTierType === DataTierTypes.Cell) {
                this.dataTiers = this.cells;
              }
            }
          }
        })
      });
    }
  }

  buildCardForm() {
    this.cardForm = this.fb.group({
      instructions: [this.initialCardData?.instructions || this.card?.instructions || '', Validators.required],
      longInstruction: [this.initialCardData?.longInstruction || this.card?.longInstruction || '', Validators.required],
      cardTypeId: [this.initialCardData?.cardTypeId || this.card?.cardTypeId || '', Validators.required],
      priorityId: [this.initialCardData?.priorityId || this.card?.priorityId || ''],
      currentStateId: [this.card?.currentStateId || ''],
      dataTierType: [this.initialCardData?.dataTierType || this.card?.dataTierType || '', Validators.required],
      dataTierId: [this.initialCardData?.dataTierId || this.card?.dataTierId || '', Validators.required],
      categoryId: [this.initialCardData?.categoryId || this.card?.categoryId || ''],
      reasonCode: [this.card?.reasonCode || ''],
      location: [this.card?.location || ''],
      onSupport: [this.card?.onSupport || false],
      assignedOwnerId: [this.initialCardData?.assignedOwnerId || this.card?.assignedOwnerId || ''],
      teams: [[]],
      incidentDate: [''],
      results: [''],
      valueRealization: [this.card?.valueRealization || false],
      externalProjectNo: [this.card?.externalProjectNo || ''],
      attachments: [this.card?.attachments || []],
      assessmentId: [this.initialCardData?.assessmentData?.assessmentId || ''],
      assessmentResultId: [this.initialCardData?.assessmentData?.assessmentResultId || ''],
      assessmentTypeId: [this.initialCardData?.assessmentData?.assessmentTypeId || ''],
      assessmentQuestionId: [this.initialCardData?.assessmentData?.questionId || ''],
    });
    
    this.cardForm.get('dataTierId').valueChanges.subscribe((value) => {
      // when data tier change, get the corresponding modeling for default value for new card
      if (!this.card?.id && value && this.assignedDataTiers.length > 0) {
        // find corresponding card settings
        // user site area cell
        if (this.cardForm.get('dataTierType').value === DataTierTypes.Site) {
          this.setDefaultValueByCardSettings(this.cardSettings.find((item) => item.site === value));
        } else {
          if (value) {
            const selectedDataTier = this.assignedDataTiers.find((item) => item.dataTierId === value);
            if (selectedDataTier) {
              this.getRelatedCardSettings(selectedDataTier);
            } else {
              console.warn(`No data tier found for dataTierId: ${value}`);
            }
          }
        }
      }
    });
}

  getRelatedCardSettings(dataTier: TreeviewAssignedDataTierDto) {
    // get card settings based on selected data tier
    if (!dataTier) {
      console.warn('dataTier is undefined in getRelatedCardSettings');
      return;
    }
    
    let cardSetting;
    cardSetting = this.cardSettings.find((item) => item.cell === dataTier.dataTierId);
    if (!cardSetting) {
      cardSetting = this.cardSettings.find((item) => item.area === dataTier.areaId);
    }
    if (!cardSetting) {
      this.areaService.get(dataTier.areaId).subscribe((res) => {
        cardSetting = this.cardSettings.find((item) => item.site === res.site);
        this.setDefaultValueByCardSettings(cardSetting);
      })
    } else {
      this.setDefaultValueByCardSettings(cardSetting);
    }
  }

  setDefaultValueByCardSettings(cardSetting: ActivityCardSettingsDto) {
    if (cardSetting?.defaultPriority) {
      this.cardForm.patchValue({
        priorityId: cardSetting.defaultPriority,
      })
    }
    if (cardSetting?.defaultOwner) {
      if (this.selectedUserMap.has(cardSetting.defaultOwner)) {
        this.cardForm.patchValue({
          assignedOwnerId: cardSetting.defaultOwner,
        })
      } else {
        this.identityUserService.get(cardSetting.defaultOwner).subscribe((res) => {
          this.addUserToUserMap(res);
          if (!this.users.find((user) => user.id === res.id)) {
            this.users = [...this.users, res];
          }
          this.cardForm.patchValue({
            assignedOwnerId: cardSetting.defaultOwner,
          })
        })
      }
    }
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
  }

  getUserDisplayName(user: any): string {
  return DashboardUtils.getUserDisplayName(user);
}

  // attachments
  onFileChange(e: Event) {
    const htmlEl = e.target as HTMLInputElement;
    const file = htmlEl.files[0];
    if (file) {
      this.uploadFile = file;
    }
    this.uploadImage();
  }

  uploadImage() {
    if (this.uploadFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const arrayBuffer = reader.result.split(',')[1];
          this.fileService.create(this.uploadFile.name, arrayBuffer).subscribe({
            next: res => {
              const attachment = {
                attachmentType: 'General',
                fileId: res.url,
                mimeType: this.uploadFile.type
              }
              this.generalAttachments = [...this.generalAttachments, attachment];
              this.cardForm.patchValue({ attachments: [...this.generalAttachments] });
              
              this.attachmentMap.set(res.url, reader.result as string);
            }
          })
        }
      };
      reader.readAsDataURL(this.uploadFile);
    }
  }

  onAttachmentSelectionChange(event: any, fileId: string): void {
    if (event.target.checked) {
      this.selectedAttachments.push(fileId);
    } else {
      this.selectedAttachments = this.selectedAttachments.filter(id => id !== fileId);
    }
  }

  deleteAttachments(): void {
    if (this.selectedAttachments.length === 0) return;
    
    this.generalAttachments = this.generalAttachments.filter(
      attachment => !this.selectedAttachments.includes(attachment.fileId)
    );
    
    this.cardForm.patchValue({ attachments: [...this.generalAttachments] });
    
    this.selectedAttachments = [];
  }

  createCard() {
    if (this.cardForm.invalid || !this.conditionalFieldValid()) {
      return;
    }
    const card = this.cardForm.value as ActivityCardCreateDto;
    card.onSupport = false;
    card.teams = [];
    card.attachments = card.attachments ? card.attachments : [];

    if (this.initialCardData?.assessmentData) {
      card.assessmentId = this.initialCardData.assessmentData.assessmentId;
      card.assessmentResultId = this.initialCardData.assessmentData.assessmentResultId;
    }
    
    this.cardService.create(card).subscribe((res) => {
      this.cardForm.reset();
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.info, res.instructions],
      });
    
      setTimeout(() => {
        if (this.activeModal) {
          this.activeModal.close('cardCreated');
        } else {
          this.returnToAssessment();
        }
      }, 1000);
    });
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
    if (this.selectedCardType?.assessmentField === 'Required') {
      if (!this.cardForm.get('assessmentTypeId').value || !this.cardForm.get('assessmentQuestionId').value) {
        return false;
      }
    }
    return true;
  }

  returnToAssessment() {
  this.closeCard('cancel');
}
  
  closeCard(reason: string) {
    if (this.activeModal) {
      this.activeModal.dismiss(reason);
    } else {
      const params = this.route.snapshot.queryParams;
      if (params.returnTo === 'assessment') {
        this.router.navigate(['/dashboard'], { 
          queryParams: { 
            reopenAssessment: 'true',
            assessmentId: params.assessmentId,
            questionIndex: params.questionIndex
          }
        });
      } else {
        window.history.back();
      }
    }
  }

  getAssessmentTypes() {
    this.assessmentTypeService.getList({ 
      maxResultCount: 50,
    }).subscribe(res => {
      this.assessmentTypes = res.items.filter(x => x.activeRevision && x.globalActiveRevision);
    });
  }

  onAssessmentTypeChange(assessmentTypeId: string) {
    if (!assessmentTypeId) {
      this.assessmentQuestions = [];
      return;
    }

    this.assessmentTypeService.get(assessmentTypeId).subscribe(assessmentType => {
      this.assessmentQuestions = assessmentType.guideLines?.sort((a, b) => a.questionNo - b.questionNo) || [];

      if (!this.initialCardData || !this.initialCardData.assessmentData?.questionId) {
        this.cardForm.patchValue({ assessmentQuestionId: null });
      }
    });
  }
}