import React, { useState, useMemo, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Calendar, CheckSquare, Clock, MoreHorizontal } from "react-feather";
import { Menu } from "react-feather"; // Ícone de arraste
import Dropdown from "../Dropdown/Dropdown";
import Modal from "../Modal/Modal";
import Tag from "../Tags/Tag";
import "./Card.css";
import CardDetails from "./CardDetails/CardDetails";
import { useCliente } from "@/lib/hooks/useCliente";

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

const Card: React.FC<CardProps> = ({
  id,
  index,
  card,
  title,
  tags,
  updateCard,
  bid,
  removeCard,
}) => {
  const [dropdown, setDropdown] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [clickStart, setClickStart] = useState({ x: 0, y: 0 });
  const { clientes, isLoading, isError } = useCliente();

  // Directly use card prop instead of maintaining cardData state
  const cardData = card;

  // Memoize only the client name lookup without dependencies on clientes array
  const empresaNome = useMemo(() => {
    if (!cardData?.idCliente || isLoading || !clientes) {
      return "Sem empresa";
    }
    
    if (Array.isArray(clientes) && clientes.length > 0) {
      const clienteEncontrado = clientes.find(
        (cliente: { idcliente: number }) => cliente.idcliente === cardData.idCliente
      );
      
      if (clienteEncontrado) {
        return clienteEncontrado.apelido || clienteEncontrado.nome || "Sem empresa";
      }
    }
    
    return "Sem empresa";
  }, [cardData?.idCliente, isLoading]);

  // Simplified handleUpdateCard without useState
  const handleUpdateCard = useCallback((updatedCard: any) => {
    updateCard(bid, id, updatedCard);
  }, [bid, id, updateCard]);

  // Configuração do Draggable do @dnd-kit
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1, // Deixa o card semi-transparente enquanto arrasta
    transition: "transform 0.2s ease",
  };

  // Captura a posição do clique
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setClickStart({ x: e.clientX, y: e.clientY });
  };

  // Verifica se o movimento foi pequeno o suficiente para considerar um clique
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const distance = Math.sqrt(
      Math.pow(e.clientX - clickStart.x, 2) + Math.pow(e.clientY - clickStart.y, 2)
    );
    if (distance < 5) {
      setModalShow(true);
    }
  };
  
  return (
    <>
      {modalShow && (
        <CardDetails
          updateCard={handleUpdateCard}
          onClose={() => setModalShow(false)}
          card={{
            ...cardData,
            autor: cardData?.autor || "",
          }}
          bid={bid}
          removeCard={removeCard}
        />
      )}

      <div className="custom__card" ref={setNodeRef} style={style} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>

        <div onClick={() => setModalShow(true)}>
          <div className="card__text">
            <div className="drag-handle" {...listeners} {...attributes}>
              <i className="bi bi-grip-vertical"></i> {/* Ícone de arraste */}
            </div>
            <p>{cardData?.title}</p>

          </div>
          <div className="card__tags">
            {tags?.map((item, index) => (
              <Tag key={index} tagName={item.tagName} color={item.color} />
            ))}
          </div>
          <div className="prioridade-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi bi-star${cardData?.prioridade >= star ? "-fill" : ""}`}
                style={{
                  color: cardData?.prioridade >= star ? "gold" : "gray",
                }}
              ></i>
            ))}
          </div>
          <div className="card__footer">
            {cardData?.task?.length !== 0 && (
              <div className="task">
                <CheckSquare />
                <span>
                  {`${cardData?.task?.filter((item: { completed: any }) => item.completed).length} / ${cardData?.task?.length}`}
                </span>
              </div>
            )}
          </div>
          <p className="empresa-nome">{empresaNome}</p>



        </div>
      </div>
    </>
  );
};

export default Card;
