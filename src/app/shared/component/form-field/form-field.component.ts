import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Wrapper: label + conteúdo (projetado) + dica/erro. */
@Component({
  selector: 'app-form-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      @if (label()) {
        <label class="field-label" [for]="forId()">
          {{ label() }}@if (required()) { <span class="req" aria-hidden="true"> *</span> }
        </label>
      }
      <ng-content />
      @if (error()) {
        <small class="field-error" role="alert">{{ error() }}</small>
      } @else if (hint()) {
        <small class="field-hint">{{ hint() }}</small>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .field { display: flex; flex-direction: column; gap: .375rem; }
    .field-label { font-size: .875rem; font-weight: 600; color: var(--text-color, #1e293b); }
    .req { color: var(--p-red-500, #ef4444); }
    .field-error { color: var(--p-red-600, #dc2626); font-size: .8125rem; }
    .field-hint { color: var(--text-color-secondary, #64748b); font-size: .8125rem; }
  `,
})
export class FormFieldComponent {
  readonly label = input<string>('');
  readonly forId = input<string>('');
  readonly required = input<boolean>(false);
  readonly hint = input<string>('');
  readonly error = input<string | null>(null);
}
