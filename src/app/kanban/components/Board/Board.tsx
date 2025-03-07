import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import "./Board.css";
import { MoreHorizontal } from "react-feather";
import Editable from "../Editable/Editable";
import Dropdown from "../Dropdown/Dropdown";
import { Droppable } from "react-beautiful-dnd";

interface BoardProps {
  id: string;
  name: string;
  card: { id: string; title: string; tags: { tagName: string; color: string }[]; task: any[] }[];
  setName: (title: string, bid: string) => void;
  addCard: (title: string, bid: string) => void;
  removeCard: (boardId: string, cardId: string) => void;
  removeBoard: (bid: string) => void;
  updateCard: (bid: string, cid: string, card: { id: string; title: string; tags: { tagName: string; color: string }[]; task: any[]; }) => void;}

const Board: React.FC<BoardProps> = (props) => {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Enter") setShow(false);
    };
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div className="board">
      <div className="board__top">
        {show ? (
          <div>
            <input
              className="title__input"
              type={"text"}
              defaultValue={props.name}
              onChange={(e) => {
                props.setName(e.target.value, props.id);
              }}
            />
          </div>
        ) : (
          <div>
            <p
              onClick={() => {
                setShow(true);
              }}
              className="board__title"
            >
              {props?.name || "Name of Board"}
              <span className="total__cards">{props.card?.length}</span>
            </p>
          </div>
        )}
        <div
          onClick={() => {
            setDropdown(true);
          }}
        >
          <MoreHorizontal />
          {dropdown && (
            <Dropdown
              className="board__dropdown"
              onClose={() => {
                setDropdown(false);
              }}
            >
              <p onClick={() => props.removeBoard(props.id)}>Delete Board</p>
            </Dropdown>
          )}
        </div>
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
