import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// 1. IMPORTE O MÓDULO DE FORMULÁRIOS
import { ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),

    // 2. ADICIONE ELE AQUI
    importProvidersFrom(ReactiveFormsModule)
  ]
};
