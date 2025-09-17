import { Rest, RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { KochUserInfo } from '../interfaces/koch-user-info';

@Injectable({
  providedIn: 'root'
})
export class KochidService {

  apiName = 'koch';
  getUserInfo = (mail: string, config?: Partial<Rest.Config>) => {
    let url = `/adap/o=sourceData?scope=Sub&filter=(upn=${mail})&attributes=employeeID,givenName,sn,mail,telephoneNumber,mobile,sAMAccountName`
   

    return this.restService.request<any, KochUserInfo>({
      headers: {},
      method: 'GET',
      url: url
    },
      { apiName: this.apiName, ...config });
  }

  getUserInfoByEmail = (email: string, config?: Partial<Rest.Config>) => {
    const url = `/adap/o=sourceData?scope=Sub&filter=(upn=${email})&attributes=mail,sAMAccountName`;

    return this.restService.request<any, KochUserInfo>({
      headers: {},
      method: 'GET',
      url: url
    },
      { apiName: this.apiName, ...config });
  }

  getDirectEmployeeInfosByManagerDn = (manager: string, config?: Partial<Rest.Config>) => {
    const url = `/adap/o=sourceData?scope=Sub&filter=(manager=${manager})&attributes=employeeID,givenName,sn,mail,telephoneNumber,mobile,sAMAccountName`;

    return this.restService.request<any, KochUserInfo>({
      headers: {},
      method: 'GET',
      url: url
    },
      { apiName: this.apiName, ...config });
  }


  constructor(private restService: RestService) { }
}
