import useSWR, { mutate } from 'swr';
import { fetcher } from '../api';
  // Assumindo que o fetcher é configurado para usar a URL base corretamente.
export interface Usuario {
    idusuarios: number;
    nomeDoUsuario: string;
    usuarioLogin?: string;
    cpf?: string;
    usuarioEmail?: string;
    role?: string;
  }
  
const BASE_URL = '/usuarios';

// 🔹 Hook para buscar todos os usuários ou filtrar por ID
export function useUsuarios() {
  const { data, error, isLoading } = useSWR<Usuario[]>(BASE_URL, fetcher);

  return {
    usuarios: data || [],
    isLoading,
    isError: error,
    mutateUsuarios: () => mutate(BASE_URL), // Revalida os dados ao atualizar
  };
}

// 🔹 Hook para buscar um usuário pelo ID
export function useUsuarioById(id: number) {
  const { data, error, isLoading } = useSWR(id ? `${BASE_URL}/${id}` : null, fetcher);

  return {
    usuario: data || null,
    isLoading,
    isError: error,
  };
}

// 🔹 Função para criar um usuário
export async function createUsuario(novoUsuario: any) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario),
    });

    if (!res.ok) throw new Error('Erro ao criar usuário');

    // Após criar o usuário, revalidamos os dados da lista de usuários
    await mutate(BASE_URL);
    return await res.json();
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

// 🔹 Função para atualizar um usuário
export async function updateUsuario(id: number, dadosAtualizados: any) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!res.ok) throw new Error('Erro ao atualizar usuário');

    // Revalidando a lista de usuários e o usuário atualizado
    await mutate(BASE_URL);
    await mutate(`${BASE_URL}/${id}`);
    return await res.json();
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
}

// 🔹 Função para deletar um usuário
export async function deleteUsuario(id: number) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Erro ao deletar usuário');

    // Revalidando a lista de usuários após a remoção
    await mutate(BASE_URL);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}
