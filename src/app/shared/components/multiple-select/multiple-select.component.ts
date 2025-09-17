import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrl: './multiple-select.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MultipleSelectComponent {
  @Input() items: Array<any> = []
  @Input() values: Array<any> = []
  @Input() displayName: any
  @Input() valueName: any
  @Input() isDisable = false;
  @Input() appendTo: string | HTMLElement = 'body';
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  onPanelWheel(e: WheelEvent) {
    const target = e.target as HTMLElement;
    const panel = target.closest('.ng-dropdown-panel') as HTMLElement | null;
    if (!panel) return; 
    const host = panel.querySelector('.scroll-host') as HTMLElement | null;
    if (!host) return;
    e.preventDefault(); 
    host.scrollTop += e.deltaY; 
  }
  OnChanges(e) {
    this.change.emit(e)
  }
}
