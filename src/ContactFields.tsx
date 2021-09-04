import React, { useState } from "react";
import { Contact } from "../models/Contact";

interface CommonProps {
  contact: Contact;
  label: string;
  placeholder: string;
  multiline: boolean;
  editing: boolean;
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
            defaultValue={value}
            className="contact-input"
            autoComplete="none"
            onKeyDown={persistIfEnter}
            onChange={(e) => {
              contact[label] = e.currentTarget.value;
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
}: VectorFieldProps) {
  const [localValues, setLocalValues] = useState(values);

  if (!editing && !values.length) {
    return null;
  }
  const persistIfEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      save();
    }
  };

  const addNewValue = () => {
    updateValue("", localValues.length);
  };
  const updateValue = (v: string, i: number) => {
    const newVals = localValues.slice();
    newVals[i] = v;
    setLocalValues(newVals);
    contact[label] = newVals;
  };

  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="inputGroup">
      <label className="contact-label">{label}</label>
      <div className="entries">
        {editing ? (
          <>
            {localValues.map((v, i) => (
              <Tag
                key={i}
                type="text"
                name={`${label}-${i}`}
                defaultValue={v}
                className="contact-input"
                autoComplete="none"
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
