import type { AppRouter } from "../../server/trpc";
import { createTRPCClient } from "@trpc/client";

export const client = createTRPCClient<AppRouter>({
  url: "/api",
});
