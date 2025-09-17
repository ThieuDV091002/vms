import { saveAs } from 'file-saver';
import { AppUtils } from './utils/app.utils';
import { ConfigStateService, ListService, PagedResultDto, Rest, RestService } from '@abp/ng.core';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { inject } from '@angular/core';
import { FileType } from './utils/file-type.enum';
import { forkJoin } from 'rxjs';
import { FailedImportResultItemDto } from '@proxy/dtos';
import { ModelingHistoryDto } from '@proxy/dtos/modeling';
import { ModelingInput } from '@apis/general/dtos';
import { OverridingMode } from '@proxy';
export class ModelingBase<TService, TGetListInput, TCreateUpdateDto> {
  public isHistoryModalVisible = false;
  isImportDetailsVisible = false;
  importConfirmVisible = false;
  importResult: FailedImportResultItemDto[] = [];
  public visiblePermissions = false;
  providerKey?: string;
  historys: PagedResultDto<ModelingHistoryDto>;
  existingData = [];
  newData = [];
  public restService: RestService = inject(RestService)
  public toasterService: ToasterService = inject(ToasterService)
  public confirmationService: ConfirmationService = inject(ConfirmationService)
  public configService: ConfigStateService = inject(ConfigStateService)
  constructor(public service: TService, public list: ListService<TGetListInput>, apiName: string) {
    this.service['exportByIds'] = (ids: string[], fileType: FileType, config?: Partial<Rest.Config>) =>
      this.restService.request<any, number[]>({
        method: 'POST',
        url: '/api/app/' + apiName + '/export',
        params: { fileType },
        body: ids,
      },
        { apiName: this.service['apiName'] ? this.service['apiName'] : "Default", ...config });

    this.service['exportAll'] = (fileType: FileType, config?: Partial<Rest.Config>) =>
      this.restService.request<any, number[]>({
        method: 'POST',
        url: '/api/app/' + apiName + '/export-all',
        params: { fileType },
      },
        { apiName: this.service['apiName'] ? this.service['apiName'] : "Default", ...config });
    this.service['exportAllByTenant'] = (fileType: FileType, tenantDataTierType?: string, tenantDataTierId?: string, config?: Partial<Rest.Config>) =>
      this.restService.request<any, number[]>({
        method: 'POST',
        url: '/api/app/' + apiName + '/export-all-by-tenant',
        params: { fileType, tenantDataTierType, tenantDataTierId },
      },
        { apiName: this.service['apiName'] ? this.service['apiName'] : "Default", ...config });
  }

  export(e) {
    this.service['exportByIds'](e.objectIds, e.fileType).subscribe({
      next: (res: string) => {
        saveAs(this.base64ToBlob(res, AppUtils.generateFileName(e.objectType, e.fileType)), AppUtils.generateFileName(e.objectType, e.fileType));
      }
    });
  }

  exportAll(e) {
    if (['Area', 'Cell', 'WorkCenter'].includes(e.objectType)) {
      this.service['exportAllByTenant'](e.fileType, this.configService.getOne('extraProperties')?.DataTierType, this.configService.getOne('extraProperties')?.DataTierId).subscribe({
        next: (res: string) => {
          saveAs(this.base64ToBlob(res, AppUtils.generateFileName(e.objectType, e.fileType)), AppUtils.generateFileName(e.objectType, e.fileType));
        }
      });
    } else {
      this.service['exportAll'](e.fileType).subscribe({
        next: (res: string) => {
          saveAs(this.base64ToBlob(res, AppUtils.generateFileName(e.objectType, e.fileType)), AppUtils.generateFileName(e.objectType, e.fileType));
        }
      });
    }
  }

