import React, { useRef, useState } from "react";
import { Check, X } from "react-feather";
import "./Label.css";

interface LabelProps {
  tags: { color: string }[];
  color: string[];
  onClose: (value: boolean) => void;
  addTag: (label: string, color: string) => void;
}

const Label: React.FC<LabelProps> = (props) => {
  const input = useRef<HTMLInputElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [label, setLabel] = useState<string>("");

  const isColorUsed = (color: string): boolean => {
    return props.tags.some((item) => item.color === color);
  };

  return (
    <div className="label-modal">
      <div className="label-container">
        <div className="label-header">
          <h3>Etiqueta</h3>
          <X className="close-icon" onClick={() => props.onClose(false)} />
        </div>

        <div className="label-body">
          <label className="label-text">Nome</label>
          <input
            type="text"
            ref={input}
            value={label}
            placeholder="Selecione um nome para a etiqueta"
            className="label-input"
            onChange={(e) => setLabel(e.target.value)}
          />

          <label className="label-text">Selecione a cor</label>
          <div className="color-palette">
            {props.color.map((item, index) => (
              <span
                key={index}
                onClick={() => setSelectedColor(item)}
                className={`color-box ${isColorUsed(item) ? "disabled-color" : ""} ${selectedColor === item ? "selected" : ""}`}
                style={{ backgroundColor: item }}
              >
                {selectedColor === item && <Check className="check-icon" />}
              </span>
            ))}
          </div>

          <button
            className="create-button"
            onClick={() => {
              if (label !== "" && selectedColor !== "") {
                props.addTag(label, selectedColor);
                setLabel("");
                setSelectedColor("");
                if (input.current) input.current.value = "";
              } else {
                alert("Por favor selecione uma cor");
              }
            }}
          >
            Criar nova etiqueta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Label;
