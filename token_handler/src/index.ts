import http, { IncomingMessage, ServerResponse } from "http";
import { authorize } from "./authorizeController.js";
import { returnError } from "./utils.js";
import { getToken } from "./tokenController.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (req.url === "/health" && req.method === "GET") {
        res.writeHead(200);
        res.end("Health check passed!");
        return;
      }

      if (req.url === "/authorize" && req.method === "POST") {
        return await authorize(req, res);
      }

      if (req.url === "/get-token" && req.method === "POST") {
        return await getToken(req, res);
      }

      return returnError(res, 404, "Route not found");
    } catch (e) {
      return returnError(res, 500, "Something went wrong");
    }
  }
);

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

// Graceful shutdown on SIGTERM signal
process.on("SIGTERM", () => {
  console.info("Received SIGTERM signal. Closing server gracefully.");
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
});