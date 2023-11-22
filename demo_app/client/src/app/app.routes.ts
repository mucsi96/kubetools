import { Routes } from '@angular/router';
import {
  hasRole,
  postAuthorizationRoute
} from './auth.service';
import { MessageComponent } from './message/message.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [() => hasRole('user')],
    component: MessageComponent,
  },
  postAuthorizationRoute
];
