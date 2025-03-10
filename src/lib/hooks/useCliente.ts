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

// Hook para buscar todos os clientes ou um cliente específico
export function useCliente(id?: number, cpf?: string, cnpj?: string) {
  let query = "/clientes";

  if (id) {
    query = `/clientes?id=${id}`; // Busca específica por ID
  } else if (cpf) {
    query = `/clientes?cpf=${cpf}`;
  } else if (cnpj) {
    query = `/clientes?cnpj=${cnpj}`;
  }

  const { data, error, isLoading, mutate } = useSWR(id || cpf || cnpj ? query : "/clientes", fetcher);

  return {
    clientes: data, // Se for uma busca geral, retorna todos os clientes
    cliente: data && Array.isArray(data) ? data[0] : null, // Retorna um único cliente quando buscar por ID
    isLoading,
    isError: error,
    mutate, // Para revalidar os dados
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
