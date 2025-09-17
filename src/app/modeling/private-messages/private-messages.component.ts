import { EXTENSIONS_IDENTIFIER } from '@abp/ng.components/extensible';
import {
  ListService,
  LocalizationService,
  PagedResultDto,
  PagedResultRequestDto,
  SessionStateService,
} from '@abp/ng.core';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { Confirmation, ConfirmationService, ToasterService } from '@abp/ng.theme.shared';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreatePrivateMessageByUserIdDto,
  PrivateMessageDto,
} from '@apis/notification/easy-abp/private-messaging/private-messages/dtos';
import { InAppPrivateMessageService } from '@apis/notification/services';
import { UserService } from '@proxy/services';
import { PrivateMessageSignalrService } from 'src/app/shared/services/private-message-signalr.service';

@Component({
  selector: 'app-private-messages',
  templateUrl: './private-messages.component.html',
  styleUrl: './private-messages.component.scss',
  providers: [
    ListService,
    {
      provide: EXTENSIONS_IDENTIFIER,
      useValue: 'PrivateMessagesComponent',
    },
  ],
})
export class PrivateMessagesComponent implements OnInit {
  currentTitle: string = '::LABEL_InBox';
  anotherTitle: string = '::LABEL_OutBox';
  pageSize = 10;
  language: string;
  formattedCreationTime: string;
  isTableHovered = false;
  inboxData: PagedResultDto<PrivateMessageDto> = { items: [], totalCount: 0 };
  outboxData: PagedResultDto<PrivateMessageDto> = { items: [], totalCount: 0 };
  curentInboxMessage: PrivateMessageDto;
  selected = [];
  createMessageDto: CreatePrivateMessageByUserIdDto;
  outboxSelected = [];
  isInboxReadModalOpen = false;
  info: string;
  form: FormGroup;
  isModalVisible: boolean = false;
  initUserList: IdentityUserDto[] = [];
  userList: IdentityUserDto[] = [];
  searchKeyword: string;

  constructor(
    private messageService: InAppPrivateMessageService,
    public inboxlist: ListService<PagedResultRequestDto>,
    public outboxlist: ListService<PagedResultRequestDto>,
    private session: SessionStateService,
    public confirmationService: ConfirmationService,
    private localizationService: LocalizationService,
    public toasterService: ToasterService,
    public fb: FormBuilder,
    private userService: UserService,
    private signalrService: PrivateMessageSignalrService
  ) {
    this.language = session.getLanguage();
  }

  ngOnInit() {
    this.getMessages();
    this.adjustPageSize();
    this.userService
      .getUserList({ filter: this.searchKeyword, maxResultCount: 10 })
      .subscribe(res => {
        this.userList = res.items;
        this.initUserList = res.items;
      });
    this.localizationService.get('::LABEL_PrivateMessage').subscribe(data => {
      this.info = data;
    });
  }

  getMessages() {
    this.inboxlist
      .hookToQuery(query => this.messageService.getPrivateMessageList(query))
      .subscribe(res => {
        this.inboxData = res;
      });
    this.outboxlist
      .hookToQuery(query => this.messageService.getSentPrivateMessageList(query))
      .subscribe(res => {
        this.outboxData = res;
      });
  }

  writeMessage() {
    this.createMessageDto = {} as CreatePrivateMessageByUserIdDto;
    this.userList = this.initUserList;
    this.buildForm();
    this.isModalVisible = true;
  }

