import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadNFCComponent } from './components/read-nfc/read-nfc.component';
import { RouterModule, Routes } from '@angular/router';
import { DeviceTestComponent } from './device-test.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

const routes: Routes = [
  {
    path: '',
    component: DeviceTestComponent
  }
  , {
    path: 'read-nfc',
    component: ReadNFCComponent
  }]

@NgModule({
  declarations: [ReadNFCComponent, DeviceTestComponent],
  imports: [
    CommonModule,
    ZXingScannerModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [ReadNFCComponent, DeviceTestComponent]
})
export class DeviceTestModule { }
