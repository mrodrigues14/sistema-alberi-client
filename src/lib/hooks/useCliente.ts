import useSWR from "swr";
import { fetcher } from "../api";
import { Cliente } from "../../../types/Cliente";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  // 🔹 Se for listagem geral, aplica filtro para clientes ativos
  const clientesFiltrados = !id && !cpf && !cnpj && Array.isArray(data)
    ? data.filter((cliente: Cliente) => cliente.ativo === 1)
    : data;

  return {
    clientes: clientesFiltrados,
    cliente: Array.isArray(clientesFiltrados) ? clientesFiltrados[0] : clientesFiltrados,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useClientesInativos() {
  const { data, error, isLoading, mutate } = useSWR(`/clientes`, fetcher);

  const clientesFiltrados = Array.isArray(data)
    ? data.filter((cliente: Cliente) => cliente.ativo !== 1)
    : [];

  return {
    clientes: clientesFiltrados,
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
