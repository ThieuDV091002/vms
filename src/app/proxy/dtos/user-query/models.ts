import type { CreateUpdateNameObjectDto, GetNameObjectInput, NameObjectDto } from '../models';

export interface UserQueryParameterItem {
  name?: string;
  valueType: number;
  defaultValue?: string;
}

export interface CreateUpdateUserQueryDto extends CreateUpdateNameObjectDto {
  queryText: string;
  parameters: CreateUpdateUserQueryParameterDto[];
}

export interface CreateUpdateUserQueryParameterDto extends CreateUpdateNameObjectDto {
  valueType: number;
  defaultValue?: string;
  value?: string;
}

export interface UserQueryDto extends NameObjectDto<string> {
  queryText?: string;
  parameters: UserQueryParameterDto[];
}

export interface UserQueryGetListInput extends GetNameObjectInput {
  parameters: CreateUpdateUserQueryParameterDto[];
}

export interface UserQueryParameterDto extends NameObjectDto<string> {
  valueType: number;
  defaultValue?: string;
}
