import useSWR, { mutate } from "swr";
import { fetcher } from "../api";

const BASE_URL = "http://localhost:8080/tarefas";

// 🔹 Hook para buscar todas as tarefas ou filtrar por cliente/usuário
export function useTarefas(idCliente?: number, idUsuario?: number) {
  let query = "/tarefas";

  if (idCliente) query += `?id_cliente=${idCliente}`;
  if (idUsuario) query += `?id_usuario=${idUsuario}`;

  const { data, error, isLoading } = useSWR(query, fetcher);

  return {
    tarefas: data || [],
    isLoading,
    isError: error,
    mutateTarefas: () => mutate(query), // Atualiza os dados no SWR
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

    await mutate(BASE_URL); // Atualiza a lista de tarefas
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    throw error;
  }
}

// 🔹 Atualizar uma tarefa (status ou qualquer outro campo)
export async function updateTarefa(id: number, updates: any) {
  try {
    console.log(id)
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

    await mutate(BASE_URL); // Atualiza os dados no cache SWR
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

    await mutate(BASE_URL); // Atualiza a lista de tarefas no SWR
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
}
