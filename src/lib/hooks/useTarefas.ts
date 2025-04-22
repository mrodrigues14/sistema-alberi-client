import useSWR, { mutate } from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.albericonsult.com.br";
const BASE_URL = `${API_URL}/tarefas`;

// 🔹 Hook para buscar todas as tarefas ou filtrar por cliente/usuário
// useTarefas.ts
export function useTarefas(idCliente?: number, idUsuario?: number) {
  let query = "/tarefas";
  if (idCliente) query += `?id_cliente=${idCliente}`;
  if (idUsuario) query += `${idCliente ? "&" : "?"}id_usuario=${idUsuario}`;

  const { data, error, isLoading, mutate: swrMutate } = useSWR(query, fetcher);
  return {
    tarefas: data || [],
    isLoading,
    isError: error,
    mutateTarefas: swrMutate, // ⬅️ usamos a própria função mutate do SWR
  };
}

// 🔹 Buscar uma única tarefa pelo ID
export function useTarefaById(id: number) {
  const { data, error, isLoading } = useSWR(id ? `${BASE_URL}/${id}` : null, fetcher);

  return {
    tarefa: data || null,
    isLoading,
    isError: error,
  };
}

// 🔹 Criar uma nova tarefa
export async function createTarefa(novaTarefa: any) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTarefa),
    });

    if (!res.ok) throw new Error("Erro ao criar tarefa");

    await mutate(BASE_URL);
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

// 🔹 Atualizar uma tarefa
export async function updateTarefa(id: number, updates: any) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("❌ Erro ao atualizar tarefa:", errorData);
      throw new Error(errorData.message || "Erro ao atualizar tarefa");
    }

    await mutate(BASE_URL);
    return await res.json();
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    throw error;
  }
}

// 🔹 Deletar uma tarefa
export async function deleteTarefa(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar tarefa");

    await mutate(BASE_URL);
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
}
