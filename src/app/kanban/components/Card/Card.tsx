import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";

interface CardProps {
  id: string;
  index: number;
  card: any;
  title: string;
  tags: { tagName: string; color: string }[];
  updateCard: (bid: string, cid: string, card: any) => void;
  bid: string;
  removeCard: (boardId: string, cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ id, index, card, title, tags, updateCard, bid, removeCard }) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [cardData, setCardData] = useState(card);

  useEffect(() => {
    setCardData(card);
  }, [card]);

  const handleUpdateCard = (updatedCard: any) => {
    setCardData(updatedCard);
    updateCard(bid, id, updatedCard);
  };

  // Configuração do Draggable do @dnd-kit
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1, // Deixa o card semi-transparente enquanto arrasta
    transition: "transform 0.2s ease",
  };

  return (
    <>
      {modalShow && (
        <CardDetails
          updateCard={handleUpdateCard}
          onClose={() => setModalShow(false)}
          card={cardData}
          bid={bid}
          removeCard={removeCard}
        />
      )}

      <div
        className="custom__card"
        ref={setNodeRef} // Define o card como "arrastável"
        style={style}
        {...listeners}
        {...attributes}
        onClick={() => setModalShow(true)}
      >
        <div className="card__text">
          <p>{cardData.title}</p>
          <MoreHorizontal className="car__more" onClick={() => setDropdown(true)} />
        </div>

        <div className="card__tags">
          {tags?.map((item, index) => (
            <Tag key={index} tagName={item.tagName} color={item.color} />
          ))}
        </div>

        <div className="card__footer">
          {cardData.task.length !== 0 && (
            <div className="task">
              <CheckSquare />
              <span>
                {cardData.task.length !== 0
                  ? `${cardData.task.filter((item: { completed: any }) => item.completed).length} / ${cardData.task.length}`
                  : "0/0"}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
