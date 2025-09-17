import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StateDto, StateTransitionDto } from '@apis/ticket/dtos';

@Component({
  selector: 'app-state-model-transition',
  template: `
    <div class="row">
        <div class="col-5">{{'::LABEL_FromState' | abpLocalization}}<span> * </span></div>
        <div class="col-5">{{'::LABEL_ToState' | abpLocalization}}<span> * </span></div>
        <!-- <div class="col-4">{{'::LABEL_EventName' | abpLocalization}}<span> * </span></div> -->
    </div>
    <hr>
    <div *ngFor="let transition of transitions; let idx = index" class="row mb-2">
        <div class="col-5">
            <ng-select [items]='states' [appendTo]="'body'" [(ngModel)]="transition.fromState" [bindLabel]="'displayName'" [bindValue]="'id'" (change)="onTransitionsChange()"></ng-select>
        </div>
        <div class="col-5">
            <ng-select [items]='states' [appendTo]="'body'" [(ngModel)]="transition.toState" [bindLabel]="'displayName'" [bindValue]="'id'" (change)="onTransitionsChange()"></ng-select>
        </div>
        <!-- <div class="col-3">
            <input class="form-control" (change)="onTransitionsChange()" [(ngModel)]="transition.eventName"/>
        </div> -->
        <div class="col-1 delete-transition">
            <i class="fa fa-trash" (click)="removeTransition(idx)"></i>
        </div>
    </div>
    <button class="btn btn-sm btn-primary" type="button" (click)="addTransition()">{{'::Add' | abpLocalization }}</button>
  `,
  styles: [`
    hr {
        margin: .5rem 0;
    }
    .delete-transition {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
 `],
})
export class StateModelTransitionComponent {
  _transitions: StateTransitionDto[];
  @Input()
  set transitions(transitions: StateTransitionDto[]) {
    if (!transitions || (transitions && transitions.length === 0)) {
        this._transitions = [];
        this._transitions.push({
            sequence: 0,
            fromState: '',
            toState: '',
            eventName: ''
        });
    } else {
        transitions.sort((a, b) => a.sequence - b.sequence);
        this._transitions = transitions;
    }
  }

  get transitions(): StateTransitionDto[] {
    return this._transitions;
  }
  @Input() states: StateDto[];
  @Output() transitionsChange : EventEmitter<any> = new EventEmitter<any>();

  addTransition() {
    this.transitions.push({
        sequence: this.getMaxSequence() + 1,
        fromState: '',
        toState: '',
        eventName: ''
    });
  }

  onTransitionsChange() {
    // filter transitions with empty fromState or toState or name
    const filteredTransitions = this.transitions.filter(t => t.fromState && t.toState);
    this.transitionsChange.emit(filteredTransitions);
  }

  removeTransition(index: number) {
    this.transitions.splice(index, 1);
    this.onTransitionsChange();
  }

  getMaxSequence(): number {
    let max = 0;
    this.transitions.forEach(t => {
        if (t.sequence > max) {
            max = t.sequence;
        }
    });
    return max;
  }

}
