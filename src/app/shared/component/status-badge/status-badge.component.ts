import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="status-pill"
      [class.status-danger]="severity() === 'danger'"
      [class.status-success]="severity() === 'success'"
      [class.status-warn]="severity() === 'warn'"
      [class.status-info]="severity() === 'info'"
      [class.status-secondary]="severity() === 'secondary'"
      [class.rounded-full]="rounded()"
    >
      @if (iconClass(); as ic) {
        <i [class]="ic" class="badge-icon"></i>
      }
      <span class="badge-text">{{ label() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.015em;
      border-radius: 6px;
      line-height: 1.25;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .rounded-full {
      border-radius: 9999px;
    }

    .badge-icon {
      font-size: 0.75rem;
      line-height: 1;
      display: inline-block;
    }

    .badge-text {
      line-height: 1;
    }

    .status-danger {
      background-color: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .status-success {
      background-color: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .status-warn {
      background-color: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .status-info {
      background-color: #eff6ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    .status-secondary {
      background-color: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
    }
  `
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly severity = input<BadgeSeverity>('secondary');
  readonly icon = input<string>('');
  readonly rounded = input<boolean>(true);

  protected readonly iconClass = computed(() => {
    const ic = this.icon();
    if (!ic) return '';
    return ic.startsWith('pi ') ? ic : `pi ${ic}`;
  });
}
