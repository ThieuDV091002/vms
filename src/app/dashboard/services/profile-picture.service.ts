import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ProfilePictureService {
  apiName = 'default';

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, any>({
      method: 'GET',
      url: `/api/account/profile-picture/${id}`,
    },
      { apiName: this.apiName, ...config });

  constructor(private restService: RestService) { }
}
