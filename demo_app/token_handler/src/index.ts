import http, { IncomingMessage, ServerResponse } from "http";
import { authorize } from "./authorizeController.js";
import { returnError } from "./utils.js";
import { getToken } from "./tokenController.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (req.url === "/authorize" && req.method === "POST") {
        await authorize(req, res);
      }

      if (req.url === "/get-token" && req.method === "POST") {
        await getToken(req, res);
      }

      return returnError(res, 404, "Route not found");
    } catch (e) {
      returnError(res, 500, "Something went wrong");
    }
  }
);

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
