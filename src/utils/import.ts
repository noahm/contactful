import { Guid } from "guid-ts";
import { Contact } from "../../models/Contact";
import { todayISO } from "./today";

export function importOutlook(csv: Array<Record<string, string>>): Contact[] {
  const ret: Contact[] = [];
  for (const item of csv) {
    const contact = newContact();
    contact.name = [item["First Name"], item["Middle Name"], item["Last Name"]]
      .filter(Boolean)
      .join(" ");
    contact.email = [
      item["E-mail Address"],
      item["E-mail 2 Address"],
      item["E-mail 3 Address"],
    ].filter(Boolean);
    contact.tel = [
      item["Home Phone"],
      item["Home Phone 2"],
      item["Business Phone"],
      item["Business Phone 2"],
      item["Mobile Phone"],
      item["Car Phone"],
      item["Other Phone"],
      item["Primary Phone"],
    ].filter(Boolean);
    if (!contact.name && !contact.email.length && !contact.tel.length) {
      continue;
    }

    contact.notes = item["Notes"];
    contact.place = item["Location"];

    ret.push(contact);
  }
  return ret;
}

export function newContact(): Contact {
  return {
    key: Guid.newGuid().toString(),
    name: "?",
    last: todayISO(),
    __local: "true",
  };
}
