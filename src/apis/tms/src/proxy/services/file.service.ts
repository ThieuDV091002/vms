import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiName = 'vms';

  get = (fileId: string, isThumbnail?: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>(
      {
        method: 'GET',
        url: '/api/app/file',
        params: { fileId, isThumbnail },
      },
      { apiName: this.apiName, ...config }
    );

  constructor(private restService: RestService) {}
}
