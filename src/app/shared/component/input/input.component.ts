import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BaseControl } from '../base/base-control';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-input',
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    IconFieldModule,
    InputIconModule,
    FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-form-field
      [label]="label()" [forId]="controlId()" [required]="required()"
      [hint]="hint()" [error]="errorText"
    >
      @if (type() === 'number') {
        <p-inputnumber
          fluid
          [inputId]="controlId()"
          [placeholder]="placeholder()"
          [ngModel]="asNumber(value())"
          [ngModelOptions]="{ standalone: true }"
          (ngModelChange)="onNumberChange($event)"
          (onBlur)="markTouched()"
          [disabled]="disabled()"
          [min]="min()"
          [max]="max()"
          [minFractionDigits]="minFractionDigits()"
          [maxFractionDigits]="maxFractionDigits()"
          locale="pt-BR"
          mode="decimal"
        />
      } @else if (icon()) {
        <p-iconfield>
          <p-inputicon [class]="icon()" />
          <input
            pInputText fluid
            [id]="controlId()" [type]="type()"
            [placeholder]="placeholder()"
            [value]="value() ?? ''"
            [disabled]="disabled()"
            [attr.inputmode]="inputMode() || null"
            [attr.maxlength]="maxLength()"
            [attr.aria-invalid]="!!errorText"
            (input)="onInput($event)"
            (blur)="markTouched()"
          />
        </p-iconfield>
      } @else {
        <input
          pInputText fluid
          [id]="controlId()" [type]="type()"
          [placeholder]="placeholder()"
          [value]="value() ?? ''"
          [disabled]="disabled()"
          [attr.inputmode]="inputMode() || null"
          [attr.maxlength]="maxLength()"
          [attr.aria-invalid]="!!errorText"
          (input)="onInput($event)"
          (blur)="markTouched()"
        />
      }
    </app-form-field>
  `,
  styles: `:host { display: block; }`,
})
export class InputComponent extends BaseControl<string | number> {
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'url'>('text');
  readonly placeholder = input<string>('');
  /** Classe de ícone PrimeIcons à esquerda. Ex.: 'pi pi-search' */
  readonly icon = input<string>('');
  readonly inputMode = input<string>('');
  readonly maxLength = input<number | null>(null);
  readonly minFractionDigits = input<number>(0);
  readonly maxFractionDigits = input<number>(3);
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);

  protected asNumber(val: string | number | null | undefined): number | null {
    if (val === null || val === undefined || val === '') return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  }

  protected onNumberChange(num: number | null): void {
    this.update(num);
  }

  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    if (this.type() === 'number') {
      this.update(raw === '' ? null : Number(raw));
    } else {
      this.update(raw);
    }
  }
}
