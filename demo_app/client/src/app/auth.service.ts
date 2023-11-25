import { LocationStrategy } from '@angular/common';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { Route, Router } from '@angular/router';

const postAuthorizationPath = 'post-authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUri =
    location.origin +
    this.locationStrategy.prepareExternalUrl(postAuthorizationPath);

  constructor(
    private readonly router: Router,
    private readonly locationStrategy: LocationStrategy
  ) {}

  async authorize() {
    console.log(
      await (await fetch('/auth/authorize', { method: 'POST' })).json()
    );

    // location.href = authorizationUrl.toString();
  }

  async handlePostAuthorize() {
    console.log(
      await (await fetch('/auth/get-token', { method: 'POST' })).json()
    );

    this.router.navigate(['']);
  }

  getUserName() {
    return '';
  }

  getRoles() {
    return ['user'];
  }
}

export async function hasRole(role: string) {
  const authService: AuthService = inject(AuthService);
  await authService.authorize();

  return authService.getRoles().includes(role);
}

@Component({
  selector: 'post-authorization',
  template: '',
})
class PostAuthorizationComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handlePostAuthorize();
  }
}

export const postAuthorizationRoute: Route = {
  path: postAuthorizationPath,
  component: PostAuthorizationComponent,
};
