import { ConfigStateService, CurrentUserDto, LocalizationService } from '@abp/ng.core';
import { IdentityUserDto, IdentityUserService } from '@abp/ng.identity/proxy';
import { ToasterService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AreaService, CellService, SiteService } from '@apis/corporate';
import { AreaDto, CellDto, SiteDto } from '@apis/corporate/dtos';
import { ActivityCardSettingsService } from '@apis/ticket';
import { ActivityCardCategoryDto, ActivityCardDto, ActivityCardNotifyInput, ActivityCardSettingsDto, ActivityCardTypeDto } from '@apis/ticket/dtos';
import { UserGroupService } from '@proxy';
import { UserGroupDto, UserGroupUsersDto } from '@proxy/dtos/user-group';
import { UserService } from '@proxy/services';
import { debounceTime, Subject } from 'rxjs';
import { PlatformService } from 'src/app/shared/services/platform.service';
import { FileService } from '../services/file.service';
import { DashboardUtils } from '../utils';
import { TreeviewAssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { AppUtils } from 'src/app/modeling/utils/app.utils';
import { Camera, CameraResultType } from '@capacitor/camera';
enum DataTierTypes {
  Site = 'Site',
  Area = 'Area',
  Cell = 'Cell'
}
enum AttachmentType {
  General = 'General',
  RootCauseAnalysis = 'RootCauseAnalysis',
  Task = 'Task'
}

@Component({
  selector: 'app-card-creator',
  template: `
    <form [formGroup]="cardForm">
        <div class="row">
                <div class="col-3">
                    <div class="form-group mb-2">
                        <label for="data-tier-type" [title]="'::INFO_Tier' | abpLocalization">{{'::LABEL_Tier'|abpLocalization}}</label><span> *</span>
                        <ng-select id="data-tier-type" [items]="dataTierTypes" [readonly]="card?.id" appendTo="body"
                        formControlName="dataTierType" (change)="getDataTiers()"
                        placeholder="Select Data Tier Type">
                        </ng-select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-group mb-2">
                        <label for="data-tier" [title]="'::INFO_TierDetails' | abpLocalization">{{'::LABEL_TierDetails'|abpLocalization}}</label><span> *</span>
                        <ng-select id="data-tier" [items]="dataTiers" appendTo="body" [readonly]="card?.id && card?.dataTierId && card?.dataTierType"
                        bindLabel="displayName" bindValue="id" formControlName="dataTierId" placeholder="Select Data Tier">
                        </ng-select>
                    </div>
                </div>
                <div class="col-3" *ngIf="selectedCardType && selectedCardType?.locationField !== 'Hidden'">
                    <div class="form-group mb-2">
                        <label for="location" [title]="'::INFO_Location' | abpLocalization">{{'::LABEL_Location'|abpLocalization}}</label><span *ngIf="selectedCardType?.locationField === 'Required'"> *</span>
                        <input type="text" class="form-control" id="location" formControlName="location" [readonly]="status === 'Completed'"/>
                    </div>
                </div>
                <div class="col-3 d-flex align-items-center">
                    <div class="card-owner mb-2 flex-grow-1">
                        <label for="card-owners" [title]="'::INFO_CardOwner' | abpLocalization">{{'::LABEL_CardOwner'|abpLocalization}}</label>
                        <ng-select id="card-owners" [items]="users" appendTo="body" bindLabel="userName"
                        bindValue="id" [typeahead]="userSearchInput$" formControlName="assignedOwnerId" [readonly]="status === 'Completed'"
                        placeholder="Select Card Owner">
                        <ng-template ng-option-tmp let-item="item">
                            <ng-template #tipContent>{{ item.email }}</ng-template>
                            <span [ngbTooltip]="tipContent" placement="right" container="body" tooltipClass="my-tooltip-class">
                                {{ getUserDisplayName(item) }}
                            </span>
                        </ng-template>
                        <ng-template ng-label-tmp let-item="item">
                            {{getUserDisplayName(item)}}
                        </ng-template>
                        </ng-select>
                    </div>
                    <!-- Request Update for card owner -->
                    <div class="ps-1" *ngIf="card?.id && card?.assignedOwnerId && (status !== 'Completed' && status !== 'Cancelled' && status !== 'Archived')">
                        <span class="cursor-pointer" [tooltip]="'::LABEL_RequestUpdateForCard' | abpLocalization" 
                            placement="bottom" [adaptivePosition]="false" container="body" (click)="requestUpdateForCardOwner()">
                            <i class="fa-solid fa-bell fa-2xl" style="color: #63E6BE;"></i>
                        </span>
                    </div>
                </div>
            <!-- </div> -->
            <div class="col-6">
                <div class="form-group mb-2">
                    <label for="long-description" [title]="'::INFO_Details' | abpLocalization">{{'::Details'|abpLocalization}}</label><span> *</span>
                    <!-- <textarea class="form-control" id="long-description" rows="3" id="long-description"
                    ></textarea> -->
                    <quill-editor id="long-description" [readOnly]="status === 'Completed'" formControlName="longInstruction" [modules]="editorConfig"></quill-editor>
                </div>
            </div>
            <!-- <div class="col-12 col-md-4">
                <div *ngIf="card?.id" class="created-info">
                    <div><span>{{'::LABEL_DateCreated' | abpLocalization}}:
                    </span>{{getLocalDate(card?.creationTime)}}</div>
                    <div><span>{{'::CreatedBy' | abpLocalization}}: </span>{{createdUser?.userName}}</div>
                    <div><span>{{'::LABEL_OriginalDataTier' | abpLocalization}}: </span>{{originalDataTier?.name}}
                    </div>
                </div>
            </div> -->
            <!-- <div class="col-12 col-md-5"> -->
            <!-- <div class="col-12 col-md-12 d-flex flex-sm-wrap"> -->
                <div class="col-3">
                   <div class="user mb-2">
                    <label for="users" [title]="'::INFO_AddMember' | abpLocalization">{{'::LABEL_AddMember'|abpLocalization}}</label>
                    <ng-select id="users" [items]="users" appendTo="body" bindLabel="userName" bindValue="id"
                    [typeahead]="userSearchInput$" (change)="userMemberChange($event)" [readonly]="status === 'Completed'"
                    placeholder="Select User">
                        <ng-template ng-option-tmp let-item="item">
                            <ng-template #tipContent>{{ item.email }}</ng-template>
                            <span [ngbTooltip]="tipContent" placement="right" container="body" tooltipClass="my-tooltip-class">
                                {{ getUserDisplayName(item) }}
                            </span>
                        </ng-template>
                        <ng-template ng-label-tmp let-item="item">
                            {{ getUserDisplayName(item) }}
                        </ng-template>
                    </ng-select>
                     <div class="user-group mb-2">
                        <label for="user-groups" [title]="'::INFO_AddMemberFromUserGroup' | abpLocalization">{{'::LABEL_AddMemberFromUserGroup'|abpLocalization}}</label>
                        <ng-select id="user-groups" [items]="userGroups" appendTo="body" bindLabel="displayName" [readonly]="status === 'Completed'"
                        bindValue="id" (change)="userGroupChange($event)" placeholder="Select User Group">
                        </ng-select>
                    </div>
                </div>

                    <!-- <div class="form-group mb-2">
                        <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="on-support"
                            formControlName="onSupport" />
                        <label for="on-support">{{'::LABEL_Support' | abpLocalization}}</label>
                        </div>
                    </div> -->
                </div>
                <div class="col-3">
                    <div class="form-group mb-2">
                        <label [title]="'::INFO_TeamMembers' | abpLocalization">{{'::LABEL_TeamMembers' | abpLocalization}}</label>
                        <ul class="team-memebers-list">
                        @if (card?.teams?.length === 0) {
                          <li class="no-member" title="No Members"><span>No members</span></li>
                        } @else {
                          @for (member of card?.teams; track member) {
                            <li>
                              <span class="member-name"
                              [title]="selectedUserMap.get(member.memberId)">{{getUserDisplayName(selectedUserMap.get(member.memberId))}}</span>
                              <span class="remove-member"
                              (click)="removeTeamMember(member.memberId)" *ngIf="status !== 'Completed'"><i class="fa fa-close"></i></span>
                            </li>
                          }
                        }
                        </ul>
                    </div>
                </div>

            <!-- </div> -->

            <!-- </div> -->
            <div class="col-12">
            <div class="attachments mb-2">
                <div>
                    <div class="form-group">
                        <span>{{'::MENU_ActivityCardAttachment'|abpLocalization}}
                          @if (status !== 'Completed') {
                            <i class="fas fa-camera-retro fa-lg cursor-pointer" style="color: #fc276b; margin-left: 15px;"
                            [title]="'::LABEL_CapturePhoto' | abpLocalization"
                            (click)="takePhoto(false, AttachmentType.General)"></i>
                            <i class="fas fa-cloud-upload-alt cursor-pointer fa-lg" style="color: #74C0FC; margin-left: 15px;"
                            [title]="'::LABEL_UploadPictures' | abpLocalization"
                            (click)="fileInput.click()"></i>
                          }
                        </span>
                    </div>
                    <div class="col-6 form-group">
                        <input #fileInput id="upload-file" type="file" class="form-control" (change)="uploadType = AttachmentType.General;onFileChange($event)" accept="image/*" style="display: none;" />
                    </div>
                </div>
                <div class="attachment-content">
                    <div class="attachment-title d-flex justify-content-end">
                        <!-- <div>
                            <span class="me-2">{{'::MENU_ActivityCardAttachment'|abpLocalization}}</span>
                            <span *ngIf="!isWeb" class="me-1 camera-upload"><i class="fa fa-camera"></i></span>
                            <span *ngIf="isWeb" title="click to upload" class="photo-upload"
                                (click)="isUploadModalOpen = true; uploadType = AttachmentType.General"><i
                                class="fa fa-image"></i></span>
                        </div> -->
                        <!-- <div> -->
                          <button *ngIf="status !== 'Completed'" class="btn btn-sm" type="button" [disabled]="!selectedAttachments.length" (click)="attachmentDelete(AttachmentType.General)">
                              <i class="fa fa-trash"></i>
                          </button>
                        <!-- </div> -->
                        <!-- <div ngbDropdown>
                            <span class="dropdown-toggle cursor-pointer me-2" ngbDropdownToggle><i
                                class="fa fa-ellipsis-v"></i></span>
                            <div class="dropdown-menu" ngbDropdownMenu>
                                <button ngbDropdownItem  [disabled]="!selectedAttachments.length" (click)="attachmentDelete(AttachmentType.General)">
                                {{ '::Delete' | abpLocalization }}
                              </button>
                            </div>
                        </div> -->
                    </div>
                    <div class="attchment-contains">
                        <div class="row">
                            @for (attachment of generalAttachments; track attachment) {
                            <div class="col-2 img-container" [class.selected]="attachmentCheck.checked">
                                <img (click)="isAttachementPreviewOpen = true; previewAttchmentId = attachment.fileId"
                                [src]="attachmentMap.get(attachment.fileId)" />
                                <input type="checkbox" name="attachment" #attachmentCheck [disabled]="status === 'Completed'"
                                (change)="selectedAttchmentsChange($event, attachment.fileId)" />
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </form>
    <abp-modal [(visible)]="isUploadModalOpen">
        <ng-template #abpHeader>
            <h3>{{'::Add' | abpLocalization}}</h3>
        </ng-template>
        <ng-template #abpBody>
            <div class="form-group">
                <label for="upload-file">{{'::File' | abpLocalization}} </label>
                <input id="upload-file" type="file" class="form-control" (change)="onFileChange($event)" accept="image/*" />
            </div>
            <div class="form-group mt-2">
                <!-- <input type="checkbox" class="form-check-input" id="disclaimer" #disclaimer/> -->
                <label for="" class="form-label text-danger"><span class="fa fa-info-circle"></span> {{'::LABEL_UploadDisclaimer'
                    | abpLocalization}} </label>
            </div>
        </ng-template>
        <ng-template #abpFooter>
            <button type="button" class="btn btn-outline-primary" abpClose>
            {{ '::Cancel' | abpLocalization }}
            </button>
            <button class="btn btn-primary" (click)="uploadImage()" [disabled]="inProgress">
            @if (inProgress) {
                <i class="fa fa-spinner fa-spin"></i>
            {{'::Uploading' | abpLocalization}}
            } @else {
                <i class="fa fa-check"></i>
            {{'::Save' | abpLocalization}}
            }
            </button>
        </ng-template>
    </abp-modal>

    <abp-modal [(visible)]="isAttachementPreviewOpen" [options]="{size: 'fullscreen'}" (keydown.esc)="isAttachementPreviewOpen = false">
        <ng-template #abpHeader>
          <button (click)="isAttachementPreviewOpen = false" class="btn  btn-icon btn-active-color-primary close-button">
            <i class="fa fa-times"></i>
          </button>
        </ng-template>
        <ng-template #abpBody>
            <div class="attachment-preview">
            <img [src]="attachmentMap.get(previewAttchmentId)" />
            </div>
        </ng-template>
    </abp-modal>
  `,
  styleUrl: './card-editor.component.scss'
})
export class CardCreatorComponent implements OnInit {
  @Input() cardForm: FormGroup;
  @Input() selectedCardType: ActivityCardTypeDto;
  cardTypes: ActivityCardTypeDto[] = [];
  @Input() card: ActivityCardDto;
  @Input() filter: any;
  users: IdentityUserDto[] | UserGroupUsersDto[] = [];
  userGroups: UserGroupDto[] = [];
  userSearchInput$ = new Subject<string | null>();
  dataTierInput$ = new Subject<string | null>();
  debounceTime = 500;
  dataTierTypes = Object.keys(DataTierTypes);
  defaultDataTier: TreeviewAssignedDataTierDto;
  dataTiers: SiteDto[] | AreaDto[] | CellDto[] = [];
  sites: SiteDto[] = [];
  areas: AreaDto[] = [];
  cells: CellDto[] = [];
  assignedDataTiers: TreeviewAssignedDataTierDto[] = [];
  cardCategories: ActivityCardCategoryDto[] = [];
  cardSettings: ActivityCardSettingsDto[] = [];
  @Input() status: string;
  info: string;
  createdUser: IdentityUserDto;
  originalDataTier: SiteDto | AreaDto | CellDto;
  editorConfig = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // [{'script': 'sub'}, {'script': 'super'}],
      // [{'indent': '-1'}, {'indent': '+1'}],
      // [{'direction': 'rtl'}],

      [{ 'color': [] }, { 'background': [] }],    // dropdown with defaults from theme

      [{ 'align': [] }],

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
  taskAttachments: any[] = [];
  isAttachementPreviewOpen = false;
  previewAttchmentId: string;
  inProgress = false;
  @Output() inProgressChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedAttachments: string[] = [];
  currentUser: CurrentUserDto | IdentityUserDto;
  tenantInfo: any;
  siteData: SiteDto;
  saving = false;
  isTakePhoto = false;
  isScan = false;
  @Output() requestUpdateForCardOwnerEvent: EventEmitter<ActivityCardNotifyInput> = new EventEmitter<ActivityCardNotifyInput>();
  @Output() userAssignedAreasAndCells: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private identityUserService: IdentityUserService,
    private userService: UserService,
    private userGroupService: UserGroupService,
    private siteService: SiteService,
    private areaService: AreaService,
    private cellSeervice: CellService,
    private cardSettingService: ActivityCardSettingsService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private platformService: PlatformService,
    private fileService: FileService,
    private configService: ConfigStateService,
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
    this.buildCardForm();
    this.getDependencyModeling();
    this.registSearchDebounce();
    this.localizationService.get('::LABLE_ActivityCard').subscribe(data => {
      this.info = data
    });
    if (this.card?.id) {
      //   this.getCardById();
      this.initDataFromCardDetail();
    }
  }

  getUserDisplayName(user: any) {
    return DashboardUtils.getUserDisplayName(user);
  }

  // ngOnChanges(): void {
  //   this.buildCardForm();
  // }


  getLocalDate(date: string | Date) {
    // time string from server based on +00:00, convert to local time
    return date ? new Date(date).toLocaleString() : date;
  }

  initDataFromCardDetail() {
    if (this.card?.assignedOwnerId) {
      this.identityUserService.get(this.card.assignedOwnerId).subscribe((res) => {
        this.addUserToUserMap(res);
        if (!this.users.find((user) => user.id === res.id)) {
          this.users = [...this.users, res];
        }

      })
    }

    if (this.card?.creatorId) {
      this.identityUserService.get(this.card.creatorId).subscribe((res) => {
        this.createdUser = res;
      })
    }
    if (this.card?.teams.length) {
      this.cardForm.patchValue({ teams: this.card.teams });
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
      this.cardForm.patchValue({ attachments: [...this.generalAttachments] });
    }
    if (this.card?.originalDataTierType && this.card?.originalDataTierId) {
      switch (this.card.originalDataTierType) {
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

  }


  buildCardForm() {
    this.card.teams = this.card.teams || [];
    this.card.attachments = this.card.attachments || [];
    this.cardForm.get('dataTierId').valueChanges.subscribe((value) => {
      // when data tier change, get the corresponding modeling for default value for new card
      if (!this.card.id && value && this.cardForm.get('dataTierType').value) {
        // find corresponding card settings
        // user site area cell
        if (this.cardForm.get('dataTierType').value === DataTierTypes.Site) {
          this.setDefaultValueByCardSettings(this.cardSettings.find((item) => item.site === value&& !item.area&&!item.cell));
        }
        else if (this.cardForm.get('dataTierType').value === DataTierTypes.Area) {
          this.setDefaultValueByCardSettings(this.cardSettings.find((item) => item.area === value&&!item.cell));
        }
        else {
          const selectedDataTier = [...this.areas, ...this.cells].find((item) => item.id === value);
          if (selectedDataTier) {
            this.getRelatedCardSettings(selectedDataTier);
          }
        }
      }
    });
  }

  getRelatedCardSettings(dataTier: any) {
    // get card settings based on selected data tier
    let cardSetting;
    // find card settings by cell or area id
    cardSetting = this.cardSettings.find((item) => item.cell === dataTier.id || item.area === dataTier.id);
    // if still not found, find card settings by area id (cell have area id but area not)
    if (!cardSetting && dataTier.area) {
      cardSetting = this.cardSettings.find((item) => item.area === dataTier.area);
    }
    // if still not, then find card settings by site id, first get site id from area id
    if (!cardSetting) {
      let siteId;
      if (dataTier.site) {
        siteId = dataTier.site;
      } else {
        siteId = this.areas.find((item) => item.id === dataTier.area)?.site;
      }
      // this.areaService.getTreeView(dataTier.area || dataTier.id).subscribe((res) => {
      cardSetting = this.cardSettings.find((item) => item.site === siteId);
      this.setDefaultValueByCardSettings(cardSetting);
      // })
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
    this.getUserDataTiers();
    this.getUsers();
    this.getCardSettings();
    this.getUserGroups();

  }

  getCardSettings() {
    if (!this.cardSettings.length) {
      this.cardSettingService.getList({ maxResultCount: 999 }).subscribe((res) => {
        this.cardSettings = res.items;
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

  getUserGroups(): void {
    if (!this.userGroups.length) {
      this.userGroupService.getList({ ids: [], maxResultCount: 999 }).subscribe((res) => {
        this.userGroups = res.items;
      });
    }
  }

  getUserDataTiers() {
    if (!this.assignedDataTiers.length) {
      this.userService.getTreeviewDataTiersByUser(this.currentUser.id).subscribe(res => {
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
            // element.children = element.children.filter(x => !x.disabled);
          });
          // In theory, area should always have cell, cell should have workCenter,
          // not need need filter and also easy to test for QA
          this.areas = assignedDataTiers;
          // this.areas = assignedDataTiers.filter(x => x.children.length > 0);
          assignedDataTiers.forEach(area => {
            if (area.children && area.children.length > 0) {
              area.children.forEach(cell => {
                cell['disabled'] = false;
                this.cells.push(cell);
              });
            }
          });

          // output user assigned data tiers.
          this.userAssignedAreasAndCells.emit({
            areas: this.areas,
            cells: this.cells
          });

          if (this.tenantInfo && this.tenantInfo?.DataTierType === 'Site') {
            this.siteService.get(this.tenantInfo.DataTierId).subscribe(res => {
              this.siteData = res;
              this.sites = [res];
            })
          }

          if (res.defaultDataTier?.dataTierType && res.defaultDataTier?.dataTierId) {
            this.defaultDataTier = res.defaultDataTier;
          }
          // for edit, need set default data tier values
          if (!this.card?.id) {
            this.setDefaultDataTier();
          } else {
            this.setDataTiers(this.cardForm.get('dataTierType')?.value);
          }
        })
      });
    }
  }

  setDefaultDataTier() {
    // data tier from advanced filter -> user default data tier -> empty
    if (this.filter && this.filter.cell && this.filter.cell.length) {
      this.cardForm.patchValue({ dataTierType: DataTierTypes.Cell });
      this.cardForm.patchValue({ dataTierId: this.filter.cell[0] });
    } else if (this.filter && this.filter.area && this.filter.area.length) {
      this.cardForm.patchValue({ dataTierType: DataTierTypes.Area });
      this.cardForm.patchValue({ dataTierId: this.filter.area[0] });
    } else if (this.filter && this.filter.site && typeof this.filter.site === 'string') {
      this.cardForm.patchValue({ dataTierType: DataTierTypes.Site });
      this.cardForm.patchValue({ dataTierId: this.filter.site });
    } else if (this.defaultDataTier?.dataTierType && this.defaultDataTier?.dataTierId) {
      this.cardForm.patchValue({ dataTierType: this.defaultDataTier.dataTierType });
      this.cardForm.patchValue({ dataTierId: this.defaultDataTier.dataTierId });
    }
    this.setDataTiers(this.cardForm.get('dataTierType')?.value);
  }

  setDataTiers(dataTierType: string) {
    if (dataTierType === DataTierTypes.Site) {
      this.dataTiers = this.sites;
      if (this.sites.length === 0) {
        this.siteService.get(this.cardForm.get('dataTierId')?.value).subscribe((res) => {
          this.dataTiers = [res];
        })
      }
    } else if (dataTierType === DataTierTypes.Area) {
      this.dataTiers = this.areas;
    } else if (dataTierType === DataTierTypes.Cell) {
      this.dataTiers = this.cells;
    } else {
      this.dataTiers = [];
    }
  }

  // select corresponding modeling based on selected data tier
  dataTierChange() {

  }

  getDataTiers() {
    this.cardForm.patchValue({ dataTierId: null });
    if (this.cardForm.get('dataTierType')?.value === DataTierTypes.Site) {
      this.dataTiers = this.siteData ? [this.siteData] : [];
    } else if (this.cardForm.get('dataTierType')?.value === DataTierTypes.Area) {
      this.dataTiers = this.areas;
    } else if (this.cardForm.get('dataTierType')?.value === DataTierTypes.Cell) {
      this.dataTiers = this.cells;
    } else {
      this.dataTiers = [];
    }
  }

  userChange(user: IdentityUserDto) {

  }

  userMemberChange(user: IdentityUserDto) {
    if (user) {
      this.addUserToUserMap(user);
      if (this.card.teams.find((item) => item.memberId === user.id)) {
        this.toasterService.error('::LABEL_UserAlreadyAdded');
      } else {
        this.cardForm.patchValue({ teams: [...this.cardForm.value.teams, { cardId: this.card.id, memberId: user.id }] });
        this.card.teams = this.cardForm.value.teams;
      }
    }
  }

  removeTeamMember(id: string) {
    this.card.teams = [...this.card.teams.filter((item) => item.memberId !== id)];
    this.cardForm.patchValue({ teams: [...this.card.teams] });
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

  userGroupChange(userGroup: UserGroupDto) {
    if (userGroup && userGroup.users) {
      userGroup.users.forEach((user) => {
        this.addUserToUserMap(user, 'userId');
        if (this.card.teams.find((item) => item.memberId === user.userId)) {
          // this.toasterService.error('::LABEL_UserAlreadyAdded');
        } else {
          this.cardForm.patchValue({ teams: [...this.cardForm.value.teams, { cardId: this.card.id, memberId: user.userId }] });
          this.card.teams = this.cardForm.value.teams;
        }
      })
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

  selectedAttchmentsChange(e, id: string) {
    this.selectedAttachments = [...this.selectedAttachments, id];
    if (e.target.checked) {
      this.selectedAttachments = [...this.selectedAttachments, id];
    } else {
      this.selectedAttachments = this.selectedAttachments.filter((item) => item !== id);
    }
  }

  attachmentDelete(type: string) {
    if (type === AttachmentType.General) {
      this.generalAttachments = this.generalAttachments.filter((item) => !this.selectedAttachments.includes(item.fileId));
    } else if (type === AttachmentType.RootCauseAnalysis) {
      this.rootCauseAnalysisAttachments = this.rootCauseAnalysisAttachments.filter((item) => !this.selectedAttachments.includes(item.fileId));
    } else if (type === AttachmentType.Task) {
      this.taskAttachments = this.taskAttachments.filter((item) => !this.selectedAttachments.includes(item.fileId));
    }
    this.selectedAttachments = [];
    this.card.attachments = [...this.generalAttachments, ...this.rootCauseAnalysisAttachments, ...this.taskAttachments];
    this.cardForm.patchValue({ attachments: [...this.generalAttachments] });
  }

  uploadImage(el) {
    if (this.uploadFile) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const arrayBuffer = reader.result.split(',')[1];
          this.inProgress = true;
          this.inProgressChange.emit(this.inProgress);
          this.fileService.create(this.uploadFile.name, arrayBuffer).subscribe({
            next: res => {
              this.inProgress = false;
              this.inProgressChange.emit(this.inProgress);
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
              this.card.attachments = [...this.generalAttachments, ...this.rootCauseAnalysisAttachments, ...this.taskAttachments];
              this.cardForm.patchValue({ attachments: [...this.generalAttachments] });
              this.isUploadModalOpen = false;
              if (el) {
                el.value = '';
              }
            },
            error: err => {
              this.inProgress = false;
              this.inProgressChange.emit(this.inProgress);
              this.toasterService.error(err.error?.message || '::LABEL_UploadFailed');
            }
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

  requestUpdateForCardOwner() {
    this.requestUpdateForCardOwnerEvent.emit({
        userId: this.currentUser.id,
        notifyUserIds: this.card.assignedOwnerId ? [this.card.assignedOwnerId] : [],
        activityCardId: this.card.id,
        baseLink: window.location.origin
    });
  }
}
