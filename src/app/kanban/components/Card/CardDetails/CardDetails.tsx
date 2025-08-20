import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CreditCard,
  X,
  Star, Tag, Clock, Trash, User,
  Check,
  Type,
  Edit
} from "react-feather";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";
import { useUsuarios } from "@/lib/hooks/useUsuarios";
import { useCliente } from "@/lib/hooks/useCliente";
import { deleteTarefa, updateTarefa } from "@/lib/hooks/useTarefas";
import { Tarefa } from "../../../../../../types/Tarefa";
import { Usuario } from "../../../../../../types/Usuario";

interface Task {
  text: string;
  id: string;
  completed: boolean;
}

interface Tag {
  id: string;
  tagName: string;
  color: string;
}

interface CardDetailsProps {
  card: {
    id: string;
    title: string;
    tags: Tag[];
    task: Task[];
    prioridade: number;
    autor: string;
    company?: string;
    idCliente?: number;
    dataLimite?: string;
  };
  bid: string;
  updateCard: (updatedCard: any) => void;
  removeCard: (bid: string, cardId: string) => void;
  onClose: () => void;
  setError?: (error: string, type?: "success" | "danger" | "warning") => void;
}

interface ClienteCategoria {
  idcliente: number;
  nome: string;
  apelido?: string;
}

