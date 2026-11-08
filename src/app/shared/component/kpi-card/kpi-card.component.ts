import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { CardModule } from 'primeng/card';

export type KpiTone = 'blue' | 'slate' | 'emerald' | 'amber' | 'red';
export type KpiFormat = 'text' | 'number' | 'currency';

@Component({
  selector: 'app-kpi-card',
  imports: [CardModule, CurrencyPipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-card>
      <div class="kpi">
        <div class="info">
          <span class="label">{{ label() }}</span>
          <strong class="value">
            @switch (format()) {
              @case ('currency') { {{ value() | currency: currency() : 'symbol' : digits() }} }
              @case ('number') { {{ value() | number: digits() }} }
              @default { {{ value() }} }
            }
          </strong>
          @if (subtext()) { <span class="subtext">{{ subtext() }}</span> }
        </div>
        @if (icon()) {
          <div class="icon" [attr.data-tone]="tone()"><i [class]="'pi ' + icon()"></i></div>
        }
      </div>
    </p-card>
  `,
  styles: `
    :host { display: block; }
    .kpi { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
    .info { display: flex; flex-direction: column; gap: .25rem; min-width: 0; }
    .label { font-size: .8125rem; color: var(--text-color-secondary, #64748b); }
    .value { font-size: 1.75rem; line-height: 1.15; font-variant-numeric: tabular-nums; }
    .subtext { font-size: .8125rem; color: var(--text-color-secondary, #64748b); }
    .icon { flex: none; width: 2.75rem; height: 2.75rem; border-radius: .75rem; display: grid; place-items: center; font-size: 1.15rem; }
    .icon[data-tone='blue']    { background: #dbeafe; color: #1d4ed8; }
    .icon[data-tone='slate']   { background: #e2e8f0; color: #334155; }
    .icon[data-tone='emerald'] { background: #d1fae5; color: #047857; }
    .icon[data-tone='amber']   { background: #fef3c7; color: #b45309; }
    .icon[data-tone='red']     { background: #fee2e2; color: #b91c1c; }
  `,
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number | null | undefined>();
  readonly subtext = input<string>('');
  readonly icon = input<string>('');
  readonly tone = input<KpiTone>('blue');
  readonly format = input<KpiFormat>('text');
  readonly currency = input<string>('BRL');
  /** Formato de dígitos do pipe. Ex.: '1.2-2' */
  readonly digits = input<string>('1.0-2');
}
