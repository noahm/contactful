import * as trpc from "@trpc/server";
import { z } from "zod";
import { allItems, contacts } from "./deta";
import * as trpcExpress from "@trpc/server/adapters/express";
import { Contact } from "../models/Contact";

const contactType = z.object({ key: z.string().optional() }).passthrough();

const router = trpc
  .router()
  .query("allPeople", {
    resolve() {
      return allItems(contacts);
    },
  })
  .mutation("savePerson", {
    input: contactType,
    resolve({ input }) {
      return contacts.put(input, input.key) as Promise<Contact>;
    },
  })
  .mutation("saveMany", {
    input: z.array(contactType),
    resolve({ input }) {
      return contacts.putMany(input).then((results) => results.processed.items);
    },
  })
  .mutation("deletePerson", {
    input: (inp: unknown) => {
      if (typeof inp === "string") {
        return inp;
      }
      throw new Error("Received non-string input: " + JSON.stringify(inp));
    },
    resolve({ input }) {
      return contacts.delete(input);
    },
  });

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router,
});
export type AppRouter = typeof router;
