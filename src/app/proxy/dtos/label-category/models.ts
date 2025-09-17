import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';

export interface CreateUpdateLabelCategoryDto extends CreateUpdateNameObjectDto {
}

export interface ExportLabelCategoryDto {
  name?: string;
  displayName?: string;
  creationTime?: string;
  creationUser?: string;
  lastModificationTime?: string;
  lastModificationUser?: string;
}

export interface LabelCategoryDto extends NameObjectDto<string> {
}

export interface LabelCategoryGetListInput extends GetNameObjectInput {
}
