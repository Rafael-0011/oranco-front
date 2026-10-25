import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';
export type ButtonAppearance = 'solid' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  imports: [ButtonModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <button
      pButton
      [type]="type()"
      [severity]="severity()"
      [outlined]="appearance() === 'outlined'"
      [text]="appearance() === 'text'"
      [rounded]="rounded()"
      [size]="primeSize()"
      [fluid]="fluid()"
      [loading]="loading()"
      [disabled]="disabled() || loading()"
      [pTooltip]="tooltip()"
      [attr.aria-label]="ariaLabel() || tooltip() || label() || null"
      (click)="clicked.emit($event)"
    >
      @if (icon() && iconPos() === 'left') { <i pButtonIcon [class]="icon()"></i> }
      @if (label()) { <span pButtonLabel>{{ label() }}</span> }
      @if (icon() && iconPos() === 'right') { <i pButtonIcon [class]="icon()"></i> }
    </button>
  `,
  styles: `:host { display: inline-block; } :host([fluid]) { display: block; }`,
  host: { '[attr.fluid]': 'fluid() ? "" : null' },
})
export class ButtonComponent {
  readonly label = input<string>('');
  readonly icon = input<string>('');
  readonly iconPos = input<'left' | 'right'>('left');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly appearance = input<ButtonAppearance>('solid');
  readonly size = input<ButtonSize>('medium');
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly rounded = input<boolean>(false);
  readonly fluid = input<boolean>(false);
  readonly tooltip = input<string>('');
  readonly ariaLabel = input<string>('');

  readonly clicked = output<MouseEvent>();

  protected readonly severity = computed(() =>
    this.variant() === 'primary' ? undefined : this.variant(),
  );
  protected readonly primeSize = computed(() =>
    this.size() === 'small' ? 'small' : this.size() === 'large' ? 'large' : undefined,
  );
}
