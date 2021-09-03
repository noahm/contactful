import type { AppRouter } from "../../server/trpc";
import { createTRPCClient } from "@trpc/client";

export const client = createTRPCClient<AppRouter>({
  url:
    process.env.NODE_ENV === "production"
      ? "/api"
      : "https://something.deta.dev/api",
});
