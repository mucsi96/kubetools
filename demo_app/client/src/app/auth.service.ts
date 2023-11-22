import { LocationStrategy } from '@angular/common';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import {
  AuthorizationServer,
  Client,
  OpenIDTokenEndpointResponse,
  WWWAuthenticateChallenge,
  authorizationCodeGrantRequest,
  calculatePKCECodeChallenge,
  discoveryRequest,
  generateRandomCodeVerifier,
  generateRandomNonce,
  generateRandomState,
  getValidatedIdTokenClaims,
  isOAuth2Error,
  parseWwwAuthenticateChallenges,
  processAuthorizationCodeOpenIDResponse,
  processDiscoveryResponse,
  validateAuthResponse,
} from 'oauth4webapi';

const postAuthorizationPath = 'post-authorization';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  client: Client = {
    client_id: 'demo-app',
    token_endpoint_auth_method: 'none',
  };
  redirectUri =
    location.origin +
    this.locationStrategy.prepareExternalUrl(postAuthorizationPath);
  authorizationServer?: AuthorizationServer;
  tokenResponse?: OpenIDTokenEndpointResponse;

  constructor(
    private readonly router: Router,
    private readonly locationStrategy: LocationStrategy
  ) {}

  async discover() {
    if (this.authorizationServer) {
      return;
    }

    const issuer = new URL('https://auth.kubetools.ibari.ch');
    this.authorizationServer = await processDiscoveryResponse(
      issuer,
      await discoveryRequest(issuer)
    );
    if (
      this.authorizationServer.code_challenge_methods_supported?.includes(
        'S256'
      ) !== true
    ) {
      // This example assumes S256 PKCE support is signalled
      // If it isn't supported, random `nonce` must be used for CSRF protection.
      throw new Error();
    }
  }

  async authorize({ silent }: { silent?: boolean } = {}) {
    if (silent && this.tokenResponse) {
      return;
    }

    await this.discover();
    const codeVerifier = generateRandomCodeVerifier();
    const state = generateRandomState();
    const nonce = generateRandomNonce();
    const authorizationUrl = new URL(
      this.authorizationServer!.authorization_endpoint!
    );

    authorizationUrl.searchParams.set('client_id', this.client.client_id);
    authorizationUrl.searchParams.set(
      'code_challenge',
      await calculatePKCECodeChallenge(codeVerifier)
    );
    authorizationUrl.searchParams.set('code_challenge_method', 'S256');
    authorizationUrl.searchParams.set('redirect_uri', this.redirectUri);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid groups profile email');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('nonce', nonce);

    if (silent) {
      authorizationUrl.searchParams.set('prompt', 'none');
    }

    sessionStorage.setItem('codeVerifier', codeVerifier);
    sessionStorage.setItem('state', state);
    sessionStorage.setItem('nonce', nonce);

    location.href = authorizationUrl.toString();
  }

  async handlePostAuthorize() {
    await this.discover();

    const codeVerifier = sessionStorage.getItem('codeVerifier');
    const state = sessionStorage.getItem('state');
    const nonce = sessionStorage.getItem('nonce');

    const params = validateAuthResponse(
      this.authorizationServer!,
      this.client,
      new URL(window.location.href),
      state!
    );

    if (isOAuth2Error(params)) {
      console.log('error', params);
      throw new Error(); // Handle OAuth 2.0 redirect error
    }

    const response = await authorizationCodeGrantRequest(
      this.authorizationServer!,
      this.client,
      params,
      this.redirectUri,
      codeVerifier!
    );

    let challenges: WWWAuthenticateChallenge[] | undefined;
    if ((challenges = parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.log('challenge', challenge);
      }
      throw new Error(); // Handle www-authenticate challenges as needed
    }

    const tokenResponse = await processAuthorizationCodeOpenIDResponse(
      this.authorizationServer!,
      this.client,
      response,
      nonce!
    );
    if (isOAuth2Error(tokenResponse)) {
      console.log('error', tokenResponse);
      throw new Error(); // Handle OAuth 2.0 response body error
    }

    this.tokenResponse = tokenResponse;
    this.router.navigate(['']);
  }

  getUserName() {
    if (!this.tokenResponse) {
      return undefined;
    }

    const { name } = getValidatedIdTokenClaims(this.tokenResponse);

    return name as string | undefined;
  }

  getRoles() {
    if (!this.tokenResponse) {
      return [];
    }

    const { groups } = getValidatedIdTokenClaims(this.tokenResponse);

    return (groups ?? []) as string[];
  }
}

export async function hasRole(role: string) {
  const authService: AuthService = inject(AuthService);
  await authService.authorize({ silent: true });

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
  component: PostAuthorizationComponent
}
