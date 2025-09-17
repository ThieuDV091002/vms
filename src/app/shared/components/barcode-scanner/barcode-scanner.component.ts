import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat, Result } from '@zxing/library';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit, OnDestroy {
  @ViewChild('scanner') scanner!: ZXingScannerComponent;

  hasPermission = false;
  torchEnabled = false;
  scannerEnabled = true;
  currentDevice: MediaDeviceInfo | null = null;
  availableDevices: MediaDeviceInfo[] = [];
  scanResult: string | null = null;
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.AZTEC,
    /** CODABAR 1D format. */
    BarcodeFormat.CODABAR,
    /** Code 39 1D format. */
    BarcodeFormat.CODE_39,
    /** Code 93 1D format. */
    BarcodeFormat.CODE_93,
    /** Code 128 1D format. */
    BarcodeFormat.CODE_128,
    /** Data Matrix 2D barcode format. */
    BarcodeFormat.DATA_MATRIX,
    /** EAN-8 1D format. */
    BarcodeFormat.EAN_8,
    /** EAN-13 1D format. */
    BarcodeFormat.EAN_13,
    /** ITF (Interleaved Two of Five) 1D format. */
    BarcodeFormat.ITF,
    /** MaxiCode 2D barcode format. */
    BarcodeFormat.MAXICODE,
    /** PDF417 format. */
    BarcodeFormat.PDF_417,
    /** QR Code 2D barcode format. */
    BarcodeFormat.QR_CODE,
    /** RSS 14 */
    BarcodeFormat.RSS_14,
    /** RSS EXPANDED */
    BarcodeFormat.RSS_EXPANDED,
    /** UPC-A 1D format. */
    BarcodeFormat.UPC_A,
    /** UPC-E 1D format. */
    BarcodeFormat.UPC_E,
    /** UPC/EAN extension format. Not a stand-alone format. */
    BarcodeFormat.UPC_EAN_EXTENSION
  ];
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.checkCameraPermissions();
  }

  ngOnDestroy(): void {
    this.scannerEnabled = false;
  }

  async checkCameraPermissions(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.hasPermission = true;
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      this.hasPermission = false;
      console.error('Camera permission denied:', err);
    }
  }

  handleScanSuccess(result: Result): void {
    this.scanResult = result?.toString();
    // Handle the scan result (e.g., close modal and return result)
    this.bsModalRef.hide();
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.currentDevice = devices[0];
  }

  changeCamera(device: MediaDeviceInfo): void {
    this.currentDevice = device;
  }

  closeScanner(): void {
    this.bsModalRef.hide();
  }
}
