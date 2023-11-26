import {
  Client,
  WWWAuthenticateChallenge,
  authorizationCodeGrantRequest,
  getValidatedIdTokenClaims,
  isOAuth2Error,
  parseWwwAuthenticateChallenges,
  processAuthorizationCodeOpenIDResponse,
  validateAuthResponse,
} from "oauth4webapi";
import { discover } from "./discoveryService.js";
import { getEnv } from "./utils.js";

const client: Client = {
  client_id: getEnv("CLIENT_ID"),
  client_secret: getEnv("CLIENT_SECRET"),
  token_endpoint_auth_method: "client_secret_basic",
};

export async function getToken({
  codeVerifier,
  state,
  nonce,
  callbackUrl,
  redirectUri,
}: {
  codeVerifier: string;
  state: string;
  nonce: string;
  callbackUrl: string;
  redirectUri: string;
}) {
  const authorizationServer = await discover();

  const params = validateAuthResponse(
    authorizationServer!,
    client,
    new URL(callbackUrl),
    state!
  );

  if (isOAuth2Error(params)) {
    console.log("error", params);
    throw new Error("OAuth 2.0 redirect error");
  }

  const response = await authorizationCodeGrantRequest(
    authorizationServer!,
    client,
    params,
    redirectUri,
    codeVerifier!
  );

  let challenges: WWWAuthenticateChallenge[] | undefined;

  if ((challenges = parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.log("challenge", challenge);
    }
    throw new Error("www-authenticate challenge");
  }

  const tokenResponse = await processAuthorizationCodeOpenIDResponse(
    authorizationServer!,
    client,
    response,
    nonce!
  );

  if (isOAuth2Error(tokenResponse)) {
    console.log("error", tokenResponse);
    throw new Error("OAuth 2.0 response body error");
  }

  const { name, groups } = getValidatedIdTokenClaims(tokenResponse);

  console.log(tokenResponse);

  return {
    accessToken: tokenResponse.access_token,
    expiresIn: tokenResponse.expires_in,
    refreshToken: tokenResponse.refresh_token,
    userName: name,
    roles: groups ?? [],
  };
}
