import React, { useState, useEffect } from "react";
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
import { useCallback } from "react";
import { useUsuarios } from "@/lib/hooks/useUsuarios";
import { useCliente } from "@/lib/hooks/useCliente";
import { deleteTarefa, updateTarefa } from "@/lib/hooks/useTarefas";
import { Tarefa } from "../../../../../../types/Tarefa";
import { Usuario } from "../../../../../../types/Usuario";

interface Task {
  text: string;
  id: string;
  task: string;
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
  const { usuarios } = useUsuarios(); // Obtém os usuários do sistema
  const [searchTerm, setSearchTerm] = useState(""); // Estado da pesquisa no dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controla a abertura do dropdown
  const { clientes, isLoading, isError } = useCliente(); // 🔹 Obtendo a lista de empresas
  const [clientName, setClientName] = useState<string>("");
  const { updateCard } = props;

  const [values, setValues] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCard = localStorage.getItem(`card-${props.card.id}`);
      if (savedCard) {
        const parsed = JSON.parse(savedCard);
        return {
          ...parsed,
          dataLimite:
            parsed.dataLimite && parsed.dataLimite !== "0000-00-00"
              ? parsed.dataLimite
              : props.card.dataLimite,
        };
      }

      return {
        ...props.card,
        autor: props.card.autor || "",
        company: String(props.card.idCliente) || "",
        task: props.card.task.map((t, index) => ({
          id: index + 1,
          text: t.text,
          completed: t.completed,
        })),
        dataLimite: props.card.dataLimite,
      };
    }

    return {
      ...props.card,
      autor: props.card.autor || "",
      company: String(props.card.idCliente) || "",
      task: props.card.task.map((t, index) => ({
        id: index + 1,
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
    const updatedTasks = values.task.map((task: Task) =>
      task.id === id ? { ...task, text: editingTaskText } : task
    );

    setValues((prev: any) => ({
      ...prev,
      task: updatedTasks,
    }));

    setEditingTaskId(null);
    setEditingTaskText("");

    try {
      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(updatedTasks),
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };


  const [text, setText] = useState(values.title);

  const Input = (props: { title: string }) => {
    return (
      <input
        autoFocus
        defaultValue={text}
        type="text"
        onBlur={() => {
          if (text !== values.title) {
            updateTitle(text);
          }
          setInput(false);
        }}
        onChange={(e) => {
          setText(e.target.value);
        }}
        className="form-control"
        style={{
          fontSize: "1.125rem", // menor que antes, maior que padrão
          fontWeight: "600", // sem ser ultra bold
          width: "80%", // não ocupa 100%, deixa espaço
          border: "1px solid #ccc", // borda neutra
          borderRadius: "6px",
          padding: "6px 10px",
        }}
      />
    );
  };



  const addTask = async (value: string) => {
    const novaTask = {
      id: uuidv4(),
      text: value,
      completed: false,
    };

    const novasTasks = [...values.task, novaTask];

    setValues((prev: any) => ({
      ...prev,
      task: novasTasks,
    }));

    try {
      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(novasTasks),
      });
    } catch (err) {
      console.error("Erro ao salvar nova task:", err);
      alert("Erro ao adicionar a task. Tente novamente.");
    }
  };



  const removeTask = (id: string) => {
    const remaningTask = values.task.filter((item: Task) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const updateTitle = useCallback(async (value: string) => {
    setValues((prevValues: any) => {
      const updated = { ...prevValues, title: value };
      atualizarTarefa({ titulo: value }); // ⬅️ Chamada ao backend
      return updated;
    });
  }, []);


  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item: Task) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id: string) => {
    const tagsFiltradas = values.tags.filter((item: Tag) => item.id !== id);

    setValues({ ...values, tags: tagsFiltradas });

    atualizarTarefa({ labels: tagsFiltradas }); // ✅ Aqui também
  };



  const addTag = (value: string, color: string) => {
    const novaTag = {
      id: uuidv4(),
      tagName: value,
      color: color,
    };

    const tagsAtualizadas = [...values.tags, novaTag];

    setValues((prev: any) => ({ ...prev, tags: tagsAtualizadas }));

    atualizarTarefa({ labels: tagsAtualizadas }); // ✅ Aqui
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


  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`card-${values.id}`, JSON.stringify(values));
    }
  }, [values, updateCard]);

  useEffect(() => {
    if (clientes && values.company) {
      const clienteEncontrado = clientes.find(
        (cliente: ClienteCategoria) => String(cliente.idcliente) === values.company
      );

      if (clienteEncontrado) {
        setClientName(clienteEncontrado.apelido || clienteEncontrado.nome);
      }
    }
  }, [clientes, values.company]);

  const atualizarTarefa = async (campoAtualizado: Partial<Tarefa>) => {
    const payload = {
      ...campoAtualizado,
      labels: campoAtualizado.labels
        ? JSON.stringify(campoAtualizado.labels)
        : undefined,
    };

    try {
      await updateTarefa(Number(values.id), payload);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const updateTaskCompleted = async (id: string) => {
    const updatedTasks = values.task.map((task: Task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setValues((prevValues: typeof values) => ({
      ...prevValues,
      task: updatedTasks,
    }));

    try {
      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(updatedTasks),
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const updateTaskText = async (id: string, newText: string) => {
    const updatedTasks = values.task.map((task: Task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    setValues((prevValues: typeof values) => ({
      ...prevValues,
      task: updatedTasks,
    }));

    try {
      await updateTarefa(Number(values.id), {
        descricoes: JSON.stringify(updatedTasks),
      });
    } catch (error) {
      console.error("Erro ao atualizar texto da tarefa:", error);
    }
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

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
                {input ? (
                  <Input title={values.title} />
                ) : (
                  <h5
                    style={{ cursor: "pointer" }}
                    onClick={() => setInput(true)}
                  >
                    {values.title}
                  </h5>
                )}
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
                {/* Prioridade (estrelas) */}
                <h6>Prioridade</h6>
                <div className="prioridade-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={values.prioridade >= star ? "star selected" : "star"}
                      fill={values.prioridade >= star ? "gold" : "gray"} // Apenas a estrela será preenchida
                      stroke="none" // Remove o contorno preto
                      onClick={() => {
                        setValues((prev: any) => {
                          atualizarTarefa({ prioridade: String(star) });
                          return { ...prev, prioridade: star };
                        });
                      }}
                    />
                  ))}
                </div>

                {/* Executor */}
                <h6>Responsável</h6>
                <div className="responsavel-dropdown">
                  <div
                    className="responsavel-selecionado"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <User className="icon__sm" />
                    {values.autor || "Selecione um responsável"}
                  </div>

                  {/* Dropdown pesquisável */}
                  {isDropdownOpen && (
                    <div className="responsavel-dropdown-list">
                      <input
                        type="text"
                        placeholder="Pesquisar responsável..."
                        className="responsavel-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      {/* Lista filtrada de usuários */}
                      <ul>
                        {usuarios
                          .filter((user: Usuario) =>
                            user.nomeDoUsuario.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((user: Usuario) => (
                            <li
                              key={user.idusuarios}
                              onClick={() => {
                                setValues((prev: any) => {
                                  atualizarTarefa({ idUsuario: user.idusuarios });
                                  return { ...prev, autor: user.nomeDoUsuario };
                                });
                                setIsDropdownOpen(false);
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const empresaId = value ? Number(value) : null;

                      setValues((prev: any) => {
                        atualizarTarefa({ idCliente: empresaId });
                        return { ...prev, company: value };
                      });
                    }}
                  >
                    {/* Opção SEM empresa */}
                    <option value="">Sem empresa vinculada</option>

                    {/* Lista de empresas */}
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
                      value={
                        values.dataLimite && values.dataLimite !== "0000-00-00" && values.dataLimite !== "1899-11-30"
                          ? values.dataLimite
                          : ""
                      }
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, "");

                        if (raw.length > 8) raw = raw.slice(0, 8);

                        let formatted = raw;
                        if (raw.length > 4) {
                          formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
                        } else if (raw.length > 2) {
                          formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
                        }

                        setValues((prev: any) => ({
                          ...prev,
                          dataLimite: formatted,
                        }));
                      }}
                      onBlur={() => {
                        const raw = values.dataLimite.replace(/\D/g, "");

                        if (!raw) {
                          setValues((prev: any) => ({
                            ...prev,
                            dataLimite: "",
                          }));
                          atualizarTarefa({ dataLimite: "0000-00-00" });
                        } else if (raw.length === 8) {
                          const dd = raw.slice(0, 2);
                          const mm = raw.slice(2, 4);
                          const yyyy = raw.slice(4);
                          const formatToDB = `${yyyy}-${mm}-${dd}`;
                          atualizarTarefa({ dataLimite: formatToDB });
                        }
                      }}
                    />

                  </div>
                </div>


                <button
                  style={{
                    backgroundColor: "#dc3545", // vermelho estilo Bootstrap
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
                      await deleteTarefa(Number(values.id)); // Deleta no backend
                      props.removeCard(props.bid, values.id); // Remove da UI
                      props.onClose(); // Fecha o modal
                    } catch (err) {
                      console.error("Erro ao deletar tarefa:", err);
                      alert("Erro ao excluir o cartão. Tente novamente.");
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

// Removed the conflicting local declaration of useCallback
