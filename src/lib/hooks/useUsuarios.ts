import useSWR, { mutate } from "swr";
import { fetcher } from "../api";
import { Usuario } from "../../../types/Usuario";

// Base da URL da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.albericonsult.com.br";
const BASE_URL = `${API_URL}/usuarios`;

// 🔹 Buscar todos os usuários
export function useUsuarios() {
  const { data, error, isLoading, mutate: swrMutate } = useSWR<Usuario[]>("/usuarios", fetcher);

  const usuariosFiltrados = Array.isArray(data)
    ? data.filter((usuario) => usuario.ativo)
    : [];

  return {
    usuarios: usuariosFiltrados,
    isLoading,
    isError: error,
    mutateUsuarios: swrMutate,
  };
}


export function useUsuariosInativos() {
  const { data, error, isLoading, mutate } = useSWR<Usuario[]>("/usuarios", fetcher);

  const usuariosFiltrados = Array.isArray(data)
    ? data.filter((usuario) => !usuario.ativo)
    : [];

  return {
    usuarios: usuariosFiltrados,
    isLoading,
    isError: error,
    mutateUsuarios: mutate,
  };
}
// 🔹 Buscar um único usuário pelo ID
export function useUsuarioById(id: number) {
  const { data, error, isLoading } = useSWR(id ? `${BASE_URL}/${id}` : null, fetcher);

  return {
    usuario: data || null,
    isLoading,
    isError: error,
  };
}

// 🔹 Criar um novo usuário
export async function createUsuario(novoUsuario: any) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario),
    });

    if (!res.ok) throw new Error("Erro ao criar usuário");

    await mutate(BASE_URL);
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}

// 🔹 Atualizar um usuário existente
export async function updateUsuario(id: number, dadosAtualizados: any) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT", // ⬅️ PATCH é mais indicado se for parcial
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Erro ao atualizar usuário");
    }

    await mutate(BASE_URL);
    await mutate(`${BASE_URL}/${id}`);
    return await res.json();
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }
}

// 🔹 Deletar um usuário
export async function deleteUsuario(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar usuário");

    await mutate(BASE_URL);
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    throw error;
  }
}
