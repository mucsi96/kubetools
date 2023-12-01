import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from './message/message.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    AuthService,
    MessageService,
  ],
};
