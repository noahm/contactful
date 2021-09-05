import { useMemo } from "react";
import { useStore } from "./stores/contacts";
import { debounce } from "./utils/debounce";
import { getQuery } from "./utils/query";

export function Header() {
  const matchCount = useStore((store) => store.filteredContacts.length);
  const addContact = useStore((store) => store.createNewContact);
  const applyFilter = useStore((store) => store.applyFilter);
  const debouncedFilter = useMemo(
    () => debounce(applyFilter, 200),
    [applyFilter]
  );
  return (
    <header>
      <div className="title">contactful</div>
      <div className="searchBar card">
        <input
          type="search"
          defaultValue={getQuery() || ""}
          className="searchInput paper block"
          onChange={(e) => debouncedFilter(e.currentTarget.value)}
          placeholder="search people..."
          autoFocus
        />
        <div className="matchCount">{matchCount}</div>
      </div>
      <button className="addButton card frost block" onClick={addContact}>
        add
      </button>
    </header>
  );
}
