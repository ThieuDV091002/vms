import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileCardCreatorComponent } from './mobile-card-creator/mobile-card-creator.component';
import { PageModule } from '@abp/ng.components/page';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, Routes } from '@angular/router';
import { MobileLayoutComponent } from './mobile-layout/mobile-layout.component';

const routes: Routes = [
  {
    path: 'card-creator',
    component: MobileCardCreatorComponent
  }
]
@NgModule({
  declarations: [
    MobileCardCreatorComponent,
    MobileLayoutComponent
  ],
  imports: [
    CommonModule,
    PageModule,
    SharedModule,
    NgSelectModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    MobileCardCreatorComponent
  ]
})
export class MobileModule { }
