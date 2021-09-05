import express from "express";
import path from "path";
import { trpcMiddleware } from "./trpc";

const app = express();

const serveStatic = express.static(path.resolve(__dirname, "../../build"));

app.use((req, res, next) => {
  serveStatic(req, res, next);
  if (req.url === "/") {
    res.setHeader("cache-control", "no-store");
  }
});

app.use("/api", trpcMiddleware);

export = app;
