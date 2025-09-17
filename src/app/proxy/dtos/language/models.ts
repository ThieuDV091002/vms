import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';

export interface CreateUpdateLanguagesDto extends CreateUpdateNameObjectDto {
}

export interface ExportLanguageDto {
  name?: string;
  displayName?: string;
  extraProperties: Record<string, object>;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface LanguagesDto extends NameObjectDto<string> {
  type?: string;
}

export interface LanguagesGetListInput extends GetNameObjectInput {
  name?: string;
  creationTimeFrom?: string;
  creationTimeTo?: string;
}