export default function CardDetails(props: CardDetailsProps) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState<string>("");
  const [input, setInput] = useState(false);
  const [labelShow, setLabelShow] = useState(false);
  const { usuarios } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { clientes, isLoading, isError } = useCliente();
  const [displayDate, setDisplayDate] = useState("");
  
  console.log("CardDetails props", props);
  
  const [values, setValues] = useState(() => {
    return {
      ...props.card,
      autor: props.card.autor || "",
      company: String(props.card.idCliente) || "",
      task: props.card.task.map((t, index) => ({
        id: String(index + 1),
        text: t.text,
        completed: t.completed,
      })),
      dataLimite: props.card.dataLimite,
    };
  });

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const confirmEditTask = async (id: string) => {
    try {
      const updatedTasks = values.task.map((task: Task) =>
        task.id === id ? { ...task, text: editingTaskText } : task
      );

      setValues((prev) => ({
        ...prev,
        task: updatedTasks,
      }));

      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(updatedTasks),
      });

      setEditingTaskId(null);
      setEditingTaskText("");
      props.setError?.("✅ Task atualizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      props.setError?.("❌ Erro ao atualizar task. Tente novamente.", "danger");
      
      setValues((prev) => ({
        ...prev,
        task: values.task,
      }));
    }
  };

  const [text, setText] = useState(values.title);

  const addTask = async (value: string) => {
    try {
      const novaTask = {
        id: uuidv4(),
        text: value,
        completed: false,
      };

      const novasTasks = [...values.task, novaTask];

      setValues((prev) => ({
        ...prev,
        task: novasTasks,
      }));

      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(novasTasks),
      });
      
      props.setError?.("✅ Task adicionada com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao salvar nova task:", err);
      props.setError?.("❌ Erro ao adicionar a task. Tente novamente.", "danger");
      
      setValues((prev) => ({
        ...prev,
        task: values.task,
      }));
    }
  };

  const removeTask = async (id: string) => {
    try {
      const remaningTask = values.task.filter((item: Task) => item.id !== id);
      
      setValues({ ...values, task: remaningTask });
      
      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(remaningTask),
      });
      
      props.setError?.("✅ Task removida com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao remover task:", error);
      props.setError?.("❌ Erro ao remover a task. Tente novamente.", "danger");
      
      setValues({ ...values, task: values.task });
    }
  };

  const updateTitle = useCallback(async (value: string) => {
    try {
      setValues((prevValues) => {
        const updated = { ...prevValues, title: value };
        return updated;
      });
      
      await atualizarTitulo(value);
      props.setError?.("✅ Título atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar título:", error);
      props.setError?.("❌ Erro ao atualizar título. Tente novamente.", "danger");
    }
  }, []);

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item: Task) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = async (id: string) => {
    try {
      const tagsFiltradas = values.tags.filter((item: Tag) => item.id !== id);
      
      setValues({ ...values, tags: tagsFiltradas });
      
      // Converte Tag[] para Label[]
      const labelsFiltradas = tagsFiltradas.map(tag => ({
        label: tag.tagName,
        color: tag.color
      }));
      
      await atualizarTarefa({ labels: labelsFiltradas });
      
      props.setError?.("✅ Tag removida com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao remover tag:", error);
      props.setError?.("❌ Erro ao remover a tag. Tente novamente.", "danger");
      
      setValues({ ...values, tags: values.tags });
    }
  };

  const addTag = async (value: string, color: string) => {
    try {
      const novaTag = {
        id: uuidv4(),
        tagName: value,
        color: color,
      };

      const tagsAtualizadas = [...values.tags, novaTag];
      
      setValues((prev) => ({ ...prev, tags: tagsAtualizadas }));
      
      // Converte Tag[] para Label[]
      const labelsAtualizadas = tagsAtualizadas.map(tag => ({
        label: tag.tagName,
        color: tag.color
      }));
      
      await atualizarTarefa({ labels: labelsAtualizadas });
      
      props.setError?.("✅ Tag adicionada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao adicionar tag:", error);
      props.setError?.("❌ Erro ao adicionar a tag. Tente novamente.", "danger");
      
      setValues((prev) => ({ ...prev, tags: values.tags }));
    }
  };

  const handelClickListner = useCallback((e: KeyboardEvent) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.title : text);
    } else return;
  }, [text, values.title, updateTitle]);

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  }, [text, values.title, handelClickListner]);

  const atualizarTarefa = async (campoAtualizado: Partial<Tarefa>) => {
    const payload = {
      ...campoAtualizado,
      labels: campoAtualizado.labels
        ? JSON.stringify(campoAtualizado.labels)
        : undefined,
    };

    console.log("Enviando payload para atualizar tarefa:", payload);

    try {
      await updateTarefa(Number(values.id), payload);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      throw error;
    }
  };

  // Função específica para atualizar apenas o título
  const atualizarTitulo = async (titulo: string) => {
    try {
      await updateTarefa(Number(values.id), { titulo });
    } catch (error) {
      console.error("Erro ao atualizar título:", error);
      throw error;
    }
  };

  // Função específica para atualizar apenas o responsável
  const atualizarResponsavel = async (idUsuario: number) => {
    try {
      await updateTarefa(Number(values.id), { idUsuario });
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error);
      throw error;
    }
  };

  // Função específica para atualizar apenas a empresa
  const atualizarEmpresa = async (idCliente: number | null) => {
    try {
      await updateTarefa(Number(values.id), { idCliente });
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw error;
    }
  };

  // Função específica para atualizar apenas a data
  const atualizarData = async (dataLimite: string) => {
    try {
      await updateTarefa(Number(values.id), { dataLimite });
    } catch (error) {
      console.error("Erro ao atualizar data:", error);
      throw error;
    }
  };

  const updateTaskCompleted = async (id: string) => {
    try {
      const updatedTasks = values.task.map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      
      setValues((prevValues) => ({
        ...prevValues,
        task: updatedTasks,
      }));

      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(updatedTasks),
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      props.setError?.("❌ Erro ao atualizar tarefa. Tente novamente.", "danger");
      
      setValues((prevValues) => ({
        ...prevValues,
        task: values.task,
      }));
    }
  };

  const updateTaskText = async (id: string, newText: string) => {
    try {
      const updatedTasks = values.task.map((task: Task) =>
        task.id === id ? { ...task, text: newText } : task
      );
      
      setValues((prevValues) => ({
        ...prevValues,
        task: updatedTasks,
      }));

      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(updatedTasks),
      });
    } catch (error) {
      console.error("Erro ao atualizar texto da tarefa:", error);
      props.setError?.("❌ Erro ao atualizar texto da tarefa. Tente novamente.", "danger");
      
      setValues((prevValues) => ({
        ...prevValues,
        task: values.task,
      }));
    }
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.setSelectionRange(0, 0);

      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [input]);

  // Converte data do banco para formato de exibição
  useEffect(() => {
    if (values.dataLimite && values.dataLimite !== "0000-00-00" && values.dataLimite !== "1899-11-30") {
      const parts = values.dataLimite.split('-');
      if (parts.length === 3) {
        setDisplayDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        setDisplayDate(values.dataLimite);
      }
    } else {
      setDisplayDate("");
    }
  }, [values.dataLimite]);

  return (
    <Modal onClose={() => {
      props.updateCard(values);
      props.onClose();
    }}>
      <div className="local__bootstrap">
        <div
          className="container"
          style={{ minWidth: "650px", position: "relative" }}
        >
          <div className="row pb-4">
            <div className="col-12">
              <div className="d-flex align-items-center pt-3 gap-2">
                <CreditCard className="icon__md" />
                <div style={{ position: "relative", width: "100%" }}>
                  {!input && (
                    <h5
                      style={{
                        cursor: "pointer",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        wordBreak: "break-word",
                      }}
                      onClick={() => setInput(true)}
                    >
                      {values.title}
                    </h5>
                  )}

                  {input && (
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => {
                        setText(e.target.value);
                        if (textareaRef.current) {
                          textareaRef.current.style.height = "auto";
                          textareaRef.current.style.height =
                            textareaRef.current.scrollHeight + "px";
                        }
                      }}
                      onBlur={() => {
                        if (text !== values.title) updateTitle(text);
                        setInput(false);
                      }}
                      rows={1}
                      style={{
                        width: "100%",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        resize: "none",
                        overflow: "hidden",
                        lineHeight: "1.4",
                        boxSizing: "border-box",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <h6 className="text-justify">Etiqueta</h6>
              <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                {values.tags.length !== 0 ? (
                  values.tags.map((item: Tag) => (
                    <span
                      key={item.id}
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.tagName.length > 10
                        ? item.tagName.slice(0, 6) + "..."
                        : item.tagName}
                      <X
                        onClick={() => removeTag(item.id)}
                        style={{ width: "15px", height: "15px" }}
                      />
                    </span>
                  ))
                ) : (
                  <span
                    style={{ color: "#ccc" }}
                    className="d-flex justify-content-between align-items-center gap-2"
                  >
                    <i> Sem etiquetas</i>
                  </span>
                )}
              </div>
              <div className="check__list mt-2">
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: calculatePercent() + "%" }}
                      aria-valuenow={calculatePercent()}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {calculatePercent() + "%"}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  {values.task.length !== 0 ? (
                    values.task.map((item: Task) => (
                      <div
                        key={item.id}
                        className="task__list d-flex align-items-center gap-2"
                        style={{
                          minHeight: "50px",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => updateTaskCompleted(item.id)}
                          style={{
                            flexShrink: 0,
                            height: "20px",
                            width: "20px",
                          }}
                        />

                        {editingTaskId === item.id ? (
                          <input
                            className="flex-grow-1 border rounded px-2 py-1"
                            style={{
                              fontSize: "14px",
                              minHeight: "40px",
                              lineHeight: "1.4",
                              display: "flex",
                              alignItems: "center",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              maxWidth: "100%",
                            }}
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                          />
                        ) : (
                          <h6
                            className={`flex-grow-1 ${item.completed ? "strike-through" : ""}`}
                            style={{
                              fontSize: "14px",
                              minHeight: "40px",
                              lineHeight: "1.4",
                              display: "flex",
                              alignItems: "center",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              maxWidth: "100%",
                            }}
                          >
                            {item.text}
                          </h6>
                        )}

                        {editingTaskId === item.id ? (
                          <>
                            <Check
                              onClick={() => confirmEditTask(item.id)}
                              style={{ cursor: "pointer", width: "20px", height: "20px" }}
                            />
                            <X
                              onClick={() => cancelEditTask()}
                              style={{ cursor: "pointer", width: "20px", height: "20px" }}
                            />
                          </>
                        ) : (
                          <>
                            <Edit
                              onClick={() => startEditTask(item)}
                              style={{ cursor: "pointer", width: "20px", height: "20px" }}
                            />
                            <Trash
                              onClick={() => removeTask(item.id)}
                              style={{ cursor: "pointer", width: "20px", height: "20px" }}
                            />
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <></>
                  )}

                  <Editable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addTask}
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <h6>Adicionar ao cartão</h6>
              <div className="d-flex card__action__btn flex-column gap-2">
                <button onClick={() => setLabelShow(true)}>
                  <span className="icon__sm">
                    <Tag />
                  </span>
                  Adicionar Etiqueta
                </button>
                
                <h6>Prioridade</h6>
                <div className="prioridade-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={values.prioridade >= star ? "star selected" : "star"}
                      fill={values.prioridade >= star ? "gold" : "gray"}
                      stroke="none"
                      onClick={async () => {
                        try {
                          setValues((prev) => ({ ...prev, prioridade: star }));
                          await atualizarTarefa({ prioridade: String(star) });
                        } catch (error) {
                          console.error("Erro ao atualizar prioridade:", error);
                          props.setError?.("❌ Erro ao atualizar prioridade. Tente novamente.", "danger");
                          setValues((prev) => ({ ...prev, prioridade: values.prioridade }));
                        }
                      }}
                    />
                  ))}
                </div>

                <h6>Responsável</h6>
                <div className="responsavel-dropdown">
                  <div
                    className="responsavel-selecionado"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <User className="icon__sm" />
                    {values.autor || "Selecione um responsável"}
                  </div>

                  {isDropdownOpen && (
                    <div className="responsavel-dropdown-list">
                      <input
                        type="text"
                        placeholder="Pesquisar responsável..."
                        className="responsavel-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      <ul>
                        {usuarios
                          .filter((user: Usuario) =>
                            user.nomeDoUsuario.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((user: Usuario) => (
                            <li
                              key={user.idusuarios}
                              onClick={async () => {
                                try {
                                  setValues((prev) => ({ ...prev, autor: user.nomeDoUsuario }));
                                  await atualizarResponsavel(user.idusuarios);
                                  setIsDropdownOpen(false);
                                  props.setError?.("✅ Responsável atualizado com sucesso!", "success");
                                } catch (error) {
                                  console.error("Erro ao atualizar responsável:", error);
                                  props.setError?.("❌ Erro ao atualizar responsável. Tente novamente.", "danger");
                                  setValues((prev) => ({ ...prev, autor: values.autor }));
                                }
                              }}
                            >
                              {user.nomeDoUsuario}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>

                <h6>Empresa</h6>
                {isLoading ? (
                  <p>Carregando empresas...</p>
                ) : isError ? (
                  <p>Erro ao carregar empresas.</p>
                ) : (
                  <select
                    className="select-field"
                    value={values.company}
                    onChange={async (e) => {
                      const value = e.target.value;
                      const empresaId = value ? Number(value) : null;

                      try {
                        setValues((prev) => ({ ...prev, company: value }));
                        await atualizarEmpresa(empresaId);
                        props.setError?.("✅ Empresa atualizada com sucesso!", "success");
                      } catch (error) {
                        console.error("Erro ao atualizar empresa:", error);
                        props.setError?.("❌ Erro ao atualizar empresa. Tente novamente.", "danger");
                        setValues((prev) => ({ ...prev, company: values.company }));
                      }
                    }}
                  >
                    <option value="">Sem empresa vinculada</option>
                    {clientes.map((cliente: ClienteCategoria) => (
                      <option key={cliente.idcliente} value={String(cliente.idcliente)}>
                        {cliente.apelido || cliente.nome}
                      </option>
                    ))}
                  </select>
                )}

                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}
                
                <h6>Data Limite</h6>
                <div className="d-flex flex-column gap-1">
                  <div className="d-flex align-items-center gap-2">
                    <Clock className="icon__sm" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="dd-mm-aaaa"
                      maxLength={10}
                      value={displayDate}
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, "");

                        if (raw.length > 8) raw = raw.slice(0, 8);

                        let formatted = raw;
                        if (raw.length > 4) {
                          formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
                        } else if (raw.length > 2) {
                          formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
                        }

                        setDisplayDate(formatted);
                      }}
                      onBlur={async () => {
                        try {
                          const currentValue = displayDate || "";
                          
                          // Se está vazio, limpa a data
                          if (!currentValue || currentValue.trim() === "") {
                            await atualizarData("0000-00-00");
                            return;
                          }

                          // Extrai os números do valor atual (formato dd-mm-yyyy)
                          const numbers = currentValue.replace(/\D/g, "");
                          
                          if (numbers.length === 8) {
                            const dd = parseInt(numbers.slice(0, 2));
                            const mm = parseInt(numbers.slice(2, 4));
                            const yyyy = parseInt(numbers.slice(4));
                            
                            // Validação da data
                            if (dd < 1 || dd > 31 || mm < 1 || mm > 12 || yyyy < 1900 || yyyy > 2100) {
                              props.setError?.("❌ Data inválida. Use o formato dd-mm-aaaa", "danger");
                              return;
                            }
                            
                            // Converte para formato do banco (yyyy-mm-dd)
                            const formatToDB = `${yyyy.toString().padStart(4, '0')}-${mm.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}`;
                            
                            await atualizarData(formatToDB);
                            props.setError?.("✅ Data limite atualizada com sucesso!", "success");
                          } else {
                            props.setError?.("❌ Data incompleta. Use o formato dd-mm-aaaa", "danger");
                          }
                        } catch (error) {
                          console.error("Erro ao atualizar data limite:", error);
                          props.setError?.("❌ Erro ao atualizar data limite. Tente novamente.", "danger");
                        }
                      }}
                    />
                  </div>
                </div>

                <button
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer"
                  }}
                  onClick={async () => {
                    const confirmacao = window.confirm("Tem certeza que deseja excluir este cartão?");
                    if (!confirmacao) return;

                    try {
                      await deleteTarefa(Number(values.id));
                      props.removeCard(props.bid, values.id);
                      props.onClose();
                      props.setError?.("Tarefa excluída com sucesso!", "success");
                    } catch (err) {
                      console.error("Erro ao deletar tarefa:", err);
                      props.setError?.("❌ Erro ao excluir o cartão. Tente novamente.", "danger");
                    }
                  }}
                >
                  <span className="icon__sm">
                    <Trash />
                  </span>
                  Excluir Cartão
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
