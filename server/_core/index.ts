import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "node:path";
import fs from "node:fs";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { createCorsMiddleware } from "./cors";
import { clearLegacySessionCookie } from "./cookies";

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(createCorsMiddleware());
  app.use(clearLegacySessionCookie());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Serve the exported Expo app and API from one origin when deployed.
  const webRoot = path.resolve(process.env.SCOTTY_WEB_ROOT || "web-dist");
  if (fs.existsSync(path.join(webRoot, "index.html"))) {
    app.use(
      express.static(webRoot, { extensions: ["html"], index: "index.html" }),
    );
    app.get("*", (req, res) => {
      if (
        req.path.startsWith("/api/") ||
        req.path.startsWith("/manus-storage/")
      ) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res
        .status(404)
        .sendFile(path.join(webRoot, "+not-found.html"), (error) => {
          if (error && !res.headersSent) res.status(404).send("Page not found");
        });
    });
  }

  const port = parseInt(process.env.PORT || "3000");
  server.listen(port, () => {
    console.log("[api] server listening");
  });
}

startServer().catch(() => {
  console.error("[api] server failed to start");
});
