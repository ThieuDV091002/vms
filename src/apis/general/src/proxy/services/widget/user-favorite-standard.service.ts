import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateUserFavoriteStandardDto, UserFavoriteStandardDto, UserFavoriteStandardGetListInput } from '../../dtos/widget/models';

@Injectable({
  providedIn: 'root',
})
export class UserFavoriteStandardService {
  apiName = 'general';
  

  create = (input: CreateUpdateUserFavoriteStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserFavoriteStandardDto>({
      method: 'POST',
      url: '/api/app/user-favorite-standard',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/user-favorite-standard/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserFavoriteStandardDto>({
      method: 'GET',
      url: `/api/app/user-favorite-standard/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: UserFavoriteStandardGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<UserFavoriteStandardDto>>({
      method: 'GET',
      url: '/api/app/user-favorite-standard',
      params: { standardId: input.standardId, userId: input.userId, filter: input.filter, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateUserFavoriteStandardDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserFavoriteStandardDto>({
      method: 'PUT',
      url: `/api/app/user-favorite-standard/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
