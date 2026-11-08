import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
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
          @if (iconClass(); as ic) {
            <div class="head-icon"><i [class]="ic"></i></div>
          }
          <div class="head-text">
            <h3 class="head-title">{{ title() }}</h3>
            @if (subtitle()) {
              <span class="head-sub">{{ subtitle() }}</span>
            }
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
    .head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .head-icon {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.5rem;
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      font-size: 1rem;
    }
    .head-title {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.25;
    }
    .head-sub {
      font-size: 0.8125rem;
      color: #94a3b8;
      display: block;
      margin-top: 0.1rem;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
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

  protected readonly iconClass = computed(() => {
    const ic = this.icon();
    if (!ic) return '';
    return ic.startsWith('pi ') ? ic : `pi ${ic}`;
  });
}
