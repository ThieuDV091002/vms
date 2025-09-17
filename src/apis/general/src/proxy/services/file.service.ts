import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { FileDto } from '../master-data/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  apiName = 'general';
  

  create = (fileName: string, bytes: number[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, FileDto>({
      method: 'POST',
      url: '/api/app/file',
      params: { fileName },
      body: bytes,
    },
    { apiName: this.apiName,...config });
  

  delete = (fileId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, boolean>({
      method: 'DELETE',
      url: '/api/app/file',
      params: { fileId },
    },
    { apiName: this.apiName,...config });
  

  get = (fileId: string, isThumbnail?: boolean, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'GET',
      url: '/api/app/file',
      params: { fileId, isThumbnail },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
