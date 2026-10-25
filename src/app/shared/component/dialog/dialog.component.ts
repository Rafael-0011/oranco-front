import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

/**
 * Modal reutilizável.
 * Uso:
 *   <app-dialog [(visible)]="open" title="Novo produto" subtitle="..." icon="pi-box">
 *     ...conteúdo...
 *     <div dialogFooter> botões </div>
 *   </app-dialog>
 */
@Component({
  selector: 'app-dialog',
  imports: [DialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      [draggable]="draggable()"
      [resizable]="false"
      [dismissableMask]="dismissable()"
      [closeOnEscape]="dismissable()"
      [style]="{ width: width(), maxWidth: '95vw' }"
      (onHide)="closed.emit()"
    >
      <ng-template #header>
        <div class="head">
          @if (icon()) { <div class="head-icon"><i [class]="'pi ' + icon()"></i></div> }
          <div class="head-text">
            <h3 class="head-title">{{ title() }}</h3>
            @if (subtitle()) { <span class="head-sub">{{ subtitle() }}</span> }
          </div>
        </div>
      </ng-template>

      <ng-content />

      <ng-template #footer>
        <div class="footer"><ng-content select="[dialogFooter]" /></div>
      </ng-template>
    </p-dialog>
  `,
  styles: `
    .head { display: flex; align-items: center; gap: .75rem; }
    .head-icon { width: 2.5rem; height: 2.5rem; border-radius: .75rem; display: grid; place-items: center;
      background: #dbeafe; color: #1d4ed8; }
    .head-title { margin: 0; font-size: 1.05rem; font-weight: 700; }
    .head-sub { font-size: .8125rem; color: var(--text-color-secondary, #64748b); }
    .footer { display: flex; justify-content: flex-end; gap: .5rem; }
  `,
})
export class DialogComponent {
  readonly visible = model<boolean>(false);
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');
  readonly width = input<string>('32rem');
  readonly draggable = input<boolean>(false);
  readonly dismissable = input<boolean>(true);
  readonly closed = output<void>();
}
