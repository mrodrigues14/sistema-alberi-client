import useSWR from "swr";
import axios from "axios";
import { useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Fornecedor {
    idfornecedor: number;
    nome: string;
    cnpj?: string | null;
    cpf?: string | null;
    tipoDeProduto?: string | null;
    entrada?: number | null;
    saida?: number | null;
  }
  

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useFornecedoresPorCliente(idCliente: number | null) {

  const { data, error, mutate } = useSWR<Fornecedor[]>(
    idCliente ? `${API_URL}/relacoes-cliente-fornecedor/cliente/${idCliente}` : null,
    fetcher
  );

  const fornecedores = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
  }, [data]);

  console.log("Fornecedores:", fornecedores);
  return {
    fornecedores,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}

export async function criarFornecedor(fornecedorData: Partial<Fornecedor>, idCliente: number) {
  try {
    const fornecedorResponse = await axios.post(`${API_URL}/fornecedor`, fornecedorData);
    const novoFornecedor = fornecedorResponse.data;

    await axios.post(`${API_URL}/relacoes-cliente-fornecedor/${idCliente}/${novoFornecedor.idfornecedor}`);

    return novoFornecedor;
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    throw error;
  }
}

// 🔹 Editar um fornecedor existente
export async function editarFornecedor(idFornecedor: number, updates: Partial<Fornecedor>) {
  try {
    const response = await axios.patch(`${API_URL}/fornecedor/${idFornecedor}`, updates);
    return response.data;
  } catch (error) {
    console.error("Erro ao editar fornecedor:", error);
    throw error;
  }
}

// 🔹 Deletar um fornecedor e remover sua relação com o cliente
export async function deletarFornecedor(idCliente: number, idFornecedor: number) {
  try {
    // Remove a relação cliente-fornecedor
    await axios.delete(`${API_URL}/relacoes-cliente-fornecedor/${idCliente}/${idFornecedor}`);

    // Deleta o fornecedor se necessário (apenas se não estiver vinculado a outros clientes)
    await axios.delete(`${API_URL}/fornecedor/${idFornecedor}`);
  } catch (error) {
    console.error("Erro ao deletar fornecedor:", error);
    throw error;
  }
}
