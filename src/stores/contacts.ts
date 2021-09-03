import create from "zustand";
import produce from "immer";
import { client } from "../utils/trpc";
import { setQuery } from "../utils/query";
import type { Contact } from "../../models/Contact";
import { filterForTerm } from "../utils/search";
import { todayISO } from "../utils/today";

interface Store {
  allContacts: Array<Contact>;
  filteredContacts: Array<Contact>;
  contactsByKey: Record<string, Contact>;
  loading: boolean;
  createNewContact(): Contact;
  applyFilter(term: string): void;
  loadContacts(): Promise<void>;
  saveContact(contact: Contact): Promise<Contact>;
  deleteContact(contact: Contact): Promise<void>;
}

export const useStore = create<Store>((set) => ({
  allContacts: [],
  filteredContacts: [],
  contactsByKey: {},
  loading: false,
  createNewContact() {
    const newContact: Contact = { key: undefined, name: "?", last: todayISO() };
    set(
      produce((state: Store) => {
        state.allContacts.unshift(newContact);
        state.filteredContacts.unshift(newContact);
      })
    );
    return newContact;
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
    const contactsByKey: Store["contactsByKey"] = {};
    for (const c of allContacts) {
      contactsByKey[c.key] = c;
    }
    set({
      loading: false,
      allContacts,
      filteredContacts: allContacts,
      contactsByKey,
    });
  },
  saveContact: async (contact) => {
    const resolved = await client.mutation("savePerson", contact);
    set(
      produce((state: Store) => {
        state.contactsByKey[resolved.key] = resolved;
      })
    );
    return resolved;
  },
  deleteContact: async (contact) => {
    if (!contact.key) {
      set((store) => {
        const allContacts = store.allContacts.filter((c) => c !== contact);
        const filteredContacts = store.filteredContacts.filter(
          (c) => c !== contact
        );
        return { allContacts, filteredContacts };
      });
    } else {
      client.mutation("deletePerson", contact.key);
      set((store) => {
        const allContacts = store.allContacts.filter((c) => c !== contact);
        const filteredContacts = store.filteredContacts.filter(
          (c) => c !== contact
        );
        const contactsByKey = { ...store.contactsByKey };
        delete contactsByKey[contact.key!];
        return { allContacts, filteredContacts, contactsByKey };
      });
    }
  },
}));
