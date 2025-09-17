import type { CommentDto, CommentGetListInput, CreateUpdateCommentDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  apiName = 'general';
  

  create = (input: CreateUpdateCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommentDto>({
      method: 'POST',
      url: '/api/app/comment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/comment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  exportByFilterByInput = (input: CommentGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, number[]>({
      method: 'POST',
      url: '/api/app/comment/export-by-filter',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommentDto>({
      method: 'GET',
      url: `/api/app/comment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: CommentGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CommentDto>>({
      method: 'GET',
      url: '/api/app/comment',
      params: { productionDate: input.productionDate, shiftId: input.shiftId, shiftIntervals: input.shiftIntervals, areaId: input.areaId, cellId: input.cellId, keyword: input.keyword, location: input.location, commentText: input.commentText, isShiftCommentOnly: input.isShiftCommentOnly, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CommentDto>({
      method: 'PUT',
      url: `/api/app/comment/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
