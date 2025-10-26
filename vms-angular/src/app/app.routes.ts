import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import {HotelsComponent} from "./pages/travel-guide/hotel/hotel.component";
import {GuestInfosComponent} from "./pages/guest-info/guest-info";
import {GuestInfoDetailComponent} from "./pages/guest-info/guest-info-detail";
import {ContractorRequestsComponent} from "./pages/contractor-request/contractor-request";
import {ContractorRequestDetailComponent} from "./pages/contractor-request/contractor-request-detail";
import {FoodsComponent} from "./pages/travel-guide/food/food.component";
import {AttractionsComponent} from "./pages/travel-guide/attraction/attraction.component";
import {TransportationsComponent} from "./pages/travel-guide/transportation/transportation.component";
import {MedicalCareCentersComponent} from "./pages/travel-guide/medical-care-center/medical-care-center.component";
import {HomeComponent} from "./pages/home/home";
import {TravelComponent} from "./pages/travel-guide/travel-guide.component";

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        title:
            'Angular VMS | TailAdmin - Angular Admin Dashboard Template',
    },
    {
        path: 'travel-guide',
        component: TravelComponent,
        pathMatch: 'full',
        title:
            'Angular VMS | TailAdmin - Angular Admin Dashboard Template',
    },
  {
    path:'',
    component:AppLayoutComponent,
    children:[
      {
        path:'calendar',
        component:CalenderComponent,
        title:'Angular Calender | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
        {
            path:'guest-infos',
            component:GuestInfosComponent,
            title:'Angular Guest Info Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'guest-infos-detail',
            component:GuestInfoDetailComponent,
            title:'Angular Guest Info Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'contractor-requests',
            component:ContractorRequestsComponent,
            title:'Angular Contractor Request Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'contractor-requests-detail',
            component:ContractorRequestDetailComponent,
            title:'Angular Contractor Request Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
        {
            path:'hotel-lists',
            component:HotelsComponent,
            title:'Angular Hotels Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'food-lists',
            component:FoodsComponent,
            title:'Angular Foods Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'attraction-lists',
            component:AttractionsComponent,
            title:'Angular Attractions Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'medical-care-center-lists',
            component:MedicalCareCentersComponent,
            title:'Angular Medical Care Centers Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
        {
            path:'transportation-lists',
            component:TransportationsComponent,
            title:'Angular Transportations Dashboard | TailAdmin - Angular Admin Dashboard Template'
        },
      {
        path:'blank',
        component:BlankComponent,
        title:'Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template'
      },
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template'
  },
];
