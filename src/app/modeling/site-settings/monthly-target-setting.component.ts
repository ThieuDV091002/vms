import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-monthly-target-setting",
    template: `
        <div class="d-flex">
            <div class="year-input">
                <input appInputNumber class="form-control" [min]="2025" [(ngModel)]="currentYear"/>
            </div>
            <div class="month-genrate d-flex align-items-center ms-2">
                <button type="button" class="btn btn-sm btn-outline-primary" [disabled]="settings[currentYear]" (click)="generateMonths()">{{'::LABEL_GenerateMonths' | abpLocalization}}</button>
            </div>

        </div>
        <!-- month/target list -->
         <ul class="mt-1 target-list" *ngIf="settings[currentYear]">
            <!-- header -->
             <li class="d-flex">
                <div class="year-item">{{'::LABEL_Year' | abpLocalization}}</div>
                <div class="month-item ms-2">{{'::LABEL_Month' | abpLocalization}}</div>
                <div class="target-item ms-2">{{'::LABEL_Target' | abpLocalization}}</div>
             </li>
            <!-- month/target list -->
             @for (targetNumber of settings[currentYear]; track $index; let i = $index) {
                <li class="d-flex month-target">
                    <div class="year-item">
                        <input class="form-control text" disabled [value]="currentYear"/>
                    </div>
                    <div class="month-item ms-2">
                        <input class="form-control" disabled [value]="(i+1+'').padStart(2, '0')"/>
                    </div>
                    <div class="target-item ms-2"><input class="form-control" type="number" [min]="0" [(ngModel)]="settings[currentYear][i]" (change)="targetChange()" (wheel)="onWheel($event)"/></div>
                </li>
             }
         </ul>
    `,
    styles: [`
        ul, li {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .year-input {
            width: 200px;
        }
        .target-list {
            width: 450px;
        }
        .month-target {
            padding: 0.2rem 0;
            border-top: 1px solid var(--lpx-border-color);
            input {
                padding: 0.4rem 1.25rem;
            }
        }
        .year-item, .month-item{
            width: 100px;
            input {
                padding: 0.4rem 1.25rem;
                text-align: center;
            }
        }
        .target-item {
            width: 200px;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        input[type="number"] {
            -moz-appearance: textfield;
        }
    `],
})

export class MonthlyTargetSettingComponent {
    _settings = {};
    @Input()
    set settings(value: any) {
        if (!value) {
            this._settings = {};
            return;
        }
        try {
            this._settings = JSON.parse(value);
        } catch (error) {
            this._settings = {};
        }
    }
    get settings() {
        return this._settings;
    };
    @Output() settingsChange: EventEmitter<string> = new EventEmitter<string>();
    currentYear: number = new Date().getFullYear();

    generateMonths() {
        if (this.settings[this.currentYear]) {return}
        this.settings[this.currentYear] = Array(12).fill(null);
        this.settingsChange.emit(JSON.stringify(this.settings));
    }

    targetChange() {
        this.settingsChange.emit(JSON.stringify(this.settings));
    }

    // disable scroll on input number
    onWheel(event: WheelEvent) {
        event.preventDefault();
    }

}