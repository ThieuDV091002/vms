import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateHotelDto, HotelDto, HotelGetListInput, ImportResultDto, ModelingHistoryDto, ModelingInput } from '../dtos/models';
import type { FileType } from '../file-type.enum';
import type { OverridingMode } from '../overriding-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  apiName = 'vms';

  copy = (input: CreateUpdateHotelDto, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto>({
        method: 'POST',
        url: '/api/app/hotel/copy',
        body: input,
      },
      { apiName: this.apiName,...config });
    
  
    create = (input: CreateUpdateHotelDto, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto>({
        method: 'POST',
        url: '/api/app/hotel',
        body: input,
      },
      { apiName: this.apiName,...config });
    
  
    createOrUpdate = (data: CreateUpdateHotelDto, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto>({
        method: 'POST',
        url: '/api/app/hotel/or-update',
        body: data,
      },
      { apiName: this.apiName,...config });
    
  
    delete = (id: string, config?: Partial<Rest.Config>) =>
      this.restService.request<any, void>({
        method: 'DELETE',
        url: `/api/app/hotel/${id}`,
      },
      { apiName: this.apiName,...config });
    
  
    exportAllByFileType = (fileType: FileType, config?: Partial<Rest.Config>) =>
      this.restService.request<any, number[]>({
        method: 'POST',
        url: '/api/app/hotel/export-all',
        params: { fileType },
      },
      { apiName: this.apiName,...config });
    
  
    exportByFileTypeAndIds = (fileType: FileType, ids: string[], config?: Partial<Rest.Config>) =>
      this.restService.request<any, number[]>({
        method: 'POST',
        url: '/api/app/hotel/export',
        params: { fileType },
        body: ids,
      },
      { apiName: this.apiName,...config });
    
  
    get = (id: string, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto>({
        method: 'GET',
        url: `/api/app/hotel/${id}`,
      },
      { apiName: this.apiName,...config });
    
  
    getAllInstances = (config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto[]>({
        method: 'GET',
        url: '/api/app/hotel/instances',
      },
      { apiName: this.apiName,...config });
    
  
    getByName = (name: string, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto>({
        method: 'GET',
        url: '/api/app/dashboard/by-name',
        params: { name },
      },
      { apiName: this.apiName,...config });
    
  
    getExistInstances = (entities: CreateUpdateHotelDto[], config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto[]>({
        method: 'POST',
        url: '/api/app/hotel/get-exist-instances',
        body: entities,
      },
      { apiName: this.apiName,...config });
    
  
    getList = (input: HotelGetListInput, config?: Partial<Rest.Config>) =>
      this.restService.request<any, PagedResultDto<HotelDto>>({
        method: 'GET',
        url: '/api/app/hotel',
        params: { name: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
      },
      { apiName: this.apiName,...config });
    
  
    getModelingHistoryByInput = (input: ModelingInput<string>, config?: Partial<Rest.Config>) =>
      this.restService.request<any, PagedResultDto<ModelingHistoryDto>>({
        method: 'GET',
        url: '/api/app/hotel/modeling-history',
        params: { id: input.id, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
      },
      { apiName: this.apiName,...config });
    
  
    importByDtosAndMode = (dtos: CreateUpdateHotelDto[], mode: OverridingMode, config?: Partial<Rest.Config>) =>
      this.restService.request<any, ImportResultDto>({
        method: 'POST',
        url: '/api/app/hotel/import',
        params: { mode },
        body: dtos,
      },
      { apiName: this.apiName,...config });
    
  
    multipleDeleteByIds = (ids: string[], config?: Partial<Rest.Config>) =>
      this.restService.request<any, boolean>({
        method: 'POST',
        url: '/api/app/hotel/multiple-delete',
        body: ids,
      },
      { apiName: this.apiName,...config });
    
  
    multipleUpdate = (inputs: Record<string, CreateUpdateHotelDto>, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto[]>({
        method: 'PUT',
        url: '/api/app/hotel/multiple-update',
        body: inputs,
      },
      { apiName: this.apiName,...config });
    
  
    update = (id: string, input: CreateUpdateHotelDto, config?: Partial<Rest.Config>) =>
      this.restService.request<any, HotelDto>({
        method: 'PUT',
        url: `/api/app/hotel/${id}`,
        body: input,
      },
      { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}