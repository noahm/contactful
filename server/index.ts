import express from "express";
import path from "path";
import { trpcMiddleware } from "./trpc";

const app = express();

app.use(express.static(path.join(__dirname, "../dist")));

app.use("/api", trpcMiddleware);

export = app;
