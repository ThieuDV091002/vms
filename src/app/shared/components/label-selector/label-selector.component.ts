import { ConfigStateService, LocalizationService } from '@abp/ng.core';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-label-selector',
  templateUrl: './label-selector.component.html',
  styleUrl: './label-selector.component.scss'
})
export class LabelSelectorComponent {

  @Output() selected: EventEmitter<any> = new EventEmitter<any>();
  labels = []
  allLabels = []
  filter: string
  constructor(private configService: ConfigStateService) {

    this.initValues()
  }

  private initValues() {
    let resources = this.configService.getAll().localization.resources;
    let texts = {}
    for (const element in resources) {
      this.allLabels.push(...Object.keys(resources[element].texts).map(key => ({ label: (element === 'UFE' ? '' : element) + '::' + key, value: resources[element].texts[key] })));
    }
    //this.allLabels = Object.keys(texts).map(key => ({ label: key, value: texts[key] }));
    this.labels = this.allLabels
  }
  search() {
    this.labels = this.allLabels.filter(item => item.value.toLowerCase().includes(this.filter.toLowerCase()))

  }
  select(row) {
    this.select = row
    this.selected.emit(row);
  }

}
