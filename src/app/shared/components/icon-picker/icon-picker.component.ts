import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Icons } from './icon';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.scss',
})
export class IconPickerComponent { 
    icons = Icons;
    _iconControl: FormControl;
    @Input() 
    set iconControl(control: FormControl) {
      if (control.value) {
        this.selectedIcon = control.value;
      }
      this._iconControl = control;
    };
    get iconControl() : FormControl {
      return this._iconControl;
    }

    selectedIcon: string;
    noFilteredIcons: boolean = false;
    searchTerm: string = '';

    iconChange(iconClass: string) {
      if (this.iconControl) {
        this.iconControl.setValue(iconClass);
      }
    }

    clear(e) {
      this.noFilteredIcons = false;
    }
    search(e) {
      this.searchTerm = e.term;
      this.noFilteredIcons = !e.items.length;
    }

    // add custom icon which not in the list
    addIcon() {
      this.selectedIcon = this.searchTerm;
      this.iconControl.setValue(this.searchTerm);
      this.noFilteredIcons = false;
      this.searchTerm = '';
    }
}
