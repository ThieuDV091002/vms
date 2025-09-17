import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { Nfc } from '@capawesome-team/capacitor-nfc';
import { Router } from '@angular/router';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject } from 'rxjs';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'device-test',
  templateUrl: './device-test.component.html',
  styleUrl: './device-test.component.scss'
})
export class DeviceTestComponent {
  imageSrc: string = '';
  code: string = '';
  isScan = false;
  isScanBarcode = false;
  isTakePhoto = false;
  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];

  hasDevices: boolean;
  hasPermission: boolean;

  qrResultString: string;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  constructor(public route: Router) {

  }
  takePhoto(isEdit: boolean) {
    this.isTakePhoto = true
    this.isScan = false
    Camera.getPhoto({
      quality: 90,
      allowEditing: isEdit,
      resultType: CameraResultType.Uri
    }).then((result) => {

      this.imageSrc = result.webPath ?? '';

    });
  }
  scanBarcode() {
    this.isTakePhoto = false
    this.isScanBarcode = true
    this.isScan = true
    this.qrResultString = '';
    // CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.ALL }).then((result) => {
    //   this.code = result.ScanResult

    // }).catch((error) => {
    //   console.error(error);
    // });
  }
  scanNFC() {
    this.isTakePhoto = false
    this.isScan = true
    Nfc.addListener('nfcTagScanned', event => {
      this.code = JSON.stringify(event)
    }).then(r => {

    })

  }
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
    this.isScanBarcode = false;
  }
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

}
