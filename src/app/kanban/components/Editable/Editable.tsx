import React, { useState, FC, FormEvent } from "react";
import { Plus, X } from "react-feather";
import "./Editable.css";
import { useClienteContext } from "@/context/ClienteContext";
import { useSession } from "next-auth/react";
import { createTarefa, useTarefas } from "@/lib/hooks/useTarefas";
import { Tarefa } from "../../../../../types/Tarefa";

interface EditableProps {
  handler?: boolean;
  defaultValue?: string;
  parentClass?: string;
  class?: string;
  placeholder?: string;
  btnName?: string;
  setHandler?: (value: boolean) => void;
  name?: string;
  status?: string; // Torne opcional se não for usado em todas as situações
  addCardLocal?: (card: any) => void;
  updateCardId?: (oldId: string, newCard: any) => void;
  removeCardLocal?: (id: string) => void;
  onSubmit?: (value: string) => void; // Nova propriedade para envio de dados
  setError?: (error: string) => void;
}


const Editable: FC<EditableProps> = (props) => {
  const [show, setShow] = useState<boolean>(props?.handler || false);
  const [text, setText] = useState<string>(props.defaultValue || "");
  const [loading, setLoading] = useState(false);

  const { idCliente } = useClienteContext();
  const { data: session } = useSession();
  const idUsuario = Number(session?.user?.id);
  const { mutateTarefas } = useTarefas(idCliente ?? undefined, idUsuario ?? undefined);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      props.setError?.("Por favor, insira um nome para a tarefa!");
      return;
    }
  
    if (props.onSubmit) {
      props.onSubmit(text); 
      setText("");
      setShow(false);
      return;
    }
  
    const tarefaTempId = crypto.randomUUID(); 
  
    const novaTarefaLocal = {
      id: tarefaTempId,
      title: text,
      tags: [],
      task: [],
      prioridade: 0,
      idCliente: idCliente ?? null,
      autor: session?.user?.name || "Desconhecido",
    };
  
    setLoading(true);
  
    props.addCardLocal?.(novaTarefaLocal);
  
    const novaTarefa: Tarefa = {
      titulo: text,
      idCliente: idCliente ?? null,
      idUsuario: idUsuario ?? null,
      status: props.status || "A Fazer",
      dataInicio: new Date().toISOString().split("T")[0],
    };
  
    try {
      const tarefaCriada = await createTarefa(novaTarefa);
  
      props.updateCardId?.(tarefaTempId, {
        ...novaTarefaLocal,
        id: tarefaCriada.idtarefa.toString(),
        title: tarefaCriada.titulo,
        tags: tarefaCriada.labels || [],
        task: JSON.parse(tarefaCriada.descricoes || "[]"),
        prioridade: tarefaCriada.prioridade || 0,
        idCliente: tarefaCriada.idCliente,
      });
  
      mutateTarefas();
    } catch (error) {
      alert("Erro ao criar tarefa.");
      props.removeCardLocal?.(tarefaTempId);
    } finally {
      setText("");
      setShow(false);
      setLoading(false);
    }
  };
  
  

  return (
    <div className={`editable ${props.parentClass}`}>
      {show ? (
        <form onSubmit={handleOnSubmit} className="add-card-container">
          <textarea
            className="add-card-input"
            placeholder={props.placeholder}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="add-card-buttons">
            <button className="add-card-button" type="submit" disabled={loading}>
              {loading ? "Adicionando..." : props.btnName || "Adicionar Tarefa"}
            </button>
            <X
              className="cancel-button"
              onClick={() => {
                setShow(false);
                props?.setHandler && props.setHandler(false);
              }}
            />
          </div>
        </form>
      ) : (
        <p onClick={() => setShow(true)} className="add-card-trigger">
          <Plus />
          {props?.name || "Adicionar"}
        </p>
      )}
    </div>
  );
};

export default Editable;
