import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ToastModule } from 'primeng/toast';

/** Coloque UMA vez no app.html: <app-toast /> */
@Component({
  selector: 'app-toast',
  imports: [ToastModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-toast [position]="position()" />`,
})
export class ToastComponent {
  readonly position = input<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'>('top-right');
}
