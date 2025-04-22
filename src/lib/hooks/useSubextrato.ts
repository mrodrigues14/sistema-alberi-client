import useSWR from "swr";
import { fetcher } from "../api";
import { Subextrato } from "../../../types/Subextrato";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Criar novo subextrato
export async function criarSubextrato(subextrato: Partial<Subextrato>): Promise<Subextrato> {
    const response = await fetch(`${API_URL}/subextrato`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subextrato),
    });
    if (!response.ok) {
      throw new Error("Erro ao criar o subextrato");
    }
  
    return response.json();
  }
  
// 🔹 Buscar todos os subextratos
export function useSubextratos() {
  const { data, error, mutate, isLoading } = useSWR<Subextrato[]>("/subextrato", fetcher);
  return {
    subextratos: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Buscar um subextrato específico
export function useSubextrato(id?: number) {
  const { data, error, mutate, isLoading } = useSWR<Subextrato>(
    id ? `/subextrato/${id}` : null,
    fetcher
  );

  return {
    subextrato: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Atualizar um subextrato
export async function atualizarSubextrato(id: number, updates: Partial<Subextrato>): Promise<Subextrato> {
  const response = await fetch(`/subextrato/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar o subextrato");
  }

  return response.json();
}

// 🔹 Deletar um subextrato
export async function deletarSubextrato(id: number): Promise<void> {
  const response = await fetch(`/subextrato/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar o subextrato");
  }
}
