import { IncomingMessage, ServerResponse } from "http";

export function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing.`);
  }

  return value;
}

export function getBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body ? JSON.parse(body) : {});
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function returnError(
  res: ServerResponse,
  statusCode: number,
  message: string
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message }));
}

export function generateCookieString(
  cookies: { name: string; value: string; maxAge: number }[]
): string[] {
  return cookies
    .map(({ name, value, maxAge }) => {
      const cookieOptions = [
        "HttpOnly",
        "SameSite=Lax",
        "Secure",
        "Path=/",
        `Max-Age=${maxAge}`,
      ];

      return `${name}=${encodeURIComponent(value)}; ${cookieOptions.join(
        "; "
      )}`;
    })
    .filter(Boolean);
}

export function parseCookieString<T>(cookieString?: string): T {
  if (!cookieString) return {} as T;

  return cookieString.split(`;`).reduce((acc, cookie) => {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return acc;
    const value = rest.join(`=`).trim();
    if (!value) return acc;
    return { ...acc, [name]: decodeURIComponent(value) };
  }, {}) as T;
}
