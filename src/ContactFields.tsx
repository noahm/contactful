import produce from "immer";
import React from "react";
import { Contact } from "../models/Contact";

interface CommonProps {
  contact: Contact;
  label: string;
  placeholder: string;
  multiline: boolean;
  editing: boolean;
  setPending: (c: Contact) => void;
  save: () => void;
}

interface ScalarFieldProps extends CommonProps {
  value: string;
}

export function ScalarField({
  contact,
  label,
  editing,
  value,
  placeholder,
  multiline,
  save,
  setPending,
}: ScalarFieldProps) {
  if (!editing && !value) {
    return null;
  }
  const persistIfEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      save();
    }
  };

  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="inputGroup">
      <label className="contact-label">{label}</label>
      <div className="entries">
        {editing ? (
          <Tag
            type="text"
            name={label}
            /* kludge hack to avoid autofill nonsense */
            id={`search-${label}`}
            defaultValue={value}
            className="contact-input"
            autoComplete="off"
            onKeyDown={persistIfEnter}
            onChange={(e) => {
              setPending(
                produce(contact, (c) => {
                  c[label] = e.currentTarget.value;
                })
              );
            }}
            placeholder={placeholder}
          />
        ) : (
          <div>{value}</div>
        )}
      </div>
    </div>
  );
}

interface VectorFieldProps extends CommonProps {
  values: string[];
}

export function VectorField({
  contact,
  label,
  editing,
  values,
  placeholder,
  multiline,
  save,
  setPending,
}: VectorFieldProps) {
  if (!editing && !values.length) {
    return null;
  }
  const persistIfEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      save();
    }
  };

  const addNewValue = () => {
    updateValue("", values.length);
  };
  const updateValue = (v: string, i: number) => {
    setPending(
      produce(contact, (c) => {
        if (!Array.isArray(c[label])) {
          c[label] = [];
        }
        (c[label] as string[])[i] = v;
      })
    );
  };

  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="inputGroup">
      <label className="contact-label">{label}</label>
      <div className="entries">
        {editing ? (
          <>
            {values.map((v, i) => (
              <Tag
                key={i}
                /* kludge hack to avoid autofill nonsense */
                id={`search-${label}-${i}`}
                type="text"
                name={`${label}-${i}`}
                defaultValue={v}
                className="contact-input"
                autoComplete="off"
                onKeyDown={persistIfEnter}
                onChange={(e) => {
                  updateValue(e.currentTarget.value, i);
                }}
                placeholder={placeholder}
              />
            ))}
            <button className="contact-add-button" onClick={addNewValue}>
              + {placeholder}
            </button>
          </>
        ) : (
          values.map((v, i) => <span key={i}>{v.substr(0, 256)}</span>)
        )}
      </div>
    </div>
  );
}
