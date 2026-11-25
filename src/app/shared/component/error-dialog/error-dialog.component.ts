import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import { ButtonComponent } from '../button/button.component';
import { ExtractedError, extractErrorMessage } from '../../utils/error-handler.util';

/**
 * Componente modal para exibição de erros (da resposta do backend ou mensagens personalizadas),
 * com mensagem explicativa, detalhes técnicos opcionais (status HTTP, erros de campo) e botão de confirmação.
 *
 * Exemplo de uso:
 * ```html
 * <app-error-dialog
 *   [(visible)]="errorOpen"
 *   [error]="currentError"
 *   fallbackMessage="Não foi possível salvar o produto."
 *   (confirmed)="onErrorDismissed()"
 * />
 * ```
 */
@Component({
  selector: 'app-error-dialog',
  imports: [DialogComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog
      [(visible)]="visible"
      [title]="title()"
      icon="pi-times-circle"
      [width]="width()"
      [dismissable]="true"
      (closed)="onDismiss()"
    >
      <div class="error-dialog-body">
        <div class="error-icon-box">
          <i class="pi pi-exclamation-triangle"></i>
        </div>

        <div class="error-content-area">
          <p class="error-message">{{ parsedError().message }}</p>

          @if (parsedError().status) {
            <div class="error-badge">
              <span class="badge-code">Status HTTP {{ parsedError().status }}</span>
              @if (parsedError().statusText) {
                <span class="badge-text">{{ parsedError().statusText }}</span>
              }
            </div>
          }

          @if (parsedError().details && parsedError().details!.length > 0) {
            <div class="error-details-box">
              <span class="details-title">Detalhes da validação:</span>
              <ul class="details-list">
                @for (item of parsedError().details; track $index) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </div>

      <ng-content />

      <div dialogFooter class="error-footer">
        <app-button
          [label]="confirmLabel()"
          variant="danger"
          (clicked)="onDismiss()"
        />
      </div>
    </app-dialog>
  `,
  styles: `
    .error-dialog-body {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 0.5rem 0;
    }
    .error-icon-box {
      flex: none;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: #fee2e2;
      color: #dc2626;
      display: grid;
      place-items: center;
      font-size: 1.35rem;
    }
    .error-content-area {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .error-message {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      font-weight: 500;
      color: #1e293b;
      word-break: break-word;
    }
    .error-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      background: #f1f5f9;
      color: #64748b;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      width: fit-content;
      font-family: monospace;
    }
    .badge-code {
      font-weight: 600;
      color: #dc2626;
    }
    .error-details-box {
      margin-top: 0.25rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 0.6rem 0.75rem;
      font-size: 0.8125rem;
      color: #991b1b;
    }
    .details-title {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .details-list {
      margin: 0;
      padding-left: 1.25rem;
      line-height: 1.4;
    }
    .error-footer {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  `,
})
export class ErrorDialogComponent {
  /** Controle de visibilidade bidirecional: [(visible)]="errorVisible" */
  readonly visible = model<boolean>(false);

  /** Erro a ser exibido: pode ser HttpErrorResponse, string, Error ou objeto */
  readonly error = input<unknown>(null);

  /** Mensagem padrão caso o erro não contenha texto ou mensagem definida */
  readonly fallbackMessage = input<string>('Ocorreu um erro ao processar sua solicitação.');

  /** Título do modal */
  readonly title = input<string>('Erro na Operação');

  /** Rótulo do botão de confirmação / fechamento */
  readonly confirmLabel = input<string>('Entendido');

  /** Largura do modal */
  readonly width = input<string>('28rem');

  /** Emitido quando o modal é fechado ou confirmado */
  readonly confirmed = output<void>();

  protected readonly parsedError = computed<ExtractedError>(() => {
    return extractErrorMessage(this.error(), this.fallbackMessage());
  });

  protected onDismiss(): void {
    this.visible.set(false);
    this.confirmed.emit();
  }
}
