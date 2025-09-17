import { SitesComponent } from './../../modeling/sites/sites.component';
import { HttpClient } from '@angular/common/http';
import { Rest, RestService, AuthService, ConfigStateService } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PowerBiService {
  private url: string;
  private refreshToken: string;
  private accessToken: string;
  private expirationDate: Date;
  constructor(private configStateService: ConfigStateService, private httpClient: HttpClient) {
    this.url = environment.oAuthConfig.issuer + 'powerbi-embed-token';
    var microSoftTokens = configStateService.getOne('extraProperties').MicroSoftTokens;
    if (microSoftTokens) {
      let tokens = JSON.parse(atob(microSoftTokens.toString()));
      if (tokens) {
        this.refreshToken = tokens.find(x => x.Name === 'refresh_token').Value;
      }
    }
  }
  async getToken(): Promise<string> {
    const now = new Date();
    if(!this.refreshToken) return of('').toPromise();
    if (this.expirationDate && now < this.expirationDate) {
      return this.accessToken;
    } else {
      const newToken = await this.getPowerbiEmbedToken(this.refreshToken);
      this.accessToken = newToken.access_token;
      this.expirationDate = new Date(now.getTime() + newToken.expires_in * 1000);
      return this.accessToken;
    }
  }

  private getPowerbiEmbedToken(refreshToken: string): Promise<PowerBiEmbedToken> {
    return this.httpClient.get<any>(this.url, {
      params: { refreshToken },
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise();
  }
}

interface PowerBiEmbedToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
