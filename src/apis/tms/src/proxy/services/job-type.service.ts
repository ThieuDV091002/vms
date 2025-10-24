import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { JobTypeDetailDto, JobTypeDto } from '../dtos/job-type';

@Injectable({
  providedIn: 'root',
})
export class JobTypeService {
  apiName = 'vms';

  getAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobTypeDto[]>(
      {
        method: 'GET',
        url: '/api/app/job-type/job-types',
      },
      { apiName: this.apiName, ...config }
    );

  getDetails = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, JobTypeDetailDto>(
      {
        method: 'GET',
        url: `/api/app/job-type/job-type-details/${id}`,
      },
      { apiName: this.apiName, ...config }
    );


  constructor(private restService: RestService) {}
}
