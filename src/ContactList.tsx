import { useRef, useState } from "react";
import { Contact } from "../models/Contact";
import { ScalarField, VectorField } from "./ContactFields";
import { useStore } from "./stores/contacts";
import { todayISO } from "./utils/today";

function field(key: string, placeholder?: string, multiline = false) {
  return {
    key,
    placeholder: placeholder || key,
    multiline,
  };
}

const CONTACT_FIELDS = {
  scalar: [
    field("name"),
    field("place"),
    field("work"),
    field("twttr", "@username"),
    field("last"),
    field("notes", "notes", true),
  ],
  vector: [field("tel"), field("email"), field("mtg", "meeting", true)],
};

interface ContactProps {
  contact: Contact;
}

function ContactItem({ contact }: ContactProps) {
  const deleteContact = useStore((store) => store.deleteContact);
  const [isEditing, setEditing] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const saveContact = useStore((s) => s.saveContact);
  const toggleEditing = () => setEditing((prev) => !prev);
  const saveChanges = () => {
    saveContact(contact);
    toggleEditing();
  };
  const fillToday = () => {
    contact.last = todayISO();
    setEditing(true);
  };

  return (
    <li
      ref={ref}
      className={`contact-item card paper block split-v ${
        isEditing ? "isEditing" : "notEditing"
      }`}
      onClick={isEditing ? undefined : toggleEditing}
      onKeyUp={(evt) => {
        if (!ref.current || evt.target !== ref.current) return;

        if (evt.key === "Enter" && !isEditing) {
          saveChanges();
        } else if (evt.key === "Escape" && isEditing) {
          toggleEditing();
        }
      }}
      tabIndex={0}
    >
      <div className="editArea split-h">
        <div className="left contact-single-items">
          {CONTACT_FIELDS.scalar.map((args) => (
            <ScalarField
              key={args.key}
              contact={contact}
              editing={isEditing}
              label={args.key}
              multiline={args.multiline}
              placeholder={args.placeholder}
              value={(contact[args.key] as string) || ""}
              save={saveChanges}
            />
          ))}
        </div>
        <div className="right contact-multi-items">
          {CONTACT_FIELDS.vector.map((args) => (
            <VectorField
              key={args.key}
              contact={contact}
              editing={isEditing}
              label={args.key}
              multiline={args.multiline}
              placeholder={args.placeholder}
              values={
                Array.isArray(contact[args.key])
                  ? (contact[args.key] as string[])
                  : []
              }
              save={saveChanges}
            />
          ))}
        </div>
      </div>
      {isEditing ? (
        <div className="buttonFooter split-h frost">
          <div className="left buttonArea">
            <button
              className="contact-button"
              onClick={() => deleteContact(contact)}
            >
              delete
            </button>
          </div>
          <div className="right buttonArea">
            <button className="contact-button" onClick={fillToday}>
              today!
            </button>
            <button className="contact-button" onClick={toggleEditing}>
              cancel
            </button>
            <button className="contact-button" onClick={saveChanges}>
              save
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function ContactList() {
  const contacts = useStore((store) => store.filteredContacts);
  return (
    <ul className="contact-list">
      {contacts.map((c, i) => (
        <ContactItem contact={c} key={c.key || i} />
      ))}
    </ul>
  );
}
