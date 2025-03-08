import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
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

  return (
    <Draggable key={id.toString()} draggableId={id.toString()} index={index}>
      {(provided) => (
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
            onClick={() => setModalShow(true)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="card__text">
              <p>{cardData.title}</p>
              <MoreHorizontal
                className="car__more"
                onClick={() => setDropdown(true)}
              />
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
                      ? `${cardData.task.filter((item: { completed: any; }) => item.completed).length} / ${cardData.task.length}`
                      : "0/0"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Draggable>
  );
};

export default Card;