import { Component, ElementRef, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { TASK_STATUS_CONFIG } from './task-status-config';
import { ToDoTaskService } from '@apis/ticket/to-do-tasks';
import { ToasterService } from '@abp/ng.theme.shared';
import { LocalizationService } from '@abp/ng.core';

@Component({
  selector: 'app-task-status-switcher',
  templateUrl: './task-status-switcher.component.html',
  styleUrl: './task-status-switcher.component.scss'
})

export class TaskStatusSwitcherComponent implements AfterViewInit{
  @ViewChild('container', { static: false }) containerRef!: ElementRef<HTMLDivElement>;
  @Input() currentStatus: string = TASK_STATUS_CONFIG.defaultStatus;
  @Input() todoTaskId: string = '';
  @Output() statusChangeRequested = new EventEmitter<{ todoTaskId: string; nextStatus: string }>();
  containerWidth: number = 0; // Width of the container
  TASK_STATUS_CONFIG = TASK_STATUS_CONFIG;
  private previousStatus: string = this.currentStatus;

  constructor(
    private todoTaskService: ToDoTaskService,
    private toasterService: ToasterService,
    private localizationService: LocalizationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.containerWidth = 80; // this.containerRef.nativeElement.offsetWidth
  }
  
  onDragEnded(event: CdkDragEnd) {
    const dragElement = event.source.element.nativeElement as HTMLElement;
    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
    const dragRect = dragElement.getBoundingClientRect();
    const dragPosition = dragRect.left + dragRect.width / 2 - containerRect.left;
    const thirdWidth = this.containerWidth / 3;
    var nextStatus = '';
    if (dragPosition < thirdWidth) {
      nextStatus = TASK_STATUS_CONFIG.statuses.completed; // Left side
    } else if (dragPosition < 2 * thirdWidth) {
      nextStatus = TASK_STATUS_CONFIG.statuses.new; // Middle
    } else {
      nextStatus = TASK_STATUS_CONFIG.statuses.incomplete; // Right side
    }
    if(nextStatus === this.currentStatus) { // No change in status, do nothing
      event.source.reset();
      return;
    }

    if (nextStatus === TASK_STATUS_CONFIG.statuses.incomplete) {
      event.source.reset();
      // Emit event to parent for additional validation
      this.statusChangeRequested.emit({ todoTaskId: this.todoTaskId, nextStatus });
      this.previousStatus = this.currentStatus; // Save the previous status
      return;
    }

    this.updateStatus(nextStatus);
  }
  onContainerClick(event: MouseEvent) {
    if (event.target instanceof HTMLElement && event.target.closest('.draggable')) {
      return;
    }

    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
    const clickPosition = event.clientX - containerRect.left;
    const thirdWidth = this.containerWidth / 3;
    let nextStatus = '';

    if (clickPosition < thirdWidth) {
      nextStatus = TASK_STATUS_CONFIG.statuses.completed; // Left side
    } else if (clickPosition < 2 * thirdWidth) {
      nextStatus = TASK_STATUS_CONFIG.statuses.new; // Middle
    } else {
      nextStatus = TASK_STATUS_CONFIG.statuses.incomplete; // Right side
    }

    if (nextStatus === this.currentStatus) { // No change in status, do nothing
      return;
    }

    if (nextStatus === TASK_STATUS_CONFIG.statuses.incomplete) {
      // Emit event to parent for additional validation
      this.statusChangeRequested.emit({ todoTaskId: this.todoTaskId, nextStatus });
      this.previousStatus = this.currentStatus; // Save the previous status
      return;
    }

    this.updateStatus(nextStatus);
  }

  updateStatus(nextStatus: string) {
    this.currentStatus = nextStatus;
    const eventName = this.getEventName(nextStatus);
    this.todoTaskService.updateTaskStatusByIdByIdAndEvent(this.todoTaskId, eventName).subscribe(_ => {
      this.toasterService.success('::TaskStatusUpdatedSuccessfully', '', {
        messageLocalizationParams: [nextStatus],
      });
    });
  }

  revertStatus() {
    this.currentStatus = this.previousStatus; // Revert to the previous status
  }

  getEventName(currentStatus: string): string {
    return TASK_STATUS_CONFIG.eventNames[currentStatus] || '';
  }

  get borderColor(): string {
    return TASK_STATUS_CONFIG.borderColors[this.currentStatus] || TASK_STATUS_CONFIG.borderColors.default;
  }

  isKnownStatus(status: string): boolean {
    return Object.values(TASK_STATUS_CONFIG.statuses).includes(status);
  }
}
