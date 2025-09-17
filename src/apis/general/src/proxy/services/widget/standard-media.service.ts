import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateStandardMediaDto, StandardMediaDto, StandardMediaGetListInput } from '../../dtos/widget/models';

@Injectable({
  providedIn: 'root',
})
export class StandardMediaService {
  apiName = 'general';
  

  create = (input: CreateUpdateStandardMediaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StandardMediaDto>({
      method: 'POST',
      url: '/api/app/standard-media',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/standard-media/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StandardMediaDto>({
      method: 'GET',
      url: `/api/app/standard-media/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: StandardMediaGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<StandardMediaDto>>({
      method: 'GET',
      url: '/api/app/standard-media',
      params: { seq: input.seq, standardId: input.standardId, mediaUrl: input.mediaUrl, mediaType: input.mediaType, headerNote: input.headerNote, footerNote: input.footerNote, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateStandardMediaDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, StandardMediaDto>({
      method: 'PUT',
      url: `/api/app/standard-media/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
