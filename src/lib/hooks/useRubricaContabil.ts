import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface RubricaContabil {
  idRubricaContabil: number;
  nome: string;
  gastoMes: boolean | null;
  gastoExtra: boolean | null;
}

// 🔹 Hook principal para listar rubricas
export function useRubricasContabeis() {
  const { data, error, isLoading, mutate } = useSWR<RubricaContabil[]>("/rubricas", fetcher);

  return {
    rubricas: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Criar uma nova rubrica contábil
export async function criarRubrica(data: Partial<RubricaContabil>) {
  const response = await fetch(`${API_URL}/rubricas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Erro ao criar rubrica contábil");
  return response.json();
}

// 🔹 Atualizar rubrica contábil
export async function atualizarRubrica(
  idRubricaContabil: number,
  updates: Partial<RubricaContabil>
) {
  const response = await fetch(`${API_URL}/rubricas/${idRubricaContabil}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Erro ao atualizar rubrica contábil");
  return response.json();
}

// 🔹 Deletar rubrica contábil
export async function deletarRubrica(idRubricaContabil: number) {
  const response = await fetch(`${API_URL}/rubricas/${idRubricaContabil}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar rubrica contábil");
  return { message: "Rubrica deletada com sucesso" };
}
