import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { UserInfoResponse } from 'oauth4webapi';
import { EMPTY, catchError, map, of, shareReplay, tap } from 'rxjs';

const authorizationPath = 'login';
const postAuthorizationPath = 'post-authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUri =
    location.origin +
    this.locationStrategy.prepareExternalUrl(postAuthorizationPath);
  userInfo: UserInfoResponse | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly locationStrategy: LocationStrategy
  ) {}

  getUserInfo() {
    return this.http.get<UserInfoResponse>('/auth/user-info').pipe(
      catchError(() => {
        this.router.navigate([authorizationPath]);
        return EMPTY;
      }),
      shareReplay(1)
    );
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
      .post<void>('/auth/get-token', {
        callbackUrl: location.href.toString(),
        redirectUri: this.redirectUri,
      })
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }

  getUserName() {
    return this.getUserInfo().pipe(map((userInfo) => userInfo.name));
  }

  getRoles() {
    return this.getUserInfo().pipe(
      map((userInfo) => (userInfo['groups'] ?? []) as string[])
    );
  }

  hasRole(role: string) {
    return this.getRoles().pipe(map((roles) => roles.includes(role)));
  }
}

export function hasRole(role: string) {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.hasRole(role).pipe(
    tap((authorized) => {
      if (!authorized) {
        router.navigate([authorizationPath]);
      }

      return authorized;
    })
  );
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
