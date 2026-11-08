import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ButtonComponent, ButtonVariant } from '../button/button.component';

export type ConfirmTone = 'danger' | 'warn' | 'info' | 'success';

/**
 * Popup de confirmação.
 * <app-confirm-dialog [(visible)]="confirmOpen" title="Excluir produto?"
 *   message="Esta ação não pode ser desfeita." tone="danger" confirmLabel="Excluir"
 *   [loading]="deleting()" (confirmed)="remove()" />
 */
@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog
      [(visible)]="visible"
      [title]="title()"
      [icon]="icon() || defaultIcon()"
      [width]="width()"
      [dismissable]="!loading()"
      (closed)="cancelled.emit()"
    >
      <p class="message">{{ message() }}</p>
      <ng-content />

      <div dialogFooter>
        <app-button
          [label]="cancelLabel()" variant="secondary" appearance="outlined"
          [disabled]="loading()" (clicked)="cancel()"
        />
        <app-button
          [label]="confirmLabel()" [variant]="buttonVariant()"
          [loading]="loading()" (clicked)="confirmed.emit()"
        />
      </div>
    </app-dialog>
  `,
  styles: `.message { margin: 0; line-height: 1.5; color: var(--text-color, #1e293b); }`,
})
export class ConfirmDialogComponent {
  readonly visible = model<boolean>(false);
  readonly title = input<string>('Confirmar ação');
  readonly message = input<string>('Deseja realmente continuar?');
  readonly tone = input<ConfirmTone>('info');
  readonly icon = input<string>('');
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');
  readonly loading = input<boolean>(false);
  readonly width = input<string>('26rem');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  protected readonly buttonVariant = computed<ButtonVariant>(() => this.tone());
  protected readonly defaultIcon = computed(() =>
    ({ danger: 'pi-trash', warn: 'pi-exclamation-triangle', info: 'pi-question-circle', success: 'pi-check-circle' })[this.tone()],
  );

  protected cancel(): void {
    this.visible.set(false);
    this.cancelled.emit();
  }
}
