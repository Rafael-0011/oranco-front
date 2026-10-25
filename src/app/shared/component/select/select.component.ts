import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { BaseControl } from '../base/base-control';
import { FormFieldComponent } from '../form-field/form-field.component';

export interface SelectOption<V = unknown> {
  label: string;
  value: V;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  imports: [FormsModule, SelectModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-form-field
      [label]="label()" [forId]="controlId()" [required]="required()"
      [hint]="hint()" [error]="errorText"
    >
      <p-select
        [inputId]="controlId()"
        [options]="options()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [optionDisabled]="'disabled'"
        [placeholder]="placeholder()"
        [filter]="filter()"
        [showClear]="showClear()"
        [appendTo]="appendTo()"
        [disabled]="disabled()"
        [ngModel]="value()"
        [ngModelOptions]="{ standalone: true }"
        (ngModelChange)="update($event)"
        (onBlur)="markTouched()"
        [invalid]="!!errorText"
        fluid
      />
    </app-form-field>
  `,
  styles: `:host { display: block; }`,
})
export class SelectComponent<V = unknown> extends BaseControl<V> {
  readonly options = input<SelectOption<V>[] | any[]>([]);
  readonly optionLabel = input<string>('label');
  readonly optionValue = input<string>('value');
  readonly placeholder = input<string>('Selecione...');
  readonly filter = input<boolean>(false);
  readonly showClear = input<boolean>(false);
  /** 'body' evita problemas de z-index dentro de dialogs. */
  readonly appendTo = input<'body' | 'self'>('body');
}
