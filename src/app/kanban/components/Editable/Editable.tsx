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
    if (text && props.onSubmit) {
      setText("");
      props.onSubmit(text);
    }
    setShow(false);
  };

  return (
    <div className={`editable ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit}>
          <div className={`editable__input ${props.class}`}>
            <textarea
              placeholder={props.placeholder}
              autoFocus
              id={"edit-input"}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="btn__control">
              <button className="add__btn" type="submit">
                {`${props.btnName}` || "Add"}
              </button>
              <X
                className="close"
                onClick={() => {
                  setShow(false);
                  props?.setHandler && props.setHandler(false);
                }}
              />
            </div>
          </div>
        </form>
      ) : (
        <p
          onClick={() => {
            setShow(true);
          }}
        >
          {props.defaultValue === undefined ? <Plus /> : <></>}
          {props?.name || "Add"}
        </p>
      )}
    </div>
  );
};

export default Editable;