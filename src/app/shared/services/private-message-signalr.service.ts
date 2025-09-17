import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService, ConfigStateService, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { PrivateMessageDto } from '@apis/notification/easy-abp/private-messaging/private-messages/dtos';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { aW } from '@fullcalendar/core/internal-common';
import { ToasterService } from '@abp/ng.theme.shared';
@Injectable({
  providedIn: 'root',
})
export class PrivateMessageSignalrService {
  private hubConnection: signalR.HubConnection;
  public messageReceived = new Subject<PagedResultDto<PrivateMessageDto>>();
  public receivedMessage$ = this.messageReceived.asObservable();

  constructor(private config: ConfigStateService, private toasterService: ToasterService) {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection(token?: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apis.notification.url}/notificationHub?customId=${this.config.getOne('currentUser').id}`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.LongPolling,
      })
      .build();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.registerOnServerEvents();
      })
      .catch(err => {
        // Retry connection after 5 seconds if it fails
        setTimeout(() => {
          this.startConnection();
        }, 5000);
      });
  }

  private registerOnServerEvents() {
    this.hubConnection.on(
      'ReceiveMessage',
      (message: PagedResultDto<PrivateMessageDto>) => {
        this.messageReceived.next(message);
      }
    );
    this.hubConnection.on(
      'ReceiveBroadcastMessage',
      (message: string) => {
        this.toasterService.info(message, "::LABEL_BroadcastMessage");
      }
    );
  }

  public sendMessage(user: string) {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      this.hubConnection
        .invoke('SendMessage', user)
        .catch(err => console.error('Error while sending message: ', err));
    } else {
      console.error('Cannot send data if the connection is not in the "Connected" state.');
    }
  }

  public broadcastMessage = (message: string) => {
    this.hubConnection.invoke('BroadcastMessage', message)
      .catch(err => console.error(err));
  }

}
