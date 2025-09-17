import { ChangeDetectorRef, Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import Decimal from 'decimal.js';

@Directive({
  selector: '[appInputNumber]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberDirective),
      multi: true
    }
  ]
})
export class InputNumberDirective implements ControlValueAccessor {

  @Input() step: number = 1;
  @Input() min: number = -Infinity;
  @Input() max: number = Infinity;
  @Input() integer: boolean = false;
  private inputElement: HTMLInputElement;
  private _value: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.inputElement = this.el.nativeElement;
    this.createButtons();
  }


  private createButtons(): void {
    const div = this.renderer.createElement('div')
    this.renderer.addClass(div, 'input-group')
    this.renderer.appendChild(this.inputElement.parentNode, div)
    this.renderer.appendChild(div, this.inputElement)
    this.renderer.setStyle(this.inputElement, 'text-align', 'center');

    // create minus Button
    const minusButton = this.renderer.createElement('button');
    this.renderer.addClass(minusButton, 'btn');
    this.renderer.addClass(minusButton, 'btn-decrement');
    this.renderer.setStyle(minusButton, 'background-color', 'transparent');
    this.renderer.setStyle(minusButton, 'cursor', 'transparent');
    this.renderer.setStyle(minusButton, 'color', 'var(--lpx-content-text)');
    this.renderer.setStyle(minusButton, 'padding', '5px 10px')
    this.renderer.setStyle(minusButton, 'border', '1px solid rgba(var(--lpx-navbar-active-text-color-rgb), 0.05)');
    // const minusText = this.renderer.createText('-');
    // create a span element to hold the plus sign and add some style to style it
    const minusText = this.renderer.createElement('span');
    this.renderer.setStyle(minusText, 'display', 'inline-block');
    this.renderer.setStyle(minusText, 'font-size', '1.5em');
    this.renderer.setStyle(minusText, 'border-radius', '50%');
    this.renderer.setStyle(minusText, 'border', '1px solid var(--lpx-dark)');
    this.renderer.setStyle(minusText, 'width', '20px');
    this.renderer.setStyle(minusText, 'height', '20px');
    this.renderer.setStyle(minusText, 'line-height', '16px');
    this.renderer.setStyle(minusText, 'text-align', 'center');
    const minusTextContent = this.renderer.createText('-');
    this.renderer.appendChild(minusText, minusTextContent);
    this.renderer.appendChild(minusButton, minusText);

    // create plus Button
    const plusButton = this.renderer.createElement('button');
    this.renderer.addClass(plusButton, 'btn');
    this.renderer.addClass(minusButton, 'btn-increment');
    this.renderer.setStyle(plusButton, 'background-color', 'transparent');
    this.renderer.setStyle(plusButton, 'cursor', 'transparent');
    this.renderer.setStyle(plusButton, 'color', 'var(--lpx-content-text)');
    this.renderer.setStyle(plusButton, 'padding', '5px 10px')
    this.renderer.setStyle(plusButton, 'border', '1px solid rgba(var(--lpx-navbar-active-text-color-rgb), 0.05)');
    // const plusText = this.renderer.createText('+');
    // create a span element to hold the plus sign and add some style to style it
    const plusText = this.renderer.createElement('span');
    this.renderer.setStyle(plusText, 'display', 'inline-block');
    this.renderer.setStyle(plusText, 'font-size', '1.5em');
    this.renderer.setStyle(plusText, 'border-radius', '50%');
    this.renderer.setStyle(plusText, 'border', '1px solid var(--lpx-dark)');
    this.renderer.setStyle(plusText, 'width', '20px');
    this.renderer.setStyle(plusText, 'height', '20px');
    this.renderer.setStyle(plusText, 'line-height', '16px');
    this.renderer.setStyle(plusText, 'text-align', 'center');
    const plusTextContent = this.renderer.createText('+');
    this.renderer.appendChild(plusText, plusTextContent);
    this.renderer.appendChild(plusButton, plusText);




    this.renderer.insertBefore(this.inputElement.parentNode, minusButton, this.inputElement);

    this.renderer.insertBefore(this.inputElement.parentNode, plusButton, this.inputElement.nextSibling);

    this.renderer.listen(minusButton, 'click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.decrementValue();
    });


    this.renderer.listen(plusButton, 'click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.incrementValue();
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {

    let inputValue = (event.target as HTMLInputElement).value;
    if (!this.isValidNumber(inputValue)) {

      inputValue = inputValue.replace(event['data'], '');
      (event.target as HTMLInputElement).value = inputValue
    }
    this._value = new Decimal(inputValue);
    this.updateValue();
  }

  private incrementValue(): void {
    const step = new Decimal(this.step);
    if (this._value.equals(new Decimal(this.max))) {
      return;
    }
    this._value = this._value.plus(step);
    if (this._value.lessThanOrEqualTo(new Decimal(this.max))) {
      this.renderer.setProperty(this.inputElement, 'value', this._value.toString());
      this.updateValue();
    }
  }


  private decrementValue(): void {
    const step = new Decimal(this.step);
    if (this._value.equals(new Decimal(this.min))) {
      return;
    }
    this._value = this._value.minus(step);
    if (this._value.greaterThanOrEqualTo(new Decimal(this.min))) {
      this.renderer.setProperty(this.inputElement, 'value', this._value.toString());
      this.updateValue();
    }
  }

  private getDecimalPlaces(value: any): number {
    if (this.integer) {


    }
    else {
      const match = ('' + value).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
      if (!match) return 0;
      return Math.max(
        0,
        (match ? match.length : 0) - (match ? +match : 0)
      );
    }

  }

  private isValidNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  private updateValue(): void {
    //this.renderer.setProperty(this.inputElement, 'value', this._value.toString());
    this.onChange(this._value.toNumber());
    this.onTouched();
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this._value = new Decimal(value);
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



