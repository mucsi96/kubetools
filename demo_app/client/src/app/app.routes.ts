import { Routes } from '@angular/router';
import { MessageComponent } from './message/message.component';
import { PostAuthorizationComponent } from './postAuthorization.component';
import { hasRole } from './auth.service';

export const postAuthorization = 'post-authorization';

export const routes: Routes = [
  {
    path: '',
    canActivate: [() => hasRole('user')],
    component: MessageComponent,
  },
  {
    path: postAuthorization,
    component: PostAuthorizationComponent,
  },
];
