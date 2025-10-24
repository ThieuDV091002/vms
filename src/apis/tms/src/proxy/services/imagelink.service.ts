import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateUpdateImageLinkDto, ImageLinkDto } from '../dtos/imagelink';

@Injectable({
  providedIn: 'root',
})
export class ImageLinkService {
  apiName = 'vms';

  create = (input: CreateUpdateImageLinkDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageLinkDto>(
      {
        method: 'POST',
        url: '/api/app/link',
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
        url: `/api/app/link/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageLinkDto>(
      {
        method: 'GET',
        url: `/api/app/link/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ImageLinkDto>>(
      {
        method: 'GET',
        url: '/api/app/link',
      },
      { apiName: this.apiName, ...config }
    );

  getBySection = (section: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageLinkDto>(
      {
        method: 'GET',
        url: '/api/app/link/by-section',
        params: { section },
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateImageLinkDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ImageLinkDto>(
      {
        method: 'PUT',
        url: `/api/app/link/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
