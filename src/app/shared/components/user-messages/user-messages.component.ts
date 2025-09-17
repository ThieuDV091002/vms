import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectorRef,
} from '@angular/core';
import { ContextMenuComponent } from '@volosoft/ngx-lepton-x/lib/components/context-menu/context-menu.component';
import { PagedResultDto, SessionStateService } from '@abp/ng.core';
import { InAppPrivateMessageService } from '@apis/notification/services';
import { PrivateMessageDto } from '@apis/notification/easy-abp/private-messaging/private-messages/dtos';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { PrivateMessageSignalrService } from '../../services/private-message-signalr.service';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrl: './user-messages.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class UserMessagesComponent implements OnInit {
  @ViewChild('menu') menu: ContextMenuComponent;
  unReadData: PagedResultDto<PrivateMessageDto> = { items: [], totalCount: 0 };
  isOpen: boolean = false;
  totalMessages: number;
  isActive: boolean = false;
  language: string;
  curentMessage: PrivateMessageDto;
  formattedCreationTime: string;
  isInboxReadModalOpen: boolean;
  private hubConnection: signalR.HubConnection;
  messages: { user: string; message: string }[] = [];
  constructor(
    private eRef: ElementRef,
    private privatemessageSerice: InAppPrivateMessageService,
    private session: SessionStateService,
    private router: Router,
    private signalrService: PrivateMessageSignalrService,
    private cd:ChangeDetectorRef
  ) {
    this.language = session.getLanguage();
  }

  ngOnInit(): void {
    this.getPrivateMessages();
    this.getTotalMessages();
    this.signalrService.messageReceived.subscribe((msg) => {
      this.unReadData=msg;
      this.processMessageContent(this.unReadData.items);
      this.totalMessages=msg.totalCount;
      this.cd.detectChanges();
    });
  }

  getPrivateMessages() {
    this.privatemessageSerice
      .getUnreadPrivateMessageList({
        maxResultCount: 5,
      })
      .subscribe(res => {
        this.unReadData = res;
        this.processMessageContent(this.unReadData.items);
      });
  }

  onClick(row) {
    this.privatemessageSerice
      .setPrivateMessagesRead([row.id])
      .pipe(
        switchMap(() => this.privatemessageSerice.getPrivateMessage(row.id)),
        tap(res => {
          this.curentMessage = res;
          this.formattedCreationTime = this.formatDate(res.creationTime);
          this.isInboxReadModalOpen = true;
        }),
        switchMap(() =>
          this.privatemessageSerice.getUnreadPrivateMessageList({ maxResultCount: 5 })
        ),
        tap(res => {
          this.unReadData = res;
          this.processMessageContent(this.unReadData.items);
        }),
        switchMap(() => this.privatemessageSerice.getUnreadNotificationCount())
      )
      .subscribe(res => {
        this.totalMessages = res;
      });
  }

  getTotalMessages() {
    this.privatemessageSerice.getUnreadNotificationCount().subscribe(res => {
      this.totalMessages = res;
    });
  }

  show() {
    if (this.totalMessages > 0) {
      this.isActive = !this.isActive;
      this.toggleMenu();
    } else {
      this.router.navigate(['/modeling/private-messages']);
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.menu.open();
    } else {
      this.menu.close();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.isActive = false;
      this.menu.close();
    }
  }

  getTimeDifference(creationTime: any): string {
    const localTime = new Date(this.formatDate(creationTime));
    return formatDistanceToNow(localTime);
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  private processMessageContent(items: PrivateMessageDto[]): void {
    items.forEach(item => {
      item.content = this.getPlainTextContent(item.content);
    });
  }

  /**
   * Convert HTML content to plain text
   * @param htmlContent Content containing HTML tags
   * @returns Plain text content
   */
  stripHtmlTags(htmlContent: string): string {
    if (!htmlContent) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    return tempDiv.textContent || tempDiv.innerText || '';
  }

  /**
   * Get plain text content of a message
   * @param message Private message object
   * @returns Plain text content
   */
  getPlainTextContent(content: string): string {
    return this.stripHtmlTags(content);
  }
}
