export interface Contact {
  key: string;
  last: string;
  [k: string]: string | string[] | undefined;
}
