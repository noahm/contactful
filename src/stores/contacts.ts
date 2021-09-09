import create from "zustand";
import produce from "immer";
import { Guid } from "guid-ts";
import { client } from "../utils/trpc";
import { setQuery, getQuery } from "../utils/query";
import type { Contact } from "../../models/Contact";
import { filterForTerm } from "../utils/search";
import { todayISO } from "../utils/today";
import { contactsSort } from "../utils/sort";
import { trimArrays } from "../utils/trimArrays";

interface Store {
  allContacts: Array<Contact>;
  filteredContacts: Array<Contact>;
  contactsByKey: Record<string, Contact>;
  loading: boolean;
  createNewContact(): Promise<Contact>;
  applyFilter(term: string): void;
  loadContacts(): Promise<void>;
  saveContact(contact: Contact): Promise<Contact>;
  deleteContact(contact: Contact): Promise<void>;
}

function replaceInArr(arr: Array<Contact>, newContact: Contact) {
  const idx = arr.findIndex((c) => c.key === newContact.key);
  if (idx >= 0) {
    arr[idx] = newContact;
  }
}

export const useStore = create<Store>((set) => ({
  allContacts: [],
  filteredContacts: [],
  contactsByKey: {},
  loading: false,
  createNewContact: async () => {
    const baseContact: Contact = {
      key: Guid.newGuid().toString(),
      name: "?",
      last: todayISO(),
      __local: "true",
    };
    set(
      produce((state: Store) => {
        state.allContacts.unshift(baseContact);
        state.filteredContacts.unshift(baseContact);
      })
    );
    return baseContact;
  },
  applyFilter: (term: string) => {
    setQuery(term);
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      set((store) => {
        return { filteredContacts: store.allContacts };
      });
      return;
    }
    set((store) => {
      return {
        filteredContacts: store.allContacts.filter(filterForTerm(trimmedTerm)),
      };
    });
  },
  loadContacts: async () => {
    set({ loading: true });
    const allContacts = await client.query("allPeople");
    allContacts.sort(contactsSort);
    const contactsByKey: Store["contactsByKey"] = {};
    for (const c of allContacts) {
      contactsByKey[c.key] = c;
    }
    const queryTerm = getQuery();
    let filteredContacts = allContacts;
    if (queryTerm) {
      filteredContacts = filteredContacts.filter(filterForTerm(queryTerm));
    }
    set({
      loading: false,
      allContacts,
      filteredContacts,
      contactsByKey,
    });
  },
  saveContact: async (contact) => {
    contact = produce(contact, (c) => {
      trimArrays(c);
      if (c.__local) {
        delete c.__local;
      }
    });
    client.mutation("savePerson", contact);
    set(
      produce((state: Store) => {
        state.contactsByKey[contact.key!] = contact;
        replaceInArr(state.allContacts, contact);
        replaceInArr(state.filteredContacts, contact);
        state.allContacts.sort(contactsSort);
        state.filteredContacts.sort(contactsSort);
      })
    );
    return contact;
  },
  deleteContact: async (contact) => {
    if (contact.name !== "?" && !window.confirm(`Delete ${contact.name}?`)) {
      return;
    }
    set((store) => {
      const allContacts = store.allContacts.filter(
        (c) => c.key !== contact.key
      );
      const filteredContacts = store.filteredContacts.filter(
        (c) => c.key !== contact.key
      );
      const contactsByKey = { ...store.contactsByKey };
      delete contactsByKey[contact.key!];
      return { allContacts, filteredContacts, contactsByKey };
    });
    if (!contact.__local) {
      client.mutation("deletePerson", contact.key);
    }
  },
}));
