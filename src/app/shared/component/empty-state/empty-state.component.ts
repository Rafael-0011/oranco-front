import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <div class="icon-wrap"><i [class]="'pi ' + icon()"></i></div>
      <h4 class="title">{{ title() }}</h4>
      @if (subtitle()) { <p class="subtitle">{{ subtitle() }}</p> }
      <ng-content />
    </div>
  `,
  styles: `
    .empty { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 2.5rem 1rem; text-align: center; }
    .icon-wrap { width: 3.5rem; height: 3.5rem; border-radius: 50%; display: grid; place-items: center;
      background: var(--p-surface-100, #f1f5f9); color: var(--p-surface-500, #64748b); font-size: 1.5rem; }
    .title { margin: .25rem 0 0; font-size: 1rem; font-weight: 600; }
    .subtitle { margin: 0 0 .5rem; max-width: 28rem; color: var(--text-color-secondary, #64748b); font-size: .875rem; }
  `,
})
export class EmptyStateComponent {
  readonly icon = input<string>('pi-inbox');
  readonly title = input<string>('Nenhum registro encontrado');
  readonly subtitle = input<string>('');
}
