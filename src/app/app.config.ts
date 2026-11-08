import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { PRIME_NG_CONFIG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { routes } from './app.routes';

registerLocaleData(ptBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withXhr()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: PRIME_NG_CONFIG, useValue: { ripple: true } },
    MessageService
  ]
};
