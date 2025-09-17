import { Component, inject, Injector, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IdentityUserService, IdentityUserDto } from '@abp/ng.identity/proxy';
import { ConfigStateService, CurrentUserDto, LocalizationService, PagedResultDto } from '@abp/ng.core';
import { UserService } from '@proxy/services';
import { AreaDto } from '@apis/corporate/dtos/models';
import {
    FormBuilder,
    FormGroup,
    UntypedFormGroup,
} from '@angular/forms';
import { UserMenuService } from '@proxy/user-menus/user-menu.service';
import { eFormComponets, ToasterService } from '@abp/ng.theme.shared';
import { routes as modelingRouter } from 'src/app/app-routing.module';
import { routes as dashboardRouter } from 'src/app/dashboard/dashboard.module';
import { TreeviewUserWithAssignedDataTierDto, UserWithAssignedDataTierDto } from '@proxy/dtos/assigned-data-tiers';
import { CreateUpdateActivityCardNotificationSettingsDto } from '@apis/ticket/dtos';
import { ActivityCardNotificationSettingsService } from '@apis/ticket';
@Component({
    selector: 'app-default-settings',
    templateUrl: './default-settings.component.html',
    styleUrls: ['./default-settings.component.scss'],
})

export class DefaultSettingsComponent implements OnInit, OnDestroy {
    dataTierTreeNode: any[] = [];
    haveAccessTreeNode: any[] = [];
    roles: string[] = [];
    tenantInfo: any;
    homepageOptions;
    autoHide = false;
    currentUser: CurrentUserDto;
    selectedHomepage: string = '';
    searchItem;
    searchDataTierTreeNode: AreaDto[] = [];

    defaultDataTier = {
        defaultDataTierType: '',
        defaultDataTierId: ''
    };
    protected readonly identityUserService = inject(IdentityUserService);
    data: PagedResultDto<IdentityUserDto> = { items: [], totalCount: 0 };

    @ViewChild('modalContent', { static: false })
    modalContent!: TemplateRef<any>;
    form!: UntypedFormGroup;
    selected?: IdentityUserDto;
    visiblePermissions = false;
    inputKey = eFormComponets.FormCheckboxComponent;
    providerKey?: string;
    injector: Injector;
    isCollapse = false;
    modelingRouter = modelingRouter;
    dashboardRouter = dashboardRouter;
    validPaths: any;
    treeNodeReady = false;
    userProfile: TreeviewUserWithAssignedDataTierDto;
    defaultDataTierLabel = '';
    notificationForm: FormGroup;
    currentUserNotification: CreateUpdateActivityCardNotificationSettingsDto;
    currentUserInfo: IdentityUserDto;

    constructor(
        private userService: UserService,
        private configService: ConfigStateService,
        private userMenuService: UserMenuService,
        private localizationService: LocalizationService,
        private toasterService: ToasterService,
        private fb: FormBuilder,
        private activityCardNotificationSettingsService: ActivityCardNotificationSettingsService
    ) {
        this.tenantInfo = this.configService.getOne('extraProperties');
        this.currentUser = this.configService.getOne('currentUser');
    }
    ngOnDestroy(): void {
        this.activityCardNotificationSettingsService.createOrUpdate(this.notificationForm.value).subscribe((res) => { });
    }

    ngOnInit(): void {
        this.localizationService.get('::LABEL_DefaultDataTier').subscribe(defaultDataTierl => {
            this.defaultDataTierLabel = defaultDataTierl
        });
        this.getCurrentUserNotificationSettings();
        this.getDataTiers();
        // this.initDataTierTree();
        this.getCurrentUserInfo();
        this.getHomePage();
        const autoHideKey = `sidebarState_${this.currentUser.id}`;
        const storedAutoHide = localStorage.getItem(autoHideKey);
        this.autoHide = storedAutoHide === 'collapsed';

        const homepageKey = `homepage_${this.currentUser.id}`;
        const storedHomepage = localStorage.getItem(homepageKey);
        if (storedHomepage) {
            this.selectedHomepage = storedHomepage;
        } else {
            this.selectedHomepage = '';
        }
    }

    getCurrentUserInfo() {
        this.identityUserService.get(this.currentUser.id).subscribe((res) => {
            this.currentUserInfo = res;
        })
    }

