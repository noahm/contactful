import { Deta } from "deta";
import { ObjectType } from "deta/dist/types/types/basic";
import { PersistedContact } from "../models/Contact";

export const deta = Deta();
export const contacts = deta.Base("people");

export async function allItems(store: typeof contacts) {
  let ret: Array<ObjectType> = [];
  let result = await store.fetch();
  while (result.count) {
    ret = result.items.concat(ret);
    if (result.last) {
      result = await store.fetch(undefined, { last: result.last });
    }
  }

  return ret as Array<PersistedContact>;
}
