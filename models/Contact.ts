export interface Contact {
  key: string | undefined;
  [k: string]: string | string[] | undefined;
}

export interface PersistedContact extends Contact {
  key: string;
}
