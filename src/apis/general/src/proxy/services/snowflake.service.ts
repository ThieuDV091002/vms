import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnowflakeService {
  apiName = 'general';
  

  test = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'POST',
      url: '/api/app/snowflake/test',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
