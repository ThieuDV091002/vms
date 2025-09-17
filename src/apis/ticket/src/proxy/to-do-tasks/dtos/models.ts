import type { ExecutionObjectDto } from '../../dtos/models';
import type { ToDoListSetupLinkDto, ToDoListSetupStandardDto } from '../../to-do-setups/dtos/models';
import type { PagedAndSortedResultRequestDto } from '@abp/ng.core';

export interface CreateUpdateToDoTaskCommentDto {
  id?: string;
  taskId?: string;
  commentText?: string;
}

export interface CreateUpdateToDoTaskDto {
  taskInfo?: string;
  toDoTypeId?: string;
  toDoListSetupId?: string;
  toDoListSetupDetailId?: string;
  currentStatusId?: string;
  scope?: string;
  taskDate?: string;
  expiryDate?: string;
  shiftId?: string;
  assigneeId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  assignedCardId?: string;
  comments: CreateUpdateToDoTaskCommentDto[];
}

export interface ToDoTaskCommentDto extends ExecutionObjectDto<string> {
  taskId?: string;
  commentText?: string;
}

export interface ToDoTaskDto extends ExecutionObjectDto<string> {
  taskInfo?: string;
  toDoTypeId?: string;
  toDoListSetupId?: string;
  toDoListSetupName?: string;
  toDoListSetupDetailId?: string;
  currentStatusId?: string;
  currentStatusName?: string;
  scope?: string;
  taskDate?: string;
  expiryDate?: string;
  shiftId?: string;
  shiftName?: string;
  shiftDisplayName?: string;
  assigneeId?: string;
  assigneeName?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  assignedCardId?: string;
  comments: ToDoTaskCommentDto[];
  standards: ToDoListSetupStandardDto[];
  links: ToDoListSetupLinkDto[];
}

export interface ToDoTaskGetListInput extends PagedAndSortedResultRequestDto {
  taskInfo?: string;
  toDoTypeId?: string;
  currentStatusId?: string;
  scope?: string;
  taskDate?: string;
  expiryDate?: string;
  shiftId?: string;
  assigneeId?: string;
  dataTierType?: string;
  dataTierId?: string;
  dataTierName?: string;
  assignedCardId?: string;
}
