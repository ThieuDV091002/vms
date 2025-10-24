import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import {
  CreateUpdateMedicalCareCenterDto,
  MedicalCareCenterDto,
} from '../dtos/medical-care-center';

@Injectable({
  providedIn: 'root',
})
export class MedicalCareCenterService {
  apiName = 'vms';

  create = (input: CreateUpdateMedicalCareCenterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MedicalCareCenterDto>(
      {
        method: 'POST',
        url: '/api/app/medical-care-center',
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
        url: `/api/app/medical-care-center/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MedicalCareCenterDto>(
      {
        method: 'GET',
        url: `/api/app/medical-care-center/${id}`,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<MedicalCareCenterDto>>(
      {
        method: 'GET',
        url: '/api/app/medical-care-center',
      },
      { apiName: this.apiName, ...config }
    );

  getBySection = (section: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MedicalCareCenterDto>(
      {
        method: 'GET',
        url: '/api/app/medical-care-center/by-city',
        params: { section },
      },
      { apiName: this.apiName, ...config }
    );

  update = (id: string, input: CreateUpdateMedicalCareCenterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MedicalCareCenterDto>(
      {
        method: 'PUT',
        url: `/api/app/medical-care-center/${id}`,
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