    // Get current user notification settings
    getCurrentUserNotificationSettings() {
        this.activityCardNotificationSettingsService.getByUserId(this.currentUser.id).subscribe((res) => {
            this.currentUserNotification = res
                ? {
                    cardOwnerEmail: res.cardOwnerEmail ?? false,
                    cardOwnerInApp: res.cardOwnerInApp ?? false,
                    taskOwnerEmail: res.taskOwnerEmail ?? false,
                    taskOwnerInApp: res.taskOwnerInApp ?? false,
                    teamMemberEmail: res.teamMemberEmail ?? false,
                    teamMemberInApp: res.teamMemberInApp ?? false,
                    creatorEmail: res.creatorEmail ?? false,
                    creatorInApp: res.creatorInApp ?? false,
                    userId: res.userId,
                    tenantId: res.tenantId ?? '',
                    tenantName: res.tenantName ?? '',
                    extraProperties: {}
                }
                : {
                    cardOwnerEmail: false,
                    cardOwnerInApp: false,
                    taskOwnerEmail: false,
                    taskOwnerInApp: false,
                    teamMemberEmail: false,
                    teamMemberInApp: false,
                    creatorEmail: false,
                    creatorInApp: false,
                    userId: this.currentUser.id,
                    tenantId: '',
                    tenantName: '',
                    extraProperties: {}
                };
            this.buildNotificationForm();
        });
    }

    // Build the notification form
    buildNotificationForm(): void {
        this.notificationForm = this.fb.group({
            cardOwnerEmail: [this.currentUserNotification?.cardOwnerEmail || false],
            cardOwnerInApp: [this.currentUserNotification?.cardOwnerInApp || false],
            taskOwnerEmail: [this.currentUserNotification?.taskOwnerEmail || false],
            taskOwnerInApp: [this.currentUserNotification?.taskOwnerInApp || false],
            teamMemberEmail: [this.currentUserNotification?.teamMemberEmail || false],
            teamMemberInApp: [this.currentUserNotification?.teamMemberInApp || false],
            creatorEmail: [this.currentUserNotification?.creatorEmail || false],
            creatorInApp: [this.currentUserNotification?.creatorInApp || false],
            userId: [this.currentUserNotification.userId || this.currentUser.id],
            tenantId: [this.currentUserNotification.tenantId || ''],
            tenantName: [this.currentUserNotification.tenantName || '']
        });
    }

    // Toggle notification settings
    toggle(key: string) {
        this.notificationForm.patchValue({ [key]: !this.notificationForm.value[key] });
    }

    /**
     * * Get User Menu by Roles
     */
    getHomePage() {
        const roles = this.configService.getOne('currentUser').roles;
        const defaultHomePage = this.localizationService.instant('::Menu:Home');

        if (!this.validPaths) {
            const dashboardRoutes = this.dashboardRouter.map(route => route.path);
            const modelingRouters = this.modelingRouter.map(route => route.path);
            this.validPaths = new Set([...dashboardRoutes, ...modelingRouters]);
        }

        if (roles && roles.length > 0) {
            this.userMenuService.getUserMenuByRoles(roles).subscribe(data => {
                const processedTitles = new Set<string>();
                const flattenMenu = (menuItems: any[]): any[] => {
                    const result: any[] = [];
                    for (const menu of menuItems) {
                        if (this.validPaths.has(menu.path)) {
                            const menuDisplayName = this.localizationService.instant(menu.displayName);
                            if (!processedTitles.has(menuDisplayName)) {
                                processedTitles.add(menuDisplayName);
                                result.push({ ...menu, title: menuDisplayName });
                            }
                        }
                        if (menu.children && menu.children.length > 0) {
                            result.push(...flattenMenu(menu.children));
                        }
                    }
                    return result;
                };

                const flattenedData = flattenMenu(data);
                flattenedData.unshift({ path: '', title: defaultHomePage });
                this.homepageOptions = flattenedData;
                this.homepageOptions = flattenedData.sort((a, b) => {
                    const titleA = a.title.toLowerCase();
                    const titleB = b.title.toLowerCase();
                    return titleA.localeCompare(titleB);
                });
            });
        } else {
            this.homepageOptions = [{ path: '', title: defaultHomePage }];
        }
    }

