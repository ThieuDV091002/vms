import { RestService, Rest, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateDomesticGuestDto, DomesticGuestDto, DomesticGuestGetListDto } from '../dtos/domestic-guest';

@Injectable({
  providedIn: 'root',
})
export class DomesticGuestService {
  apiName = 'vms';

  create = (input: CreateDomesticGuestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DomesticGuestDto>(
      {
        method: 'POST',
        url: '/api/app/domestic-guest',
        body: input,
      },
      { apiName: this.apiName, ...config }
    );

  getList = (input: DomesticGuestGetListDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DomesticGuestDto>>(
      {
        method: 'GET',
        url: '/api/app/domestic-guest',
        params: {
          fullName: input.fullName,
          company: input.company,
          department: input.department,
          workDate: input.workDate,
          sorting: input.sorting,
          skipCount: input.skipCount,
          maxResultCount: input.maxResultCount,
        },
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
