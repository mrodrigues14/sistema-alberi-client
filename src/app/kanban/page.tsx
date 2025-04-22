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
import { useClienteContext } from "@/context/ClienteContext";

// Estrutura de cada card (tarefa)
interface Card {
  id: string;
  title: string;
  tags: { tagName: string; color: string }[];
  task: { text: string; completed: boolean }[];
  prioridade?: number;
  idCliente?: number;
  autor: string;
  dataLimite?: string;
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
  const { idCliente } = useClienteContext();

  const { tarefas, isLoading } = useTarefas(idCliente === 68 ? undefined : idCliente ?? undefined);

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
        board.id === boardId
          ? { ...board, card: board.card.filter(card => card.id !== cardId) }
          : board
      );
    });
  }, []);


  const onDragStart = useCallback((event: any) => {
    const { active } = event;
    if (!active) return;

    const foundCard = data.flatMap(board => board.card).find(card => card.id === active.id);
    setActiveCard(foundCard || null);
  }, [data]);

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

      updatedBoards[sourceBoardIdx].card = updatedBoards[
        sourceBoardIdx
      ].card.filter((card) => card.id !== active.id);

      const newStatus = updatedBoards[destinationBoardIdx].boardName;

      updateTarefa(Number(card.id), { status: newStatus });

      updatedBoards[destinationBoardIdx].card = [
        ...updatedBoards[destinationBoardIdx].card,
        { ...card, status: newStatus },
      ].sort((a, b) => a.title.localeCompare(b.title));

      return [...updatedBoards];
    });
  }, []);
  const updateCard = (boardId: string, cardId: string, updatedCard: any) => {
    setData(prevData =>
      prevData.map(board =>
        board.id === boardId
          ? {
            ...board,
            card: board.card.some(card => card.id === cardId)
              ? board.card.map(card => (card.id === cardId ? updatedCard : card))
              : [...board.card, updatedCard],
          }
          : board
      )
    );
  };

  useEffect(() => {
    const boardsIniciais: BoardData[] = [
      { id: "1", boardName: "Pendente de Dados", card: [] },
      { id: "2", boardName: "A Fazer", card: [] },
      { id: "3", boardName: "Em Execução", card: [] },
      { id: "4", boardName: "Entregas do Dia", card: [] },
      { id: "5", boardName: "Atividades para Reunião", card: [] },
      { id: "6", boardName: "Finalizado", card: [] },
    ];
  
    // 🔒 Verificação defensiva para evitar loop infinito
    if (!tarefas || !usuarios) return;
  
    if (tarefas.length === 0 || usuarios.length === 0) {
      setData((prev) => {
        const isEmpty = prev.every(b => b.card.length === 0);
        if (!isEmpty) return boardsIniciais;
        return prev;
      });
      return;
    }
  
    const boardsAtualizados: BoardData[] = boardsIniciais.map(board => ({
      ...board,
      card: [],
    }));
  
    tarefas.forEach((tarefa: any) => {
      const usuarioAutor = usuarios.find(
        (user: { idusuarios: number }) => user.idusuarios === tarefa.idUsuario
      );
      const nomeAutor = usuarioAutor ? usuarioAutor.nomeDoUsuario : "Desconhecido";
  
      const card: Card = {
        id: tarefa.idtarefa.toString(),
        title: tarefa.titulo,
        tags: typeof tarefa.labels === "string"
          ? JSON.parse(tarefa.labels || "[]")
          : tarefa.labels || [],
        task: JSON.parse(tarefa.descricoes || "[]"),
        prioridade: tarefa.prioridade || 0,
        idCliente: tarefa.idCliente,
        autor: nomeAutor,
        dataLimite: tarefa.dataLimite,
      };
  
      const boardIndex = boardsAtualizados.findIndex(
        board => board.boardName === tarefa.status
      );
  
      if (boardIndex !== -1) {
        boardsAtualizados[boardIndex].card.push(card);
      } else {
        boardsAtualizados[1].card.push(card);
      }
    });
  
    setData(boardsAtualizados);
  }, [tarefas, usuarios]);
  

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="App">
        <Navbar />
        <div className="overflow-x-auto w-full xl:flex xl:justify-center lg:h-screen lg:p-5">
        <div className="flex flex-nowrap space-x-4 px-4 py-2 w-fit" style={{ gap: "2rem", justifyContent: "center" }}>
            {data.map((item) => (
              <SortableContext key={item.id} items={item.card.map((c) => c.id)}>
                <div className="w-[250px] shrink-0 px-2">
                  <Board
                    id={item.id}
                    name={item.boardName}
                    card={item.card}
                    addCard={addCard}
                    removeCard={removeCard}
                    updateCard={updateCard}
                    isLoading={isLoading}
                  />
                </div>
              </SortableContext>
            ))}
          </div>
        </div>


      </div>

      <DragOverlay>
        {activeCard ? (
          <Card
            bid=""
            id={activeCard.id}
            index={0}
            title={activeCard.title}
            tags={activeCard.tags}
            card={activeCard}
            updateCard={() => { }}
            removeCard={() => { }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
