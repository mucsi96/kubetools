import { Routes } from '@angular/router';
import { hasRole } from './auth/hasRole';
import { SigninRedirectCallbackComponent } from './auth/signin-redirect-callback.component';
import { SigninComponent } from './auth/signin.component';
import { MessageComponent } from './message/message.component';

export enum RouterTokens {
  HOME = '',
  SIGNIN = 'signin',
  SIGNIN_REDIRECT_CALLBACK = 'signin-redirect-callback',
}

export const routes: Routes = [
  {
    path: RouterTokens.HOME,
    canActivate: [() => hasRole('user')],
    component: MessageComponent,
  },
  {
    path: RouterTokens.SIGNIN,
    component: SigninComponent,
  },
  {
    path: RouterTokens.SIGNIN_REDIRECT_CALLBACK,
    component: SigninRedirectCallbackComponent,
  },
];