  buildForm() {
    this.form = this.fb.group({
      toUserId: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this.messageService.createPrivateMessageByUserId(this.form.value).subscribe(() => {
      if (this.currentTitle === '::LABEL_OutBox') {
        this.currentTitle = '::LABEL_InBox';
        this.anotherTitle = '::LABEL_OutBox';
      }
      this.isModalVisible = false;      
      this.toasterService.success('::LABEL_CreatedSuccessfully', '', {
        messageLocalizationParams: [this.info, this.form.value.title],
      });
      this.inboxlist.get();
      this.signalrService.sendMessage(this.form.value.toUserId);
      this.form.reset();
    });
  }

  readInboxMessage(row) {
    this.messageService.setPrivateMessagesRead([row.id]).subscribe(() => {
      this.inboxlist.get();
      this.messageService.getPrivateMessage(row.id).subscribe(res => {
        const fromUserDisplayName = this.getUserDisplayName(res.fromUser);
        const toUserDisplayName = this.getUserDisplayName(res.toUser);

        this.curentInboxMessage = res;
        this.curentInboxMessage['fromUserDisplayName'] = fromUserDisplayName;
        this.curentInboxMessage['toUserDisplayName'] = toUserDisplayName;

        this.formattedCreationTime = this.formatDate(res.creationTime);
        this.isInboxReadModalOpen = true;
        this.signalrService.sendMessage(row.toUserId);
      });
    });
  }

  readOutboxMessage(row) {
    this.messageService.getPrivateMessage(row.id).subscribe(res => {
      const fromUserDisplayName = this.getUserDisplayName(res.fromUser);
      const toUserDisplayName = this.getUserDisplayName(res.toUser);

      this.curentInboxMessage = res;
      this.curentInboxMessage['fromUserDisplayName'] = fromUserDisplayName;
      this.curentInboxMessage['toUserDisplayName'] = toUserDisplayName;

      this.formattedCreationTime = this.formatDate(res.creationTime);
      this.isInboxReadModalOpen = true;
    });
  }

  deleteMessage(row) {
    this.confirmationService
      .warn('::LABEL_DeletionConfirmationMessage', '', {
        messageLocalizationParams: [this.info, row.title],
      })
      .subscribe(status => {
        if (status === Confirmation.Status.confirm) {
          console.log(row.title);
          this.messageService.deletePrivateMessages([row.id]).subscribe(() => {
            this.toasterService.success('::LABEL_SuccessfullyDeleted', '', {
              messageLocalizationParams: [this.info, row.title],
            });
            this.inboxlist.get();
            this.signalrService.sendMessage(row.toUserId);
          });
        }
      });
  }

  isUnRead(row) {
    return row.readTime === null || row.readTime === '';
  }

  changeBox() {
    if (this.currentTitle === '::LABEL_InBox') {
      this.currentTitle = '::LABEL_OutBox';
      this.anotherTitle = '::LABEL_InBox';
    } else {
      this.currentTitle = '::LABEL_InBox';
      this.anotherTitle = '::LABEL_OutBox';
    }
  }

  edit(row) {}

  displayCheck() {
    return true;
  }

  onSelect({ selected }) {
    this.selected = selected;
  }

  onSelectOutbox({ selected }) {
    this.outboxSelected = selected;
  }

  getCheckboxClass() {
    if (this.selected.length > 0) return '';
    else return this.isTableHovered ? '' : 'd-none';
  }

  formatDate(date: any) {
    return new Date(date?.toString() + '+00:00').toLocaleString();
  }

  pageChange(event) {
    this.pageSize = Number(event);
  }

  adjustPageSize() {
    const width = window.screen.height;
    if (width >= 1440) {
      this.inboxlist.maxResultCount = 30;
      this.outboxlist.maxResultCount = 30;
      this.pageSize = 30;
    } else if (width >= 1080) {
      this.inboxlist.maxResultCount = 20;
      this.outboxlist.maxResultCount = 20;
      this.pageSize = 20;
    } else if (width >= 864) {
      this.inboxlist.maxResultCount = 20;
      this.outboxlist.maxResultCount = 15;
      this.pageSize = 15;
    } else {
      this.inboxlist.maxResultCount = 20;
      this.outboxlist.maxResultCount = 10;
      this.pageSize = 10;
    }
  }

  receiverSelectChange(event) {
    this.form.controls['toUserId'].setValue(event ? event.id : '');
  }

  filterUsers(searchTerm: string) {
    this.userService.getUserList({ filter: searchTerm, maxResultCount: 10 }).subscribe(res => {
      this.userList = res.items;
    });
  }

  getUserDisplayName(user: { name?: string; surname?: string }): string {
  if (user?.surname && user?.name) {
    return `${user.surname}, ${user.name}`;
  }
  return `${user?.surname || ''}${user?.name ? ', ' + user.name : ''}`.trim().replace(/^, /, '');
}
}
