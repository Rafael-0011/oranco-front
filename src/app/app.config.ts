import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withXhr } from '@angular/common/http';
import { PRIME_NG_CONFIG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withXhr()),
    { provide: PRIME_NG_CONFIG, useValue: { ripple: true } },
    MessageService
  ]
};
