"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import "./bootstrap.css";
import Board from "./components/Board/Board";
import Navbar from "@/components/Navbar"; 
import "./page.css";
import { useTarefas } from "@/lib/hooks/useTarefas";

// Estrutura de cada card
interface Card {
  id: string;
  title: string;
  tags: { tagName: string; color: string }[];
  task: any[];
}

// Estrutura de cada board
interface BoardData {
  id: string;
  boardName: string;
  card: Card[];
}

const Kanban = () => {
  const [data, setData] = useState<BoardData[]>([
    { id: "1", boardName: "Pendente de Dados", card: [] },
    { id: "2", boardName: "A Fazer", card: [] },
    { id: "3", boardName: "Em Execução", card: [] },
    { id: "4", boardName: "Entregas do Dia", card: [] },
    { id: "5", boardName: "Atividades para Reunião", card: [] },
    { id: "6", boardName: "Finalizados", card: [] },

  ]); 

  const {tarefas,isLoading,isError} = useTarefas();
  useEffect(() => {
    if (isLoading) {
      console.log("Carregando tarefas...");
    }

    if (isError) {
      console.error("Erro ao buscar tarefas:", isError);
    }

    if (tarefas) {
      console.log("📌 Tarefas carregadas:", tarefas);
    }
  }, [tarefas, isLoading, isError]);

  
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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    setData(dragCardInBoard(source, destination));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <Navbar />
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                addCard={addCard}
                removeCard={removeCard}
                updateCard={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
