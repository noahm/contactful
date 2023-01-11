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

app.use(express.json());
app.use("/api", (req, res, next) => {
  console.log("api call for", { path: req.url, body: req.body });
  return trpcMiddleware(req, res, next);
});

app.listen(process.env.PORT);