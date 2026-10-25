import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

export type BadgeSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

@Component({
  selector: 'app-status-badge',
  imports: [TagModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-tag [value]="label()" [severity]="severity()" [icon]="icon()" [rounded]="rounded()" />`,
  styles: `:host { display: inline-block; }`,
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();
  readonly severity = input<BadgeSeverity>('secondary');
  readonly icon = input<string>('');
  readonly rounded = input<boolean>(true);
}
