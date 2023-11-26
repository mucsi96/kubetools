import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly locationStrategy: LocationStrategy
  ) {}

  async getUserInfo() {
    this.http.get('/auth/user-info').subscribe((userInfo) => {
      console.log(userInfo);
    });
  }

  async authorize() {
    this.http
      .post<{
        authorizationUrl: string;
      }>('/auth/authorize', { redirectUri: this.redirectUri })
      .subscribe(({ authorizationUrl }) => {
        location.href = authorizationUrl;
      });
  }

  async handlePostAuthorize() {
    this.http
      .post<{ expiresIn: number; userName: string; roles: string[] }>(
        '/auth/get-token',
        {
          callbackUrl: location.href.toString(),
          redirectUri: this.redirectUri,
        }
      )
      .subscribe(({ expiresIn, userName, roles }) => {
        console.log({ expiresIn, userName, roles });
        this.router.navigate(['']);
      });
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
  await authService.getUserInfo();

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

@Component({
  selector: 'authorization',
  template: '<button (click)="onAuthorize()" type="button">Authorize</button>',
})
class AuthorizationComponent {
  constructor(private readonly authService: AuthService) {}

  onAuthorize(): void {
    this.authService.authorize();
  }
}

export const authorizationRoutes: Route[] = [
  {
    path: 'login',
    component: AuthorizationComponent,
  },
  {
    path: postAuthorizationPath,
    component: PostAuthorizationComponent,
  },
];
