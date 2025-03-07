"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "use-local-storage";
import "./bootstrap.css";
import Board from "./components/Board/Board";
import Editable from "./components/Editable/Editable";
import Navbar from "@/components/Navbar";

// Type for the structure of each card
interface Card {
  id: string;
  title: string;
  tags: { tagName: string; color: string }[];
  task: any[];
}

// Type for the structure of each board
interface BoardData {
  id: string;
  boardName: string;
  card: Card[];
}

const Kanban = () => {
  const [data, setData] = useState<BoardData[]>([]);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const storedTheme = localStorage.getItem("theme");
      setTheme(storedTheme || (defaultDark ? "dark" : "light"));

      const storedData = localStorage.getItem("kanban-board");
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    }
  }, []);

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  const setName = (title: string, bid: string) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    if (index >= 0) tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source: any, destination: any) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  const addCard = (title: string, bid: string) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    if (index >= 0) {
      tempData[index].card.push({
        id: uuidv4(),
        title: title,
        tags: [],
        task: [],
      });
      setData(tempData);
    }
  };

  const removeCard = (boardId: string, cardId: string) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index]?.card.findIndex((item) => item.id === cardId);

    if (cardIndex !== undefined && cardIndex >= 0) {
      tempData[index].card.splice(cardIndex, 1);
      setData(tempData);
    }
  };

  const addBoard = (title: string) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
    });
    setData(tempData);
  };

  const removeBoard = (bid: string) => {
    const tempData = [...data];
    const index = data.findIndex((item) => item.id === bid);
    tempData.splice(index, 1);
    setData(tempData);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid: string, cid: string, card: Card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    setData(tempBoards);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kanban-board", JSON.stringify(data));
    }
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
      <Navbar />
      <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}
            <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={addBoard}
              placeholder={"Enter Board  Title"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
