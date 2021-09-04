import { useStore } from "./stores/contacts";
import { getQuery } from "./utils/query";

export function Header() {
  const matchCount = useStore((store) => store.filteredContacts.length);
  const addContact = useStore((store) => store.createNewContact);
  const applyFilter = useStore((store) => store.applyFilter);
  return (
    <header>
      <div className="title">contactful</div>
      <div className="searchBar card">
        <input
          type="search"
          defaultValue={getQuery() || ""}
          className="searchInput paper block"
          onChange={(e) => applyFilter(e.currentTarget.value)}
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
