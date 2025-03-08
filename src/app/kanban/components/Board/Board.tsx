import React from "react";
import Card from "../Card/Card";
import "./Board.css";
import { Droppable } from "react-beautiful-dnd";
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

const Board: React.FC<BoardProps> = (props) => {
  return (
    <div className="board">
      <div
        className="board__top"
        style={{ backgroundColor: boardColors[props.name] || "#555" }}
      >
        <p className="board__title">
          {props?.name || "Board"}
        </p>
        <span className="total__cards">{props.card?.length}</span>
      </div>

      <Droppable droppableId={props.id.toString()}>
        {(provided) => (
          <div
            className="board__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.card?.map((items, index) => (
              <Card
                bid={props.id}
                id={items.id}
                index={index}
                key={items.id}
                title={items.title}
                tags={items.tags}
                updateCard={props.updateCard}
                removeCard={props.removeCard}
                card={items}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="board__footer">
        <Editable
          name={"Add Card"}
          btnName={"Add Card"}
          placeholder={"Enter Card Title"}
          onSubmit={(value: string) => props.addCard(value, props.id)}
        />
      </div>
    </div>
  );
};

export default Board;
