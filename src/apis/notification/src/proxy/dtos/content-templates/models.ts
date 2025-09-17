import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';

export interface ContentTemplateCacheDto {
  id?: string;
  tenantId?: string;
  name?: string;
  displayName?: string;
  description?: string;
  subject?: string;
  content?: string;
}

export interface ContentTemplateDto extends NameObjectDto<string> {
  subject?: string;
  content?: string;
}

export interface ContentTemplateGetListInput extends GetNameObjectInput {
  subject?: string;
  content?: string;
}

export interface CreateUpdateContentTemplateDto extends CreateUpdateNameObjectDto {
  subject?: string;
  content?: string;
}

export interface ExportContentTemplateDto {
  name: string;
  displayName?: string;
  description?: string;
  subject?: string;
  content?: string;
  creationTime?: string;
  lastModificationTime?: string;
}
