import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  apiName = 'notification';
  

  systemInfo = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/SystemInfo',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
