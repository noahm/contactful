import "./fonts/fonts.css";
import "./App.css";
import { Header } from "./Header";
import { ContactList } from "./ContactList";
import { useEffect } from "react";
import { useStore } from "./stores/contacts";
import { ImportLink } from "./Import";

function App() {
  const loadContacts = useStore((store) => store.loadContacts);
  const isLoading = useStore((store) => store.loading);
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  return (
    <div>
      <Header />
      <ContactList />
      <footer>
        <ImportLink /> :: <a href="https://github.com/noahm/contactful">src</a>{" "}
        :: &#169; 2021
      </footer>
      {isLoading && <div className="loader" />}
    </div>
  );
}

export default App;
