import { Contact } from "../../models/Contact";

function compValue(c: Contact) {
  // ? is a special sentinel value that belongs at top of list
  if (c.name === "?") {
    return -Infinity;
  }

  const last = c.last;
  if (!last) {
    return 0;
  }

  const lastDate = new Date(last);
  return -lastDate.getTime();
}

export function contactsSort(a: Contact, b: Contact) {
  return compValue(a) - compValue(b);
}
