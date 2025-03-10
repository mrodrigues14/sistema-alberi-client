import React from "react";
import Card from "../Card/Card";
import "./Board.css";
import { useDroppable } from "@dnd-kit/core";
import Editable from "../Editable/Editable";

// Definição das cores dos títulos dos boards
const boardColors: { [key: string]: string } = {
  "Pendente de Dados": "#4C4C8A",
  "A Fazer": "#A05A2C",
  "Em Execução": "#1D4D50",
  "Entregas do Dia": "#187518",
  "Atividades para Reunião": "#A02C2C",
  "Finalizados": "#3B82F6",
};

interface BoardProps {
  id: string;
  name: string;
  card: { id: string; title: string; tags: { tagName: string; color: string }[]; task: any[] }[];
  addCard: (title: string, bid: string) => void;
  removeCard: (boardId: string, cardId: string) => void;
  updateCard: (bid: string, cid: string, card: any) => void;
}

const Board: React.FC<BoardProps> = ({ id, name, card, addCard, removeCard, updateCard }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="board">
      <div
        className="board__top"
        style={{ backgroundColor: boardColors[name] || "#555" }}
      >
        <p className="board__title">{name || "Board"}</p>
        <span className="total__cards">{card.length}</span>
      </div>

      {/* Área "dropável" do Board com efeito visual ao arrastar */}
      <div
        className="board__cards"
        ref={setNodeRef}
        style={{
          backgroundColor: isOver ? "rgba(0, 255, 0, 0.2)" : "transparent",
          transition: "background-color 0.3s ease",
          border: isOver ? "2px dashed green" : "2px solid transparent",
        }}
      >
        {card.map((item, index) => (
          <Card
            bid={id}
            id={item.id}
            index={index}
            key={item.id}
            title={item.title}
            tags={item.tags}
            updateCard={updateCard}
            removeCard={removeCard}
            card={item}
          />
        ))}
      </div>

      <div className="board__footer">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value: string) => addCard(value, id)}
        />
      </div>
    </div>
  );
};

export default Board;
