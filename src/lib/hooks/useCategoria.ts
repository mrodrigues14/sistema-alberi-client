import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Categoria {
  idcategoria: number;
  nome: string;
  idCategoriaPai?: number | null; // 🔹 Suporte para categorias filhas
  gastoMes: boolean;
  gastoExtra: boolean;
}

// ✅ Buscar todas as categorias disponíveis
export function useCategorias() {
  const { data, error, isLoading, mutate } = useSWR(`/categorias`, fetcher);

  return {
    categorias: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// ✅ Buscar categorias associadas a um cliente
export function useCategoriasPorCliente(idCliente?: number) {
  const { data, error, isLoading, mutate } = useSWR(
    idCliente ? `/relacoes-cliente-categoria/cliente/${idCliente}` : null,
    fetcher
  );

  // 🔹 Transformação dos dados para estruturar categorias pai e filhas
  const categoriasCliente = data
    ? data.map((relacao: { idCategoria: number; categoria: Categoria }) => ({
        idcategoria: relacao.categoria.idcategoria,
        nome: relacao.categoria.nome,
        idCategoriaPai: relacao.categoria.idCategoriaPai || null,
        gastoMes: relacao.categoria.gastoMes,
        gastoExtra: relacao.categoria.gastoExtra,
      }))
    : [];

  // 🔹 Organiza categorias em estrutura pai-filho
  const categoriasOrganizadas = categoriasCliente.reduce((acc: any, cat: Categoria) => {
    if (!cat.idCategoriaPai) {
      acc.pais.push(cat); // ✅ Se não tem `idCategoriaPai`, é uma categoria pai
    } else {
      acc.filhas.push(cat); // ✅ Caso contrário, é uma categoria filha
    }
    return acc;
  }, { pais: [], filhas: [] });

  return {
    categoriasCliente,
    categoriasOrganizadas,
    isLoading,
    isError: error,
    mutate,
  };
}

// ✅ Criar uma nova categoria e associá-la ao cliente
export async function criarCategoria(
  nome: string,
  idCliente: number,
  idCategoriaPai?: number | null, // 🔹 Se preenchido, será uma subrubrica
  gastoMes: boolean = false,
  gastoExtra: boolean = false
) {
  const response = await fetch(
    `${API_URL}/categorias?idCliente=${idCliente}`, // 🔹 Cliente obrigatório
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        idCategoriaPai: idCategoriaPai || null, // 🔹 Vincula a uma categoria pai se informado
        gastoMes,
        gastoExtra,
      }),
    }
  );

  if (!response.ok) throw new Error("Erro ao criar a categoria");

  return response.json();
}

// ✅ Atualizar o nome de uma categoria
export async function atualizarNomeCategoria(idCategoria: number, novoNome: string) {
  const response = await fetch(`${API_URL}/categorias/${idCategoria}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: novoNome }),
  });

  if (!response.ok) throw new Error("Erro ao atualizar o nome da categoria");

  return response.json();
}

// ✅ Atualizar uma categoria (pode alterar nome e idCategoriaPai)
export async function atualizarCategoria(idCategoria: number, updates: Partial<Categoria>) {
  const response = await fetch(`${API_URL}/categorias/${idCategoria}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Erro ao atualizar a categoria");

  return response.json();
}

// ✅ Deletar uma categoria
export async function deletarCategoria(idCategoria: number) {
  const response = await fetch(`${API_URL}/categorias/${idCategoria}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar a categoria");

  return { message: "Categoria deletada com sucesso" };
}

// ✅ Associar uma categoria a um cliente
export async function associarCategoriaCliente(idCliente: number, idCategoria: number) {
  const response = await fetch(
    `${API_URL}/relacoes-cliente-categoria/cliente/${idCliente}/categoria/${idCategoria}`,
    { method: "POST" }
  );

  if (!response.ok) throw new Error("Erro ao associar categoria ao cliente");

  return response.json();
}

// ✅ Remover uma categoria de um cliente
export async function removerCategoriaCliente(idCliente: number, idCategoria: number) {
  const response = await fetch(
    `${API_URL}/relacoes-cliente-categoria/cliente/${idCliente}/categoria/${idCategoria}`,
    { method: "DELETE" }
  );

  if (!response.ok) throw new Error("Erro ao remover categoria do cliente");

  return { message: "Relação Cliente-Categoria removida com sucesso" };
}
