import { Deta } from "deta";
import { ObjectType } from "deta/dist/types/types/basic";
import { PersistedContact } from "../models/Contact";

export const deta = Deta();
export const contacts = deta.Base("people");

export async function allItems(store: typeof contacts) {
  let ret: Array<ObjectType> = [];
  console.log("fetching from store");
  let result = await store.fetch();
  while (true) {
    console.log(`got ${result.count} items`);
    ret = result.items.concat(ret);
    if (result.last) {
      console.log(`Have more results, fetching from store again`);
      result = await store.fetch(undefined, { last: result.last });
    } else {
      break;
    }
  }

  return ret as Array<PersistedContact>;
}
