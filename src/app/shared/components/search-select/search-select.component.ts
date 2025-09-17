import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'search-select',
  templateUrl: './search-select.component.html',
  styleUrl: './search-select.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SearchSelectComponent {
  @Input() items: Array<any> = []
  @Input() value: any
  @Input() displayName: any
  @Input() valueName: any
  @Input() placeholder: string = ''
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  changeClick(e) {
    this.change.emit(e)
  }
}
