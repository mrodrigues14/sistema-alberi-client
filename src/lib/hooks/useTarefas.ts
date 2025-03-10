import useSWR, { mutate } from "swr";
import { fetcher } from "../api";

// URL base para as requisições
const BASE_URL = "/tarefas";

export function useTarefas(idCliente?: number, idUsuario?: number) {
  let query = BASE_URL;

  if (idCliente) query += `?id_cliente=${idCliente}`;
  if (idUsuario) query += `?id_usuario=${idUsuario}`;

  const { data, error, isLoading } = useSWR(query, fetcher);

  // Função para criar uma nova tarefa
  const createTarefa = async (novaTarefa: any) => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTarefa),
    });
    mutate(query); // Atualiza os dados no SWR
    return res.json();
  };

  // Função para atualizar uma tarefa (incluindo mudar de coluna)
  const updateTarefa = async (id: number, updates: any) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    mutate(query);
    return res.json();
  };

  // Função para deletar uma tarefa
  const deleteTarefa = async (id: number) => {
    await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    mutate(query);
  };

  return {
    tarefas: data || [],
    isLoading,
    isError: error,
    createTarefa,
    updateTarefa,
    deleteTarefa,
  };
}
