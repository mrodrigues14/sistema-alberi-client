import React, { useState, FC, FormEvent } from "react";
import { Plus, X } from "react-feather";
import "./Editable.css";

interface EditableProps {
  handler?: boolean;
  defaultValue?: string;
  onSubmit?: (text: string) => void;
  parentClass?: string;
  class?: string;
  placeholder?: string;
  btnName?: string;
  setHandler?: (value: boolean) => void;
  name?: string;
}

const Editable: FC<EditableProps> = (props) => {
  const [show, setShow] = useState<boolean>(props?.handler || false);
  const [text, setText] = useState<string>(props.defaultValue || "");

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim() && props.onSubmit) {
      setText("");
      props.onSubmit(text);
    }
    setShow(false);
  };

  return (
    <div className={`editable ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit} className="add-card-container">
          <textarea
            className="add-card-input"
            placeholder={props.placeholder}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="add-card-buttons">
            <button className="add-card-button" type="submit">
              {props.btnName || "Add Card"}
            </button>
            <X
              className="cancel-button"
              onClick={() => {
                setShow(false);
                props?.setHandler && props.setHandler(false);
              }}
            />
          </div>
        </form>
      ) : (
        <p
          onClick={() => {
            setShow(true);
          }}
          className="add-card-trigger"
        >
          <Plus />
          {props?.name || "Add Card"}
        </p>
      )}
    </div>
  );
};

export default Editable;
