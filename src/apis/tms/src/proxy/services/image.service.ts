import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateUpdateImageDto, ImageDto } from '../dtos/image';
import { Image } from '../dtos';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  apiName = 'vms';

  create = (input: CreateUpdateImageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageDto>(
      {
        method: 'POST',
        url: '/api/app/image',
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
        url: `/api/app/image/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageDto>(
      {
        method: 'GET',
        url: `/api/app/image/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (
      query?: { skipCount?: number; maxResultCount?: number; sorting?: string },
      config?: Partial<Rest.Config>
    ) =>
      this.restService.request<any, PagedResultDto<ImageDto>>(
        {
          method: 'GET',
          url: '/api/app/image',
          params: query,
        },
        { apiName: this.apiName, ...config }
      );

  getBySection = (section: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageDto>(
      {
        method: 'GET',
        url: '/api/app/image/by-section',
        params: { section },
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateImageDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageDto>(
      {
        method: 'PUT',
        url: `/api/app/image/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
