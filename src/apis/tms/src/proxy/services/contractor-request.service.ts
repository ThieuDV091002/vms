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

  create = (input: CreateContractorRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ContractorRequestDto>(
      {
        method: 'POST',
        url: '/api/app/contractor-request',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

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
