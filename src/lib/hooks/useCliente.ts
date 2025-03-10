import useSWR from "swr";
import { fetcher } from "../api"; // Fetcher usado para requisições SWR

interface Cliente {
  idcliente: number;
  cnpj?: string;
  cpf?: string;
  telefone?: string;
  nome: string;
  endereco?: string;
  cep?: string;
  nomeResponsavel?: string;
  cpfResponsavel?: string;
  inscricaoEstadual?: string;
  cnaePrincipal?: string;
  apelido?: string;
  email?: string;
  ativo?: boolean;
}

// Hook para buscar clientes
export function useCliente(id?: number, cpf?: string, cnpj?: string) {
  let query = "/clientes";

  if (id) query += `?id=${id}`;
  if (cpf) query += `?cpf=${cpf}`;
  if (cnpj) query += `?cnpj=${cnpj}`;

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);
  
  return {
    clientes: data,
    isLoading,
    isError: error,
    mutate, // Para revalidar os dados após criar, atualizar ou deletar
  };
}

// Criar um novo cliente
export async function createCliente(cliente: Partial<Cliente>) {
  const response = await fetch("/clientes", {
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

// Atualizar um cliente existente
export async function updateCliente(id: number, cliente: Partial<Cliente>) {
  const response = await fetch(`/clientes/${id}`, {
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

// Deletar um cliente
export async function deleteCliente(id: number) {
  const response = await fetch(`/clientes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Erro ao deletar cliente");
  }
}
