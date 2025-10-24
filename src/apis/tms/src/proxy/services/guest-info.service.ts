import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import {
  CreateGuestInfoDto,
  GuestInfoDto,
  GuestInfoGetListInput,
  GuestInfoListDto,
} from '../dtos/guest-information';

@Injectable({
  providedIn: 'root',
})
export class GuestInfoService {
  apiName = 'vms';

  create = (input: CreateGuestInfoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GuestInfoDto>(
      {
        method: 'POST',
        url: '/api/app/guest-information',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GuestInfoDto>(
      {
        method: 'GET',
        url: `/api/app/guest-information/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: GuestInfoGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GuestInfoListDto>>(
      {
        method: 'GET',
        url: '/api/app/guest-information',
        params: {
          keyword: input.keyword,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  notify = (guestInfoIds: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'POST',
        url: '/api/app/guest-information/notify',
        body: guestInfoIds,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
