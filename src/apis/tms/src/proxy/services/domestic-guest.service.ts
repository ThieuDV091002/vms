import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { CreateDomesticGuestDto, DomesticGuestDto } from '../dtos/domestic-guest';

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
  constructor(private restService: RestService) {}
}
