import { useStore } from "./stores/contacts";

export function Header() {
  const matchCount = useStore((store) => store.filteredContacts.length);
  const addContact = useStore((store) => store.createNewContact);
  const applyFilter = useStore((store) => store.applyFilter);
  return (
    <header>
      <div className="title">mira</div>
      <div className="searchBar card">
        <input
          type="text"
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
