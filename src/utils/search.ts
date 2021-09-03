import type { Contact } from "../../models/Contact";

export function filterForTerm(term: string) {
  // if search is in the form `[word]: [...words]`
  // we only search field named [word].
  const match = term.match(/^(\w+):(.*)$/);
  if (match) {
    const [, prop, kw_o] = match;
    const kw = kw_o.trim().toLowerCase();
    const matches = (s: string | string[]) => {
      return s.toString().toLowerCase().includes(kw);
    };

    return (contact: Contact) => {
      const v = contact[prop];

      if (v == null) {
        return false;
      }

      if (Array.isArray(v)) {
        for (const it of v) {
          if (matches(it)) {
            return true;
          }
        }
      } else {
        if (matches(v)) {
          return true;
        }
      }

      return false;
    };
  } else {
    const kw = term.toLowerCase();
    const matches = (s: string | string[]) => {
      return s.toString().toLowerCase().includes(kw);
    };

    return (contact: Contact) => {
      // Newly added contacts should show up, even in a filtered view
      if (contact["name"] === "?") {
        return true;
      }

      for (const v of Object.values(contact)) {
        if (v == null) {
          continue;
        }

        if (Array.isArray(v)) {
          for (const it of v) {
            if (matches(it)) {
              return true;
            }
          }
        } else {
          if (matches(v)) {
            return true;
          }
        }
      }

      return false;
    };
  }
}
