import React, { ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  onClose: (value: boolean) => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div className="custom__modal" onClick={() => props.onClose(false)}>
      <div
        className="modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Modal;