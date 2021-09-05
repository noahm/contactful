import { Contact } from "../../models/Contact";

/**
 * Mutates contact by removing empty values from any array fields
 */
export function trimArrays(contact: Contact) {
  for (const key in contact) {
    const value = contact[key];
    if (Array.isArray(value)) {
      contact[key] = value.filter((v) => !!v);
    }
  }
}
