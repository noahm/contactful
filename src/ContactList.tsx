import produce from "immer";
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
  const [editing, setEditing] = useState<Contact | null>(
    contact.__local ? contact : null
  );
  const ref = useRef<HTMLLIElement>(null);

  const displayContact = editing || contact;
  const saveContact = useStore((s) => s.saveContact);
  const deleteMe = () => deleteContact(displayContact);
  const toggleEditing = () => setEditing((prev) => (prev ? null : contact));
  const saveChanges = () => {
    if (editing) {
      let toSave = editing;
      if (!editing.key && contact.key) {
        toSave = {
          ...editing,
          key: contact.key,
        };
      }
      saveContact(toSave);
      toggleEditing();
    }
  };
  const fillToday = () => {
    setEditing(
      produce(displayContact, (c) => {
        c.last = todayISO();
      })
    );
  };

  return (
    <li
      ref={ref}
      className={`contact-item card paper block split-v ${
        editing ? "isEditing" : "notEditing"
      }`}
      onClick={editing ? undefined : toggleEditing}
      onKeyUp={(evt) => {
        if (!ref.current || evt.target !== ref.current) return;

        if (evt.key === "Enter" && !editing) {
          saveChanges();
        } else if (evt.key === "Escape" && editing) {
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
              contact={displayContact}
              editing={!!editing}
              label={args.key}
              multiline={args.multiline}
              placeholder={args.placeholder}
              value={(displayContact[args.key] as string) || ""}
              save={saveChanges}
              setPending={setEditing}
            />
          ))}
        </div>
        <div className="right contact-multi-items">
          {CONTACT_FIELDS.vector.map((args) => (
            <VectorField
              key={args.key}
              contact={displayContact}
              editing={!!editing}
              label={args.key}
              multiline={args.multiline}
              placeholder={args.placeholder}
              values={
                Array.isArray(displayContact[args.key])
                  ? (displayContact[args.key] as string[])
                  : []
              }
              save={saveChanges}
              setPending={setEditing}
            />
          ))}
        </div>
      </div>
      {editing ? (
        <div className="buttonFooter split-h frost">
          <div className="left buttonArea">
            {!editing.__local && (
              <button className="contact-button" onClick={deleteMe}>
                delete
              </button>
            )}
          </div>
          <div className="right buttonArea">
            <button className="contact-button" onClick={fillToday}>
              today!
            </button>
            <button
              className="contact-button"
              onClick={editing.__local ? deleteMe : toggleEditing}
            >
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
