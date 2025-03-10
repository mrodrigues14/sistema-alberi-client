"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import "./bootstrap.css";
import Board from "./components/Board/Board";
import Navbar from "@/components/Navbar"; 
import "./page.css";
import { useTarefas } from "@/lib/hooks/useTarefas";

// Estrutura de cada card (tarefa)
interface Card {
  id: string;
  title: string;
  tags: { tagName: string; color: string }[];
  task: { text: string; completed: boolean }[];
  prioridade?: number;
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

  // Hook para buscar as tarefas do banco
  const { tarefas, isLoading, isError } = useTarefas();

  useEffect(() => {
    if (!tarefas || tarefas.length === 0 || data.some(board => board.card.length > 0)) {
      return; // ❌ Não refaz a requisição se já há tarefas carregadas
    }
  
    console.log("📌 Tarefas carregadas:", tarefas);
  
    const newBoards: BoardData[] = [
      { id: "1", boardName: "Pendente de Dados", card: [] },
      { id: "2", boardName: "A Fazer", card: [] },
      { id: "3", boardName: "Em Execução", card: [] },
      { id: "4", boardName: "Entregas do Dia", card: [] },
      { id: "5", boardName: "Atividades para Reunião", card: [] },
      { id: "6", boardName: "Finalizados", card: [] },
    ];
  
    tarefas.forEach((tarefa) => {
      const card: Card = {
        id: tarefa.idtarefa.toString(),
        title: tarefa.titulo,
        tags: tarefa.labels || [],
        task: JSON.parse(tarefa.descricoes || "[]"),
        prioridade: tarefa.prioridade || 0,
      };
  
      switch (tarefa.status) {
        case "Pendente de Dados":
          newBoards[0].card.push(card);
          break;
        case "A Fazer":
          newBoards[1].card.push(card);
          break;
        case "Em Execução":
          newBoards[2].card.push(card);
          break;
        case "Entregas do Dia":
          newBoards[3].card.push(card);
          break;
        case "Atividades para Reunião":
          newBoards[4].card.push(card);
          break;
        case "Finalizado":
          newBoards[5].card.push(card);
          break;
        default:
          newBoards[1].card.push(card);
          break;
      }
    });
  
    setData(newBoards);
  }, [tarefas]); // ✅ Agora só roda uma vez quando `tarefas` muda
  

  // Função para adicionar um novo card manualmente
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

  // Função para remover um card
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
    setData((prevData) => {
      let tempData = [...prevData];
  
      const sourceBoardIdx = tempData.findIndex((item) => item.id === source.droppableId);
      const destinationBoardIdx = tempData.findIndex((item) => item.id === destination.droppableId);
  
      if (sourceBoardIdx === -1 || destinationBoardIdx === -1) return tempData;
  
      const movedCard = tempData[sourceBoardIdx].card[source.index]; // Captura o card a ser movido
  
      // Remove do board de origem
      tempData[sourceBoardIdx].card = tempData[sourceBoardIdx].card.filter((_, idx) => idx !== source.index);
  
      // Adiciona no board de destino
      tempData[destinationBoardIdx].card.splice(destination.index, 0, movedCard);
  
      return [...tempData]; // ✅ Força o React a perceber a mudança
    });
  };
  


  // Função para tratar o evento de "arrastar e soltar" os cards
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;
    dragCardInBoard(source, destination);  // ✅ Agora atualiza o estado corretamente
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
