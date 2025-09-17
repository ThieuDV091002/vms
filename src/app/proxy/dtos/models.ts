import type { ExtensibleAuditedEntityDto, ExtensibleEntityDto, ExtensibleObject, PagedAndSortedResultRequestDto } from '@abp/ng.core';

import type { UserQueryParameterItem } from './user-query/models';
import type { MenuType } from '../menu-type.enum';

export interface CreateUpdateNameObjectDto {
  name: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
}

export interface GetNameObjectInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface NameObjectDto<Tkey> extends ExtensibleAuditedEntityDto<Tkey> {
  name?: string;
  description?: string;
  tenantId?: string;
  tenantName?: string;
  displayName?: string;
  normalizedName?: string;
  creator?: string;
  lastModifier?: string;
}

export interface ExportUserQueryDto {
  name: string;
  displayName: string;
  queryText: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  parameters: UserQueryParameterItem[];
}

export interface FailedImportResultItemDto {
  name?: string;
  errorMessage?: string;
}

export interface ImportResultDto {
  status: boolean;
  totalCount: number;
  successCount: number;
  failedCount: number;
  items: FailedImportResultItemDto[];
}

export interface KafkaIntegrationSettingsDto {
  name?: string;
  config: UFEClientConfig;
}

export interface TopicHandler {
  name?: string;
  tenant?: string;
  site?: string;
  handler?: string;
  event?: string;
  application?: string;
  action?: string;
}

export interface UFEClientConfig {
  topicHandlers: TopicHandler[];
  bootstrapServers?: string;
  securityProtocol?: string;
  saslMechanism?: string;
  saslUsername?: string;
  saslPassword?: string;
  allowAutoCreateTopics?: string;
  groupId?: string;
  failedNotifyEmail?: string;
}

export interface ApplicationCreateOrUpdateDtoBase extends ExtensibleObject {
  applicationType: string;
  clientId: string;
  displayName: string;
  clientType?: string;
  clientSecret?: string;
  consentType?: string;
  extensionGrantTypes: string[];
  postLogoutRedirectUris: string[];
  redirectUris: string[];
  allowPasswordFlow: boolean;
  allowClientCredentialsFlow: boolean;
  allowAuthorizationCodeFlow: boolean;
  allowRefreshTokenFlow: boolean;
  allowHybridFlow: boolean;
  allowImplicitFlow: boolean;
  allowLogoutEndpoint: boolean;
  allowDeviceEndpoint: boolean;
  scopes: string[];
  clientUri?: string;
  logoUri?: string;
}

export interface ApplicationDto extends ExtensibleEntityDto<string> {
  applicationType?: string;
  clientId?: string;
  displayName?: string;
  clientType?: string;
  clientSecret?: string;
  consentType?: string;
  extensionGrantTypes: string[];
  postLogoutRedirectUris: string[];
  redirectUris: string[];
  allowPasswordFlow: boolean;
  allowClientCredentialsFlow: boolean;
  allowAuthorizationCodeFlow: boolean;
  allowRefreshTokenFlow: boolean;
  allowHybridFlow: boolean;
  allowImplicitFlow: boolean;
  allowLogoutEndpoint: boolean;
  allowDeviceEndpoint: boolean;
  scopes: string[];
  clientUri?: string;
  logoUri?: string;
}

export interface CreateApplicationInput extends ApplicationCreateOrUpdateDtoBase {
}

export interface CreateScopeInput extends ScopeCreateOrUpdateDtoBase {
}

export interface ExportUserMenuDto {
  id?: string;
  name?: string;
  displayName?: string;
  description?: string;
  path?: string;
  order?: number;
  iconClass?: string;
  parentId?: string;
  menuType?: MenuType;
  subMenuName?: string;
  layout?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
  children: ExportUserMenuDto[];
}

export interface GetApplicationListInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface GetScopeListInput extends PagedAndSortedResultRequestDto {
  filter?: string;
}

export interface ScopeCreateOrUpdateDtoBase extends ExtensibleObject {
  name: string;
  displayName?: string;
  description?: string;
  resources: string[];
}

export interface ScopeDto extends ExtensibleEntityDto<string> {
  name?: string;
  displayName?: string;
  description?: string;
  buildIn: boolean;
  resources: string[];
}

export interface UpdateApplicationInput extends ApplicationCreateOrUpdateDtoBase {
}

export interface UpdateScopeInput extends ScopeCreateOrUpdateDtoBase {
}
