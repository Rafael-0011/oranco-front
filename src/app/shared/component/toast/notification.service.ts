import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Notificações rápidas (toast). Requer <app-toast /> no layout e MessageService nos providers. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = inject(MessageService);

  success(detail: string, summary = 'Sucesso'): void { this.show('success', summary, detail); }
  error(detail: string, summary = 'Erro'): void { this.show('error', summary, detail, 6000); }
  warn(detail: string, summary = 'Atenção'): void { this.show('warn', summary, detail); }
  info(detail: string, summary = 'Informação'): void { this.show('info', summary, detail); }

  private show(severity: string, summary: string, detail: string, life = 4000): void {
    this.messages.add({ severity, summary, detail, life });
  }
}
