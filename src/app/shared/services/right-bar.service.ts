import { NavItemsService } from '@abp/ng.theme.shared';
import { Component, Injectable } from '@angular/core';
import { UserMessagesComponent } from '../components/user-messages/user-messages.component';
import { LinksComponent } from '../components/links/links.component';
import { SuportTeamsComponent } from '../components/suport-teams/suport-teams.component';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RightBarService {

  public refreshData = new BehaviorSubject<string>('');

  constructor(private navItems: NavItemsService) { }

  public AddItems() {
    this.navItems.addItems([

      {
        id: 'UserMessages',
        order: 1,
        component: UserMessagesComponent,
      }
    ]);
  }
}
