import { Confirmation, ConfirmationService } from '@abp/ng.theme.shared';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { LocalizationService } from '@abp/ng.core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-widget-template',
  templateUrl: './widget-template.component.html',
  styleUrl: './widget-template.component.scss'
})
export class WidgetTemplateComponent {
  @Input() selected: any = {title: '', url: '', hideTitle: false};
  @Input() index = -1;
  edit = false;
  form: FormGroup;
  widgetInfo: string;
  @Input() expandChart = false;

  @Output() deleteChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() expandChange: EventEmitter<number> = new EventEmitter<number>();
  // https://dev.ufe.molex.com:30967/goto/pEGqXr_SR?orgId=1

  constructor(private fb: FormBuilder, private confirmationService : ConfirmationService,
    private localizationService: LocalizationService
  ) {
    this.buildForm();


  }
  ngOnInit(): void {
    this.localizationService.get('::LABEL_DashboardWidget').subscribe(data => {
      this.widgetInfo = data;
    });
  }
  expand() {
    this.expandChart = !this.expandChart;
    this.expandChange.emit(this.expandChart ? this.index : -1);
  }

  buildForm() {
    this.form = this.fb.group({
      title: [this.selected.title || ' ', ''],
      hideTitle: [this.selected.hideTitle || false]
    });

  }

  save() {
    this.edit = false;
    delete this.selected.initial;
    this.selected.title = this.form.get('title').value;
    this.selected.hideTitle = this.form.get('hideTitle').value;
  }

  cancel() {
    this.edit = false;
    // if (!this.selected.url) {
    //   this.deleteChange.emit();
    // }
  }

  delete() {
    this.confirmationService.warn('::LABEL_DeletionConfirmationMessage', '',{
      messageLocalizationParams: [this.widgetInfo,this.selected.name],
    }).subscribe(status => {
      if (status === Confirmation.Status.confirm) {
        this.deleteChange.emit(this.index);
      }
    });
  }
}
