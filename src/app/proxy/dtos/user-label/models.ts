import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';

export interface CreateUpdateUserLabelDto extends CreateUpdateNameObjectDto {
  category: string;
  categoryName?: string;
  labelValue?: string;
}

export interface ExportUserLabelDto {
  name?: string;
  displayName?: string;
  categoryName?: string;
  labelValue?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface UserLabelDto extends NameObjectDto<string> {
  category?: string;
  categoryName?: string;
  labelValue?: string;
}

export interface UserLabelGetListInput extends GetNameObjectInput {
  category?: string;
  labelValue?: string;
}
