"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from "uuid";
import "./bootstrap.css";
import Board from "./components/Board/Board";
import Navbar from "@/components/Navbar";
import AvisoAlerta from "@/components/avisoAlerta/avisoAlerta";
import "./page.css";
import { updateTarefa, useTarefas } from "@/lib/hooks/useTarefas";
import { useTarefasMeusClientes } from "@/lib/hooks/useTarefasMeusClientes";
import Card from "./components/Card/Card";
import { useUsuarios } from "@/lib/hooks/useUsuarios";
import { useClienteContext } from "@/context/ClienteContext";

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

interface BoardData {
  id: string;
  boardName: string;
  card: Card[];
}

const Kanban = () => {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [error, setError] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "danger" | "warning">("warning");
  
  // Limpar erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Função para mostrar mensagens com tipo apropriado
  const showMessage = (message: string, type: "success" | "danger" | "warning" = "warning") => {
    setError(message);
    setMessageType(type);
  };
  
  const { usuarios } = useUsuarios();
  const { idCliente } = useClienteContext();

  // Decidir qual hook usar baseado no idCliente
  const isMeusClientes = idCliente === -1; // ID especial para "Meus Clientes"
  const isTodosClientes = idCliente === 68; // ID para "Todos os Clientes"
  
  const { tarefas: tarefasTodos, isLoading: isLoadingTodos } = useTarefas(
    isTodosClientes ? undefined : (!isMeusClientes ? idCliente ?? undefined : undefined)
  );
  
  const { tarefas: tarefasMeus, isLoading: isLoadingMeus } = useTarefasMeusClientes();
  
  // Usar as tarefas corretas baseado no modo selecionado
  const tarefas = isMeusClientes ? tarefasMeus : tarefasTodos;
  const isLoading = isMeusClientes ? isLoadingMeus : isLoadingTodos;

  const [data, setData] = useState<BoardData[]>([
    { id: "1", boardName: "Pendente de Dados", card: [] },
    { id: "2", boardName: "A Fazer", card: [] },
    { id: "3", boardName: "Em Execução", card: [] },
    { id: "4", boardName: "Entregas do Dia", card: [] },
    { id: "5", boardName: "Atividades para Reunião", card: [] },
    { id: "6", boardName: "Finalizado", card: [] },
  ]);

  useEffect(() => {
    if (isLoading || !tarefas || !usuarios) return;

    const boardsIniciais: BoardData[] = [
      { id: "1", boardName: "Pendente de Dados", card: [] },
      { id: "2", boardName: "A Fazer", card: [] },
      { id: "3", boardName: "Em Execução", card: [] },
      { id: "4", boardName: "Entregas do Dia", card: [] },
      { id: "5", boardName: "Atividades para Reunião", card: [] },
      { id: "6", boardName: "Finalizado", card: [] },
    ];

    if (tarefas.length === 0 || usuarios.length === 0) {
      setData(boardsIniciais);
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
  }, [isLoading, tarefas?.length, usuarios?.length]);

  const addCard = useCallback((title: string, bid: string) => {
    setData(prevData => {
      return prevData.map(board =>
        board.id === bid ? { ...board, card: [...board.card, { id: uuidv4(), title, tags: [], task: [], autor: "Unknown" }] } : board
      );
    });
  }, []);

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

  const updateCard = useCallback((boardId: string, cardId: string, updatedCard: any) => {
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
  }, []);
  

  return (
    <>
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="App">
          <Navbar />
          <div className="w-full min-h-screen bg-gray-50">
            <div className="kanban-scroll-container">
              <div className="kanban-boards">
                {data.map((item) => (
                  <SortableContext key={item.id} items={item.card.map((c) => c.id)}>
                    <div className="w-[260px] xl:w-[280px] h-[600px] 2xl:h-auto shrink-0">
                      <Board
                        id={item.id}
                        name={item.boardName}
                        card={item.card}
                        addCard={addCard}
                        removeCard={removeCard}
                        updateCard={updateCard}
                        isLoading={isLoading}
                        setError={showMessage}
                      />
                    </div>
                  </SortableContext>
                ))}
              </div>
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

      {error && <AvisoAlerta mensagem={error} tipo={messageType} />}
    </>
  );
};

export default Kanban;