    getDataTiers() {
        this.userService.getTreeviewDataTiersByUser(this.currentUser.id).subscribe(res => {
            this.userProfile = res;
            if (res && res.assignedDataTiers.length > 0) {
                const cellData = res.assignedDataTiers
                    .filter(d => d.cellId && d.cellName)
                    .map(d => ({ id: d.cellId, name: d.cellName, type: 'Cell', areaId: d.areaId, checked: false, children: [] })) // 初始化 children
                    .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === value.id && t.name === value.name
                        ))
                    );

                const areaData = res.assignedDataTiers
                    // area maybe not have cell, so remove child cell check
                    .filter(d => d.areaId && d.areaName)
                    .map(d => ({ id: d.areaId, name: d.areaName, type: 'Area', children: [], checked: false }))
                    .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === value.id && t.name === value.name
                        ))
                    );

                const workCenterData = res.assignedDataTiers.filter(d => d.workCenterId && d.workCenterName)
                    .map(d => ({ id: d.workCenterId, name: d.workCenterName, type: 'WorkCenter', areaId: d.areaId, cellId: d.cellId, checked: false }))
                    .filter((value, index, self) =>
                        index === self.findIndex((t) => (
                            t.id === value.id && t.name === value.name
                        ))
                    );


                cellData.forEach(cell => {
                    cell.children = workCenterData.filter(d => d.cellId === cell.id);
                });

                areaData.forEach(area => {
                    area.children = cellData
                        .filter(cell => cell.areaId === area.id);
                });

                this.dataTierTreeNode = areaData;
                if (res.defaultDataTier) {
                    this.defaultDataTier = {
                        defaultDataTierType: res.defaultDataTier.dataTierType,
                        defaultDataTierId: res.defaultDataTier.dataTierId
                    };
                }
                this.initDataTierTree();
            }
        });
    }

    onAutoHideToggleChange(): void {
        const autoHideKey = `sidebarState_${this.currentUser.id}`;
        localStorage.setItem(autoHideKey, this.autoHide ? "collapsed" : "expanded");
    }

    onHomepageChange(selectedRoute: any): void {
        const homepageKey = `homepage_${this.currentUser.id}`;
        if (selectedRoute) {
            localStorage.setItem(homepageKey, selectedRoute.path);
        } else {
            localStorage.setItem(homepageKey, '/');
        }
    }

    initDataTierTree() {
        // set all checked to false
        // TODO, here need to improve. checked should be determined by child nodes. parent node should be checked if all child nodes are checked. else not
        // as some area actually not have access but still can click to set default data tier, even will throw error, disable those better
        this.dataTierTreeNode.forEach(area => {
            area.checked = true;
            area.expanded = false;
            if (this.defaultDataTier.defaultDataTierType === 'Area' && this.defaultDataTier.defaultDataTierId === area.id) {
                area.isDefault = true;
            } else {
                area.isDefault = false;
            }
            area.children.forEach(cell => {
                cell.checked = true;
                cell.expanded = false;
                if (this.defaultDataTier.defaultDataTierType === 'Cell' && this.defaultDataTier.defaultDataTierId === cell.id) {
                    cell.isDefault = true;
                } else {
                    cell.isDefault = false;
                }
                cell.children.forEach(workCenter => {
                    workCenter.checked = true;
                    workCenter.expanded = false;
                    if (this.defaultDataTier.defaultDataTierType === 'WorkCenter' && this.defaultDataTier.defaultDataTierId === workCenter.id) {
                        workCenter.isDefault = true;
                    } else {
                        workCenter.isDefault = false;
                    }
                });
            });
        });
        this.treeNodeReady = true;
    }

    defaultDataTierChange(event) {
        this.defaultDataTier = event;
        this.userService.update(this.currentUserInfo.id, {
            dataTiers: {
                userId: this.currentUserInfo.id,
                defaultDataTierType: event.defaultDataTierType,
                defaultDataTierId: event.defaultDataTierId,
                assignedDataTiers: this.userProfile.assignedDataTiers.map(d => ({
                    userId: this.currentUserInfo.id,
                    dataTierType: d.dataTierType,
                    dataTierId: d.dataTierId,
                    dataTierName: d.dataTierName
                }))
            },
            name: this.currentUserInfo.name,
            surname: this.currentUserInfo.surname,
            userName: this.currentUserInfo.userName,
            phoneNumber: this.currentUserInfo.phoneNumber,
            email: this.currentUserInfo.email,
            isActive: this.currentUserInfo.isActive,
            lockoutEnabled: this.currentUserInfo.lockoutEnabled,
            roleNames: this.configService.getOne('currentUser').roles,
        }).subscribe((res) => {
            if (res.dataTier.defaultDataTier) {
                this.toasterService.success('::LABEL_SavedSuccessfully', '', {
                    messageLocalizationParams: [this.defaultDataTierLabel, res.dataTier.defaultDataTier.dataTierName],
                });
            } else {
                this.toasterService.warn('::LABEL_NotHaveAccessForDataTier', '');
            }

        })
    }

}
