import { Directive, ElementRef, Renderer2, HostListener, Inject, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BarcodeScannerComponent } from '../components/barcode-scanner/barcode-scanner.component';

@Directive({
  selector: '[appBarcodeScaner]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BarcodeScanerDirective),
      multi: true
    }
  ]
})
export class BarcodeScanerDirective implements ControlValueAccessor {
  private divIcon: HTMLElement;
  bsModalRef?: BsModalRef;
  private _value: any;
  private inputElement: HTMLInputElement;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private modalService: BsModalService
  ) {
    this.inputElement = el.nativeElement;
    this.renderer.listen(this.inputElement, 'input', (event) => {
      this._value = event.target.value;
      this.onChange(this._value);
      this.onTouched();
    });
    const div = this.renderer.createElement('div')
    this.renderer.addClass(div, 'input-group')
    this.renderer.appendChild(this.inputElement.parentNode, div)
    this.renderer.appendChild(div, this.inputElement)

    // Create scan icon div
    this.divIcon = this.renderer.createElement('div')
    renderer.addClass(this.divIcon, 'input-group-text')
    this.divIcon.style.padding = '0rem 0.25rem'

    //create scan icon
    this.divIcon.innerHTML = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1735547841643" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1519" data-spm-anchor-id="a313x.search_index.0.i0.d39c3a81MOrW1o" xmlns:xlink="http://www.w3.org/1999/xlink" width='2rem'><path d="M928 544 96 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l832 0c17.696 0 32 14.336 32 32S945.696 544 928 544zM832 928l-192 0c-17.696 0-32-14.304-32-32s14.304-32 32-32l192 0c17.664 0 32-14.336 32-32l0-160c0-17.696 14.304-32 32-32s32 14.304 32 32l0 160C928 884.928 884.928 928 832 928zM352 928 192 928c-52.928 0-96-43.072-96-96l0-160c0-17.696 14.336-32 32-32s32 14.304 32 32l0 160c0 17.664 14.368 32 32 32l160 0c17.664 0 32 14.304 32 32S369.664 928 352 928zM128 384c-17.664 0-32-14.336-32-32L96 192c0-52.928 43.072-96 96-96l160 0c17.664 0 32 14.336 32 32s-14.336 32-32 32L192 160C174.368 160 160 174.368 160 192l0 160C160 369.664 145.664 384 128 384zM896 384c-17.696 0-32-14.336-32-32L864 192c0-17.632-14.336-32-32-32l-192 0c-17.696 0-32-14.336-32-32s14.304-32 32-32l192 0c52.928 0 96 43.072 96 96l0 160C928 369.664 913.696 384 896 384z" fill="#272636" p-id="1520" data-spm-anchor-id="a313x.search_index.0.i1.d39c3a81MOrW1o"></path></svg>`;
    this.renderer.setStyle(this.divIcon, 'cursor', 'pointer');
    renderer.appendChild(div, this.divIcon)

    this.renderer.listen(this.divIcon, 'click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      let _this = this;
      const initialState: ModalOptions = {
        class: 'modal-dialog modal-dialog-centered',
        initialState: {

        }
      };
      _this.bsModalRef = _this.modalService.show(BarcodeScannerComponent, initialState);
      _this.bsModalRef.onHide.subscribe(data => {
        let r = this.bsModalRef.content.scanResult ?? ''
        if (r) {
          this._value = r
          this.updateValue()
        }
      });

    });

  }
  private updateValue(): void {
    this.renderer.setProperty(this.inputElement, 'value', this._value.toString());
    this.onChange(this._value);
    this.onTouched();
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this._value = value;
      this.renderer.setProperty(this.inputElement, 'value', this._value.toString());
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

}
