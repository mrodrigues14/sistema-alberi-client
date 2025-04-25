import useSWR from "swr";
import { fetcher } from "../api";
import { Cliente } from "../../../types/Cliente";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Hook para buscar todos os clientes ou um cliente específico
export function useCliente(id?: number, cpf?: string, cnpj?: string) {
  let query = `${API_URL}/clientes`;

  if (id) {
    query = `${API_URL}/clientes?id=${id}`;
  } else if (cpf) {
    query = `${API_URL}/clientes?cpf=${cpf}`;
  } else if (cnpj) {
    query = `${API_URL}/clientes?cnpj=${cnpj}`;
  }

  const { data, error, isLoading, mutate } = useSWR(
    id || cpf || cnpj ? query : `/clientes`,
    fetcher
  );

  return {
    clientes: data,
    cliente: data && Array.isArray(data) ? data[0] : null,
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Criar um novo cliente
export async function createCliente(cliente: Partial<Cliente>) {
  const response = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao criar cliente");
  }

  return data;
}

// 🔹 Atualizar um cliente existente
export async function updateCliente(id: number, cliente: Partial<Cliente>) {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cliente),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Erro ao atualizar cliente");
  }

  return data;
}

// 🔹 Deletar um cliente
export async function deleteCliente(id: number) {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro ao deletar cliente");
  }
}
