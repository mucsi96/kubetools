import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoResponse } from 'oauth4webapi';
import { EMPTY, catchError, map, shareReplay } from 'rxjs';
import { RouterTokens } from '../app.routes';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  redirectUri =
    location.origin +
    this.locationStrategy.prepareExternalUrl(
      RouterTokens.SIGNIN_REDIRECT_CALLBACK
    );
  userInfo: UserInfoResponse | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly locationStrategy: LocationStrategy
  ) {}

  getUserInfo() {
    return this.http.get<UserInfoResponse>('/auth/user-info').pipe(
      catchError((err) => {
        this.router.navigate([RouterTokens.SIGNIN]);
        throw err;
      }),
      shareReplay(1)
    );
  }

  async signin() {
    this.http
      .post<{
        authorizationUrl: string;
      }>('/auth/authorize', { redirectUri: this.redirectUri })
      .subscribe(({ authorizationUrl }) => {
        location.href = authorizationUrl;
      });
  }

  async handleSigninRedirectCallback() {
    this.http
      .post<void>('/auth/get-token', {
        callbackUrl: location.href.toString(),
        redirectUri: this.redirectUri,
      })
      .subscribe(() => {
        this.router.navigate([RouterTokens.HOME]);
      });
  }

  isSignedIn() {
    return this.getUserInfo().pipe(map((userInfo) => !!userInfo.sub));
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

  signout() {
    this.http.post('/auth/logout', {}).subscribe(() => {
      this.router.navigate([RouterTokens.SIGNIN]);
    });
  }
}
