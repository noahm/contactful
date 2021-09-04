import express from "express";
import path from "path";
import { trpcMiddleware } from "./trpc";

const app = express();

app.use(express.static(path.resolve(__dirname, "../../build")));

app.use("/api", trpcMiddleware);

export = app;
