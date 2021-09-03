import * as trpc from "@trpc/server";
import { z } from "zod";
import { allItems, contacts } from "./deta";
import * as trpcExpress from "@trpc/server/adapters/express";
import { PersistedContact } from "../models/Contact";

const router = trpc
  .router()
  .query("allPeople", {
    resolve() {
      return allItems(contacts);
    },
  })
  .mutation("savePerson", {
    input: z.object({ key: z.string().optional() }).passthrough(),
    resolve({ input }) {
      return contacts.put(input, input.key) as Promise<PersistedContact>;
    },
  })
  .mutation("deletePerson", {
    input: z.string(),
    resolve({ input }) {
      return contacts.delete(input);
    },
  });

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router,
  createContext: () => null,
});
export type AppRouter = typeof router;
