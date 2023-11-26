import * as userInfoService from "./userInfoService.js";

import { IncomingMessage, ServerResponse } from "http";
import {
  parseCookieString,
  returnError
} from "./utils.js";

export async function getUserInfo(req: IncomingMessage, res: ServerResponse) {
  const { accessToken } = parseCookieString<{
    accessToken: string;
  }>(req.headers.cookie);

  if (!accessToken) {
    return returnError(res, 400, "Missing accessToken");
  }

  const userInfo = await userInfoService.getUserInfo({ accessToken });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.write(JSON.stringify(userInfo));
  res.end();
  return;
}
