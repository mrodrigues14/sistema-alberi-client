"use client";

import { useEffect, useState, useCallback } from "react";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import "./bootstrap.css";
import Board from "./components/Board/Board";
import Navbar from "@/components/Navbar"; 
import "./page.css";
import { updateTarefa, useTarefas } from "@/lib/hooks/useTarefas";
import Card from "./components/Card/Card";
import { useUsuarios } from "@/lib/hooks/useUsuarios";

// Estrutura de cada card (tarefa)
interface Card {
  id: string;
  title: string;
  tags: { tagName: string; color: string }[];
  task: { text: string; completed: boolean }[];
  prioridade?: number;
  idCliente?: number;
  autor: string;
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
    { id: "6", boardName: "Finalizado", card: [] },
  ]);

  // Estado para armazenar o card sendo arrastado
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  // Hook para buscar as tarefas do banco
  const { usuarios } = useUsuarios();

  const { tarefas } = useTarefas();
  useEffect(() => {
    if (!tarefas || tarefas.length === 0 || data.some(board => board.card.length > 0)) return;

    const newBoards: BoardData[] = data.map(board => ({
      ...board,
      card: [],
    }));

    tarefas.forEach((tarefa: any) => {
      console.log("ÄAAAAAAAAAAAAAAAA",tarefa);
      console.log(usuarios);
      const usuarioAutor = usuarios.find((user: { idusuarios: number }) => user.idusuarios === tarefa.idUsuario);
      console.log(usuarioAutor);
      const nomeAutor = usuarioAutor ? usuarioAutor.nomeDoUsuario : "Desconhecido";

      const card: Card = {
        id: tarefa.idtarefa.toString(),
        title: tarefa.titulo,
        tags: tarefa.labels || [],
        task: JSON.parse(tarefa.descricoes || "[]"),
        prioridade: tarefa.prioridade || 0,
        idCliente: tarefa.idCliente,
        autor: nomeAutor, // 🔹 Adicionamos o nome do autor aqui
      };

      const boardIndex = newBoards.findIndex(board => board.boardName === tarefa.status);
      if (boardIndex !== -1) {
        newBoards[boardIndex].card.push(card);
      } else {
        newBoards[1].card.push(card); // Default para "A Fazer"
      }
    });

    setData(newBoards);
  }, [tarefas, usuarios]);

  // Função para adicionar um card
  const addCard = useCallback((title: string, bid: string) => {
    setData(prevData => {
      return prevData.map(board =>
        board.id === bid ? { ...board, card: [...board.card, { id: uuidv4(), title, tags: [], task: [], autor: "Unknown" }] } : board
      );
    });
  }, []);

  // Função para remover um card
  const removeCard = useCallback((boardId: string, cardId: string) => {
    setData(prevData => {
      return prevData.map(board =>
        board.id === boardId ? { ...board, card: board.card.filter(card => card.id !== cardId) } : board
      );
    });
  }, []);

  // Capturar o card que está sendo arrastado
  const onDragStart = useCallback((event: any) => {
    const { active } = event;
    if (!active) return;

    const foundCard = data.flatMap(board => board.card).find(card => card.id === active.id);
    setActiveCard(foundCard || null);
  }, [data]);

  // Lidar com a finalização do drag
  const onDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
  
    if (!over) return;
  
    setData((prevData) => {
      let updatedBoards = [...prevData];
  
      let sourceBoardIdx = updatedBoards.findIndex((board) =>
        board.card.some((card) => card.id === active.id)
      );
      let destinationBoardIdx = updatedBoards.findIndex(
        (board) => board.id === over.id
      );
  
      if (sourceBoardIdx === -1 || destinationBoardIdx === -1) return prevData;
  
      let card = updatedBoards[sourceBoardIdx].card.find(
        (card) => card.id === active.id
      );
      if (!card) return prevData;
  
      // Remover card da coluna de origem
      updatedBoards[sourceBoardIdx].card = updatedBoards[
        sourceBoardIdx
      ].card.filter((card) => card.id !== active.id);
  
      // Nome do novo status com base na board de destino
      const newStatus = updatedBoards[destinationBoardIdx].boardName;
  
      // Atualizar o status no banco
      updateTarefa(Number(card.id), { status: newStatus });
  
      // Adiciona o card no destino e atualiza o status localmente
      updatedBoards[destinationBoardIdx].card = [
        ...updatedBoards[destinationBoardIdx].card,
        { ...card, status: newStatus },
      ].sort((a, b) => a.title.localeCompare(b.title));
  
      return [...updatedBoards];
    });
  }, []);
  
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="App">
        <Navbar />
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <SortableContext key={item.id} items={item.card.map(c => c.id)}>
                <Board
                  id={item.id}
                  name={item.boardName}
                  card={item.card}
                  addCard={addCard}
                  removeCard={removeCard}
                  updateCard={() => {}}
                />
              </SortableContext>
            ))}
          </div>
        </div>
      </div>

      {/* Mantém o card visível em toda a página enquanto é arrastado */}
      <DragOverlay>
        {activeCard ? (
          <Card
            bid=""
            id={activeCard.id}
            index={0}
            title={activeCard.title}
            tags={activeCard.tags}
            card={activeCard}
            updateCard={() => {}}
            removeCard={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
