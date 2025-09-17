import { RestService, Rest } from '@abp/ng.core';
import type { ListResultDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { MessageNotificationDto, NotificationGetListInput } from '../dtos/models';
import type { NotificationDto } from '../easy-abp/notification-service/notifications/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class MessageNotificationService {
  apiName = 'notification';
  

  getUserNotifications = (input: NotificationGetListInput, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<NotificationDto>>({
      method: 'GET',
      url: '/api/app/message-notification/user-notifications',
      params: { userId: input.userId, userName: input.userName, notificationInfoId: input.notificationInfoId, notificationMethod: input.notificationMethod, success: input.success, creationTime: input.creationTime, creatorId: input.creatorId, completionTime: input.completionTime, failureReason: input.failureReason, retryForNotificationId: input.retryForNotificationId, sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  sendNotification = (input: MessageNotificationDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ListResultDto<NotificationDto>>({
      method: 'POST',
      url: '/api/app/message-notification/send-notification',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