  base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  import(e) {
    // duplicates check
    const nameSet = new Set();
    const displayNameSet = new Set();
    const duplicates = [];

    e.data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && typeof(item[key]) !== 'object') {
          item[key] = item[key]?.toString();
        }
      });

      // duplicates check
      if (item.Name && nameSet.has(item.Name)&&e.objectType != 'Users') {
        duplicates.push(item);
      }
      // check for userName
      else if (e.objectType === 'Users') {
        if (item.UserName && nameSet.has(item.UserName)) {
          duplicates.push(item);
        }
      }
       else {
        nameSet.add(item.Name);
      }

      if (item.DisplayName && displayNameSet.has(item.DisplayName)) {
        duplicates.push(item);
      } else {
        displayNameSet.add(item.DisplayName);
      }

      if (e.objectType === 'ActivityCardSettings') {
        item.EscalationDuration = item.EscalationDuration ? Number(item.EscalationDuration) : 0;
      }
      if (e.objectType === 'AreaSettings') {
        item.YearlyInternalQNsTarget = item.YearlyInternalQNsTarget ? Number(item.YearlyInternalQNsTarget) : 0;
        item.YearlyExternalQNsTarget = item.YearlyExternalQNsTarget ? Number(item.YearlyExternalQNsTarget) : 0;
        item.UnsafeConditionTarget = item.UnsafeConditionTarget ? Number(item.UnsafeConditionTarget) : 0;
        item.PlanActualDiffTol = item.PlanActualDiffTol ? Number(item.PlanActualDiffTol) : 0;
        item.FPYTargetTol = item.FPYTargetTol ? Number(item.FPYTargetTol) : 0;
        item.SPPMTargetTol = item.SPPMTargetTol ? Number(item.SPPMTargetTol) : 0;
        item.MachineCOPQTarget = item.MachineCOPQTarget ? Number(item.MachineCOPQTarget) : 0;
        item.MachineCOPQTargetTol = item.MachineCOPQTargetTol ? Number(item.MachineCOPQTargetTol) : 0;
        item.POEETarget = item.POEETarget ? Number(item.POEETarget) : 0;
        item.POEETargetTol = item.POEETargetTol ? Number(item.POEETargetTol) : 0;
        item.PerformanceTargetTol = item.PerformanceTargetTol ? Number(item.PerformanceTargetTol) : 0;
        item.UDTTargetTol = item.UDTTargetTol ? Number(item.UDTTargetTol) : 0;
        item.LaborCOPQTarget = item.LaborCOPQTarget ? Number(item.LaborCOPQTarget) : 0;
        item.LaborCOPQTargetTol = item.LaborCOPQTargetTol ? Number(item.LaborCOPQTargetTol) : 0;
        item.OLETarget = item.OLETarget ? Number(item.OLETarget) : 0;
        item.OLETargetTol = item.OLETargetTol ? Number(item.OLETargetTol) : 0;
        item.UPPHTargetTol = item.UPPHTargetTol ? Number(item.UPPHTargetTol) : 0;
      }
      if (e.objectType === 'CentralizedUser') {
        if (typeof(item.AccessTenants) === 'object') {
          item.AccessTenants = item.AccessTenants ? item.AccessTenants.map(item => item.toString()) : [];
        } else {
          item.AccessTenants = item.AccessTenants? item.AccessTenants.split(',') : [];
        }
      }
      if (e.objectType === 'ShiftPatterns') {
        if (typeof(item.DataTier) === 'object') {
          item.DataTier = item.DataTier ? item.DataTier.map(item => item.toString()) : [];
        } else {
          item.DataTier = item.DataTier? item.DataTier.split(',') : [];
        }
      }
      if (e.objectType === 'LinkCategory') {
        item.Sequence = item.Sequence ? Number(item.Sequence) : 0;
      }
      if (e.objectType === 'UserGroup') {
        item.Users = item.Users ? item.Users: [];
      }
      if (e.objectType === 'WorkCenterSetting') {
        item.FPYTarget = item.FPYTarget ? Number(item.FPYTarget) : 0;
        item.SPPMTarget = item.SPPMTarget ? Number(item.SPPMTarget) : 0;
        item.PerformanceTarget = item.PerformanceTarget ? Number(item.PerformanceTarget) : 0;
        item.UPPHTarget = item.UPPHTarget ? Number(item.UPPHTarget) : 0;
        item.UDTTarget = item.UDTTarget ? Number(item.UDTTarget) : 0;
      }
      if (e.objectType === 'ActivityCardCategory') {
        item.MTDLimit = item.MTDLimit ? Number(item.MTDLimit) : 0;
        item.YTDLimit = item.YTDLimit ? Number(item.YTDLimit) : 0;
      }
    })
    // duplicates check
    if (duplicates.length > 0) {
      this.confirmationService
      .error('::LABEL_DuplicateRecordsFound', '', {
        hideCancelBtn: true,
        yesText: 'AbpAccount::Close',
        messageLocalizationParams: [duplicates.map(d => d.Name || d.DisplayName).join(', ')]
      })
      return;
    }

    const models: TCreateUpdateDto[] = e.data;
    this.existingData = [];
    this.newData = [];
    this.service['getExistInstances'](models).subscribe((res) => {
      // respone is existing instances with all fields, but data from file only has couple of fields
      // and maybe with new values, so filter those data based on API response
      // mostly name can be used for filtering
      // if not existing, then all new data, directly import
      if (res.length === 0) {
        this.importDataFunc(models);
      } else { // if existing, then compare and show to user for confirmation
        models.forEach((model: any) => {
          let existing;
          if (e.objectType === 'Users') {
            existing = res.find((item) => item.userName === model.UserName);
          } else if (e.objectType === 'ActivityCardSettings') {
            // Activity card settings has site, area, cell, so need to combine them as Name.
            let name = model.SiteName;
            if (model.AreaName) {
              name += '-' + model.AreaName;
            }
            if (model.CellName) {
              name += '-' + model.CellName;
            }
            existing = res.find((item) => item.name === name);
          } else if (e.objectType === 'SiteSettings') {
            existing = res.find((item) => item.siteName === model.Site);
          } else if (e.objectType === 'AreaSettings') {
            existing = res.find((item) => item.areaName === model.Area);
          } else if (e.objectType === 'WorkCenterSetting') {
            existing = res.find((item) => item.workCenterName === model.WorkCenter);
          } else if (e.objectType === 'CellSettings') {
            existing = res.find((item) => item.cellName === model.Cell);
          } else if (e.objectType === 'NotificationSettings') {
            existing = res.find((item) => item.api === model.API);
          } else if (e.objectType === 'FocusedItems') {
            existing = res.find((item) => (item.workCenterName === model.WorkCenterName)
              && (item.partNumber == model.PartNumber) && (item.priority == model.Priority));
          } else {
            existing = res.find((item) => item.name === model.Name);
          }

          if (existing) {
            this.existingData.push(model);
          } else {
            this.newData.push(model);
          }
        });
        this.importConfirmVisible = true;
      }
    });
  }

  customeImport(selectedData) {
    this.importConfirmVisible = false;
    this.importDataFunc([...this.newData, ...selectedData]);
  }

  importDataFunc(data: any) {
    if (data.length === 0) {
      this.toasterService.info('::NoDataAvailableInDatatable');
      return;
    }
    // split data, request can only handle 500 records at a time
    const chunkSize = 500;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    // chunks to observable, use forkJoin to handle multiple requests
    const importObservables = chunks.map(chunk => {
      return this.service['importByDtosAndMode'](chunk, OverridingMode.Overwrite)
    });
    // subscribe to all observables
    forkJoin(importObservables).subscribe((res) => {
      // check failed import result
      const failedImports = res.flatMap(item => item.items || []);
      if (failedImports.length > 0) {
        this.importResult = failedImports;
        this.isImportDetailsVisible = true;
      } else { // if no failed imports, then show success message
        this.toasterService.success('::LABEL_SuccessfullyImported');
      }
      // all imports failed, then do not refresh the list
      if (failedImports?.length !== data.length) {
        this.list.get();
      }
    });
  }
  copy(e, callback = null) {
    const info = this.removeLastS(e.objectType);
    this.service['create'](e.data).subscribe(res => {
      this.toasterService.success('::LABEL_CopiedSuccessfully', '', {
        messageLocalizationParams: [info, e.data.name],
      });
      this.list.get();
      if (callback && typeof callback === 'function') {
        callback(res);
      }
    });
  }
  viewHistory({ id, name }) {
    let input: ModelingInput<string> = {
      id: id,
      maxResultCount: 1000,
      skipCount: 0,
      sorting: "executionTime desc"
    };
    this.service['getModelingHistoryByInput'](input).subscribe((historys) => {
      this.historys = historys;
      this.isHistoryModalVisible = true;
    });
  }
  multiDelete(e) {
    var infos = this.insertSpaces(e.objectType);
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '', {
      messageLocalizationParams: [infos + '<br/>', e.objectNames.join(',<br/>')],
    }).subscribe((status) => {
      if (status === Confirmation.Status.confirm) {
        this.service['multipleDeleteByIds'](e.objectIds).subscribe(() => {
          this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
            messageLocalizationParams: [infos, e.objectNames],
          });
          this.list.get()
        });
      }
    });
  }
  openPermissionsModal(row: any) {
    this.providerKey = row.name;
    setTimeout(() => {
      this.visiblePermissions = true;
    }, 0);
  }
  // removeLastS(str) {
  //   var info = this.removeLastS(str.replace(/([A-Z])/g, ' $1').trim());
  //   if (info.endsWith('s')) {
  //     return info.slice(0, -1);
  //   } else {
  //     return info;
  //   }
  // }
  removeLastS(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').trim().replace(/s$/, '');
  }
  insertSpaces(str: string): string {
    return str.replace(/([A-Z])/g, ' $1').trim();
  }
}
