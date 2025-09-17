import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PageModule } from '@abp/ng.components/page';
import { SafePipe } from '../shared/SafePipe';
import { CookieService } from 'ngx-cookie-service';
import { DashboardModule } from '../dashboard/dashboard.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  declarations: [HomeComponent, SafePipe],
  imports: [SharedModule, HomeRoutingModule, PageModule, DashboardModule, TooltipModule],
  providers: [CookieService]
})
export class HomeModule { }
