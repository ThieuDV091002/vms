import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import {
  ContractorRequestDto,
  ContractorRequestGetListInput,
  ContractorRequestListDto,
  CreateContractorRequestDto,
} from '../dtos/contractor-request';

@Injectable({
  providedIn: 'root',
})
export class ContractorRequestService {
  apiName = 'vms';

  create(input: CreateContractorRequestDto, config?: Partial<Rest.Config>) {
    const formData = new FormData();

    if (input.tenantId) formData.append('tenantId', input.tenantId);
    formData.append('requestType', input.requestType.toString());
    if (input.molexSupervisorName) formData.append('molexSupervisorName', input.molexSupervisorName);
    formData.append('contractorName', input.contractorName);
    if (input.contractorSupervisorPhone) formData.append('contractorSupervisorPhone', input.contractorSupervisorPhone);
    if (input.contractorSupervisorName) formData.append('contractorSupervisorName', input.contractorSupervisorName);
    if (input.workingArea) formData.append('workingArea', input.workingArea);
    if (input.startDate) formData.append('startDate', input.startDate);
    formData.append('endDate', input.endDate);
    if (input.employeeNumber) formData.append('employeeNumber', input.employeeNumber.toString());
    if (input.workDescription) formData.append('workDescription', input.workDescription);
    if (input.oldWorkPermitCode) formData.append('oldWorkPermitCode', input.oldWorkPermitCode);
    formData.append('molexSupervisorEmail', input.molexSupervisorEmail);
    formData.append('contractorEmail', input.contractorEmail);

    if (input.selections) {
      formData.append('selectionsJson', JSON.stringify(input.selections));
    }
    if (input.textFieldValues && input.textFieldValues.length > 0) {
      formData.append('textFieldValuesJson', JSON.stringify(input.textFieldValues));
    }
    if (input.employeeLists && input.employeeLists.length > 0) {
      formData.append('employeeListsJson', JSON.stringify(input.employeeLists));
    }

    if (input.employeeListFile) {
      formData.append('employeeListFile', input.employeeListFile, input.employeeListFile.name);
    }

    if (input.documentFiles && input.documentFiles.length > 0) {
      input.documentFiles.forEach((file) => {
        formData.append('documentFiles', file, file.name);
      });
    }

    return this.restService.request<any, ContractorRequestDto>(
      {
        method: 'POST',
        url: '/api/app/contractor-request',
        body: formData,
      },
      {
        apiName: this.apiName,
        ...config,
        skipHandleError: config?.skipHandleError,
      }
    );
  }

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContractorRequestDto>(
      {
        method: 'GET',
        url: `/api/app/contractor-request/${id}/details`,
      },
      { apiName: this.apiName, ...config }
    );

  getByOldWorkPermit = (oldWorkPermitCode: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContractorRequestDto>(
      {
        method: 'GET',
        url: `/api/app/contractor-request/details-by-old-work-permit-code`,
        params: {oldWorkPermitCode: oldWorkPermitCode},
      },
      { apiName: this.apiName, ...config }
    );

  getMyRequestList = (input: ContractorRequestGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ContractorRequestListDto>>(
      {
        method: 'GET',
        url: '/api/app/contractor-request/my-request-list',
        params: {
          contractorName: input.contractorName,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getApprovedList = (input: ContractorRequestGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ContractorRequestListDto>>(
      {
        method: 'GET',
        url: '/api/app/contractor-request/approved-list',
        params: {
          contractorName: input.contractorName,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  updateMolexSupervisorApproveStatus = (
    id: string,
    approvalStatus: number,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, void>(
      {
        method: 'PUT',
        url: `/api/app/contractor-request/${id}/molex-supervisor-approve-status`,
        params: { approvalStatus },
      },
      { apiName: this.apiName, ...config }
    );

  rejectEhsApproveStatus = (id: string, comment: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/contractor-request/${id}/reject-ehs-approve-status`,
        params: { comment },
      },
      { apiName: this.apiName, ...config }
    );

  approveEhsApproveStatus = (
    id: string,
    comment: string,
    workPermitCode?: string,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: `/api/app/contractor-request/${id}/approve-ehs-approve-status`,
        params: { comment, workPermitCode },
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
