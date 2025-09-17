import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateStandardCategoryDto, CreateUpdateStandardDataTierDto, CreateUpdateStandardDto, StandardDto, StandardGetListInput, UserStandardDto } from '../../dtos/widget/models';

@Injectable({
  providedIn: 'root',
})
export class StandardService {
  apiName = 'general';
  

  assignCategoriesToStandardByStandardIdAndStandardCategories = (standardId: string, standardCategories: CreateUpdateStandardCategoryDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/standard/assign-categories-to-standard/${standardId}`,
      body: standardCategories,
    },
    { apiName: this.apiName,...config });
  

  assignDataTierToStandardByStandardIdAndDataTiers = (standardId: string, dataTiers: CreateUpdateStandardDataTierDto[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: `/api/app/standard/assign-data-tier-to-standard/${standardId}`,
      body: dataTiers,
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StandardDto>({
      method: 'POST',
      url: '/api/app/standard',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/standard/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StandardDto>({
      method: 'GET',
      url: `/api/app/standard/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: StandardGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<StandardDto>>({
      method: 'GET',
      url: '/api/app/standard',
      params: { userId: input.userId, filter: input.filter, dataTierList: input.dataTierList, categoryIds: input.categoryIds, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getStandardsByDataTier = (input: StandardGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserStandardDto>>({
      method: 'POST',
      url: '/api/app/standard/get-standards-by-data-tier',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StandardDto>({
      method: 'PUT',
      url: `/api/app/standard/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
