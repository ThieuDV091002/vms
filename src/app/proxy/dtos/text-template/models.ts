import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';

export interface CreateUpdateTextTemplateDto extends CreateUpdateNameObjectDto {
  content: string;
  isLayout: boolean;
  layoutId?: string;
  layoutName?: string;
}

export interface ExportTextTemplateDto {
  name: string;
  displayName?: string;
  isLayout: boolean;
  layoutName?: string;
  content: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface TextTemplateDto extends NameObjectDto<string> {
  content?: string;
  isLayout: boolean;
  layoutId?: string;
  layoutName?: string;
  layout?: string;
}

export interface TextTemplateGetListInput extends GetNameObjectInput {
  isLayout?: boolean;
}
