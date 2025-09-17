import type { CreateUpdateNameObjectDto, ExecutionObjectDto, GetNameObjectInput, NameObjectDto } from '../../dtos/models';

export interface CreateUpdateToDoListSetupDataTierDto {
  id?: string;
  parentId?: string;
  dataTierType?: string;
  dataTierId?: string;
}

export interface CreateUpdateToDoListSetupDetailDto {
  id?: string;
  parentId?: string;
  toDoTask?: string;
  order: number;
  toDoListSetupStandards: CreateUpdateToDoListSetupStandardDto[];
  toDoListSetupLinks: CreateUpdateToDoListSetupLinkDto[];
}

export interface CreateUpdateToDoListSetupDto extends CreateUpdateNameObjectDto {
  toDoTypeId?: string;
  toDoTypeName?: string;
  scope?: string;
  scheduleCronExpression?: string;
  scheduleCompletionDate?: string;
  scheduleStartDate?: string;
  toDoListSetupDataTiers: CreateUpdateToDoListSetupDataTierDto[];
  toDoListSetupShifts: CreateUpdateToDoListSetupShiftDto[];
  toDoListSetupUsers: CreateUpdateToDoListSetupUserDto[];
  toDoListSetupDetails: CreateUpdateToDoListSetupDetailDto[];
}

export interface CreateUpdateToDoListSetupLinkDto {
  id?: string;
  parentId?: string;
  displayName?: string;
  url?: string;
}

export interface CreateUpdateToDoListSetupShiftDto {
  id?: string;
  parentId?: string;
  shiftId?: string;
}

export interface CreateUpdateToDoListSetupStandardDto {
  id?: string;
  parentId?: string;
  standardId?: string;
  standardName?: string;
}

export interface CreateUpdateToDoListSetupUserDto {
  id?: string;
  parentId?: string;
  userId?: string;
  expiryTime?: string;
  shiftId?: string;
  dataTierType?: string;
  dataTierId?: string;
}

export interface CreateUpdateToDoTypeDto extends CreateUpdateNameObjectDto {
  stateModelId?: string;
  stateModelName?: string;
  cardTypeId?: string;
  cardTypeName?: string;
  cardCategoryId?: string;
  cardCategoryName?: string;
}

export interface ToDoListSetupDataTierDto extends ExecutionObjectDto<string> {
  parentId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface ToDoListSetupDetailDto extends ExecutionObjectDto<string> {
  parentId?: string;
  toDoTask?: string;
  order: number;
  toDoListSetupStandards: ToDoListSetupStandardDto[];
  toDoListSetupLinks: ToDoListSetupLinkDto[];
}

export interface ToDoListSetupDto extends NameObjectDto<string> {
  toDoTypeId?: string;
  toDoTypeName?: string;
  scope?: string;
  scheduleCronExpression?: string;
  scheduleCompletionDate?: string;
  scheduleStartDate?: string;
  toDoListSetupDataTiers: ToDoListSetupDataTierDto[];
  toDoListSetupShifts: ToDoListSetupShiftDto[];
  toDoListSetupUsers: ToDoListSetupUserDto[];
  toDoListSetupDetails: ToDoListSetupDetailDto[];
}

export interface ToDoListSetupGetListInput extends GetNameObjectInput {
  toDoTypeId?: string;
  scope?: string;
  scheduleCronExpression?: string;
  scheduleCompletionDate?: string;
}

export interface ToDoListSetupLinkDto extends ExecutionObjectDto<string> {
  parentId?: string;
  displayName?: string;
  scheduleStartDate?: string;
  url?: string;
}

export interface ToDoListSetupShiftDto extends ExecutionObjectDto<string> {
  parentId?: string;
  shiftId?: string;
}

export interface ToDoListSetupStandardDto extends ExecutionObjectDto<string> {
  parentId?: string;
  standardId?: string;
  standardName?: string;
}

export interface ToDoListSetupUserDto extends ExecutionObjectDto<string> {
  parentId?: string;
  userId?: string;
  expiryTime?: string;
  shiftId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
}

export interface ToDoTypeDto extends NameObjectDto<string> {
  stateModelId?: string;
  stateModelName?: string;
  cardTypeId?: string;
  cardTypeName?: string;
  cardCategoryId?: string;
  cardCategoryName?: string;
}

export interface ToDoTypeGetListInput extends GetNameObjectInput {
  stateModelId?: string;
  cardTypeId?: string;
  cardCategoryId?: string;
}
