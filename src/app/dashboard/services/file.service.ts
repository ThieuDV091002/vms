import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { FileDto } from '@apis/general/master-data/dtos';


@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiName = 'general';

  create = (fileName: string, bytes: string, config?: Partial<Rest.Config>) => {
    return this.restService.request<any, FileDto>({
      method: 'POST',
      url: '/api/app/file',
      headers: { 'Content-Type': 'text/json' },
      params: { fileName },
      body: `"${bytes}"`
    },
      { apiName: this.apiName, ...config })
  };

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/file`,
      params: { fileId: id },
    },
      { apiName: this.apiName, ...config });

  get = (fileId: string, isThumbnail?: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'GET',
      url: '/api/app/file',
      params: { fileId, isThumbnail },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) { }
}
