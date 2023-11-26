import * as userInfoService from "./userInfoService.js";

import { IncomingMessage, ServerResponse } from "http";
import { parseCookieString, returnError } from "./utils.js";

export async function getUserInfo(req: IncomingMessage, res: ServerResponse) {
  const { accessToken, subject } = parseCookieString<{
    subject: string;
    accessToken: string;
  }>(req.headers.cookie);

  if (!subject) {
    return returnError(res, 400, "Missing subject");
  }

  if (!accessToken) {
    return returnError(res, 400, "Missing accessToken");
  }

  const userInfo = await userInfoService.getUserInfo({ subject, accessToken });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.write(JSON.stringify(userInfo));
  res.end();
  return;
}
