import React, { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  CheckSquare,
  CreditCard,
  List,
  Plus,
  Type,
  X,
  Star, Tag, Clock, Trash, User, Briefcase
} from "react-feather";
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";
import { useCallback } from "react";
import { useUsuarios, Usuario } from "@/lib/hooks/useUsuarios";
import Card from "../Card";

interface Task {
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
  };
  bid: string;
  updateCard: (updatedCard: any) => void;
  removeCard: (bid: string, cardId: string) => void;
  onClose: () => void;
}

export default function CardDetails(props: CardDetailsProps) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

  const [input, setInput] = useState(false);
  const [labelShow, setLabelShow] = useState(false);
  const { usuarios } = useUsuarios(); // Obtém os usuários do sistema
  const [searchTerm, setSearchTerm] = useState(""); // Estado da pesquisa no dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Controla a abertura do dropdown
  const [values, setValues] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCard = localStorage.getItem(`card-${props.card.id}`);
      return savedCard
        ? JSON.parse(savedCard)
        : { ...props.card, autor: props.card.autor || "" };
    }
    return { ...props.card, autor: props.card.autor || "" };
  });
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
      />
    );
  };


  const addTask = (value: string) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
    });
    setValues({ ...values });
  };

  const removeTask = (id: string) => {
    const remaningTask = values.task.filter((item: Task) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id: string) => {
    const taskIndex = values.task.findIndex((item: Task) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    setValues({ ...values });
  };

  const updateTitle = useCallback((value: string) => {
    setValues((prevValues: typeof values) => {
      const updatedValues: typeof values = { ...prevValues, title: value };

      props.updateCard(updatedValues); // Atualiza o card globalmente

      if (typeof window !== "undefined") {
        localStorage.setItem(`card-${updatedValues.id}`, JSON.stringify(updatedValues));
      }

      return updatedValues;
    });
  }, [props]);


  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item: Task) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id: string) => {
    const tempTag = values.tags.filter((item: Tag) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  const addTag = (value: string, color: string) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });

    setValues({ ...values });
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

  const { updateCard } = props;

  useEffect(() => {
    updateCard(values);

    if (typeof window !== "undefined") {
      localStorage.setItem(`card-${values.id}`, JSON.stringify(values));
    }
  }, [values, updateCard]);
  
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
                <div className="d-flex align-items-end  justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CheckSquare className="icon__md" />
                    <h6>Lista de Tarefas</h6>
                  </div>
                  <div className="card__action__btn">
                    <button onClick={() => deleteAllTask()}>
                      Excluir todas as tarefas
                    </button>
                  </div>
                </div>
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
                        className="task__list d-flex align-items-start gap-2"
                      >
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => {
                            updateTask(item.id);
                          }}
                        />

                        <h6
                          className={`flex-grow-1 ${item.completed === true ? "strike-through" : ""
                            }`}
                        >
                          {item.task}
                        </h6>
                        <Trash
                          onClick={() => {
                            removeTask(item.id);
                          }}
                          style={{
                            cursor: "pointer",
                            width: "18px",
                            height: "18px",
                          }}
                        />
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
                <h6>Priority</h6>
                <div className="priority-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={values.priority >= star ? "star selected" : "star"}
                      fill={values.priority >= star ? "gold" : "gray"} // Apenas a estrela será preenchida
                      stroke="none" // Remove o contorno preto
                      onClick={() => setValues({ ...values, priority: star })}
                    />
                  ))}
                </div>

                {/* Executor */}
                <h6>Responsável</h6>
                <div className="responsavel-dropdown">
                  {/* Exibir nome do responsável e permitir clique para abrir dropdown */}
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
                                setValues({ ...values, autor: user.nomeDoUsuario }); // Atualiza o responsável no card
                                setIsDropdownOpen(false); // Fecha o dropdown
                              }}
                            >
                              {user.nomeDoUsuario}
                            </li>
                          ))}
                      </ul>

                    </div>
                  )}
                </div>


                {/* Empresa */}
                <h6>Empresa</h6>
                <select
                  className="select-field"
                  value={values.company || ""}
                  onChange={(e) => setValues({ ...values, company: e.target.value })}
                >
                  <option value="" disabled>Selecione uma empresa</option>
                  {["Empresa A", "Empresa B", "Empresa C", "Empresa D"].map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>

                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}
                <button>
                  <span className="icon__sm">
                    <Clock />
                  </span>
                  Data
                </button>

                <button onClick={() => props.removeCard(props.bid, values.id)}>
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
