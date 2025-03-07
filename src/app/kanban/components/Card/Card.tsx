import React, { useState } from "react";
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
  updateCard: (bid: string, cid: string, card: any) => void;  bid: string;
  removeCard: (boardId: string, cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ id, index, card, title, tags, updateCard, bid, removeCard }) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  return (
    <Draggable key={id.toString()} draggableId={id.toString()} index={index}>
      {(provided) => (
        <>
          {modalShow && (
            <CardDetails
              updateCard={updateCard}
              onClose={() => setModalShow(false)}
              card={card}
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
              <p>{title}</p>
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
              {card.task.length !== 0 && (
                <div className="task">
                  <CheckSquare />
                  <span>
                    {card.task.length !== 0
                      ? `${card.task.filter((item: { completed: any; }) => item.completed).length} / ${card.task.length}`
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
