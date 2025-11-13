import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';
import { CreateUpdateDepartmentPICMatrixDto, DepartmentPICMatrixDto, DepartmentPICMatrixGetListInput, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/department-pic';

@Injectable({
  providedIn: 'root',
})
export class DepartmentPICService {
  apiName = 'vms';

  copy = (input: CreateUpdateDepartmentPICMatrixDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/copy',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  create = (input: CreateUpdateDepartmentPICMatrixDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  createOrUpdate = (data: CreateUpdateDepartmentPICMatrixDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/or-update',
        body: data,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/department-pICMatrix/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/export-all',
        params: { fileType },
      },
      { apiName: this.apiName, ...config }
    );

  exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/export',
        params: { fileType },
        body: ids,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto>(
      {
        method: 'GET',
        url: `/api/app/department-pICMatrix/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getAllInstances = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto[]>(
      {
        method: 'GET',
        url: '/api/app/department-pICMatrix/instances',
      },
      { apiName: this.apiName, ...config }
    );

  getByName = (name: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto>(
      {
        method: 'GET',
        url: '/api/app/department-pICMatrix/by-name',
        params: { name },
      },
      { apiName: this.apiName, ...config }
    );

  getExistInstances = (entities: CreateUpdateDepartmentPICMatrixDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto[]>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/get-exist-instances',
        body: entities,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: DepartmentPICMatrixGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DepartmentPICMatrixDto>>(
      {
        method: 'GET',
        url: '/api/app/department-pICMatrix',
        params: {
          name: input.name,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ModelingHistoryDto>>(
      {
        method: 'GET',
        url: '/api/app/department-pICMatrix/modeling-history',
        params: {
          id: input.id,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  importByDtosAndMode = (
    dtos: CreateUpdateDepartmentPICMatrixDto[],
    mode: OverridingMode,
    config?: Partial<Rest.Config>
  ) =>
    this.restService.request<any, ImportResultDto>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/import',
        params: { mode },
        body: dtos,
      },
      { apiName: this.apiName, ...config }
    );

  multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>(
      {
        method: 'POST',
        url: '/api/app/department-pICMatrix/multiple-delete',
        body: ids,
      },
      { apiName: this.apiName, ...config }
    );

  multipleUpdate = (inputs: Record<string, CreateUpdateDepartmentPICMatrixDto>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto[]>(
      {
        method: 'PUT',
        url: '/api/app/department-pICMatrix/multiple-update',
        body: inputs,
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateDepartmentPICMatrixDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DepartmentPICMatrixDto>(
      {
        method: 'PUT',
        url: `/api/app/department-pICMatrix/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
