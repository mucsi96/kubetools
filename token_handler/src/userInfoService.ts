import {
  WWWAuthenticateChallenge,
  parseWwwAuthenticateChallenges,
  processUserInfoResponse,
  skipSubjectCheck,
  userInfoRequest,
} from "oauth4webapi";
import { discover } from "./discoveryService.js";
import { client } from "./clientConfig.js";

export async function getUserInfo({ accessToken }: { accessToken: string }) {
  const authorizationServer = await discover();
  const response = await userInfoRequest(
    authorizationServer,
    client,
    accessToken
  );

  let challenges: WWWAuthenticateChallenge[] | undefined;
  if ((challenges = parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.log("challenge", challenge);
    }
    throw new Error("www-authenticate challenge");
  }

  const result = await processUserInfoResponse(
    authorizationServer,
    client,
    skipSubjectCheck,
    response
  );

  return result;
}
