import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateUpdateFoodDto, FoodDto } from '../dtos/food';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  apiName = 'vms';

  create = (input: CreateUpdateFoodDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FoodDto>(
      {
        method: 'POST',
        url: '/api/app/food',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  getPhoto = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<void, any>(
      {
        method: 'GET',
        params: { fileId: id },
        url: `/api/app/file`,
      },
      { apiName: this.apiName, ...config }
    );

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>(
      {
        method: 'DELETE',
        url: `/api/app/food/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FoodDto>(
      {
        method: 'GET',
        url: `/api/app/food/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (
      query?: { skipCount?: number; maxResultCount?: number; sorting?: string },
      config?: Partial<Rest.Config>
    ) =>
      this.restService.request<any, PagedResultDto<FoodDto>>(
        {
          method: 'GET',
          url: '/api/app/food',
          params: query,
        },
        { apiName: this.apiName, ...config }
      );

  update = (id: string, input: CreateUpdateFoodDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FoodDto>(
      {
        method: 'PUT',
        url: `/api/app/food/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
