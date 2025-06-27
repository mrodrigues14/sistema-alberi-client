import useSWR from "swr";
import { fetcher } from "../api";
import { Cliente } from "../../../types/Cliente";

// Hook para buscar clientes vinculados a um usuário
export function useClientesDoUsuario(userId?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/relacao-usuario-cliente/usuario/${userId}/clientes` : null,
    fetcher
  );

  return {
    clientesVinculados: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Função para atualizar as relações usuário-cliente
export async function updateClientesDoUsuario(userId: number, clienteIds: number[]) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.albericonsult.com.br";
  
  try {
    const response = await fetch(`${API_URL}/relacao-usuario-cliente/usuario/${userId}/clientes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clienteIds }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar relações usuário-cliente");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar relações:", error);
    throw error;
  }
}

// Função para vincular um cliente a um usuário
export async function vincularClienteAoUsuario(userId: number, clienteId: number) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.albericonsult.com.br";
  
  try {
    const response = await fetch(`${API_URL}/relacao-usuario-cliente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        idUsuario: userId, 
        idEmpresaReferencia: clienteId 
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao vincular cliente ao usuário");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao vincular cliente:", error);
    throw error;
  }
}
