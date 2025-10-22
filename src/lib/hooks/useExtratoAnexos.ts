import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ExtratoAnexo {
  caminho?: any; // se ainda usar base64 em alguns casos
  idAnexo: number;
  nomeArquivo: string;
  tipoExtratoAnexo: string;
  idExtrato: number;
  arquivo?: {
    data: number[]; // representa o conteúdo binário do arquivo
  };
}

  

// 🔹 Hook para listar todos os anexos
export function useExtratoAnexos() {
  const { data, error, isLoading, mutate } = useSWR<ExtratoAnexo[]>(`/extrato-anexos`, fetcher);
  console.log('[useExtratoAnexos] data:', data, 'error:', error, 'loading:', isLoading);
  return {
    anexos: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Buscar um anexo por ID
export async function getExtratoAnexo(id: number): Promise<ExtratoAnexo> {
  const res = await fetch(`${API_URL}/extrato-anexos/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar anexo");
  return res.json();
}

// 🔹 Criar um novo anexo
export async function createExtratoAnexo(anexo: Partial<ExtratoAnexo>) {
  const res = await fetch(`${API_URL}/extrato-anexos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anexo),
  });

  if (!res.ok) throw new Error("Erro ao criar anexo");
  return res.json();
}

// 🔹 Atualizar um anexo existente
export async function updateExtratoAnexo(id: number, updates: Partial<ExtratoAnexo>) {
  const res = await fetch(`${API_URL}/extrato-anexos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Erro ao atualizar anexo");
  return res.json();
}

// 🔹 Deletar um anexo
export async function deleteExtratoAnexo(id: number) {
  const res = await fetch(`${API_URL}/extrato-anexos/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Erro ao deletar anexo");
}

// 🔹 Upload de arquivo com conteúdo binário
export async function uploadExtratoAnexo(payload: {
    file: File;
    idExtrato: number;
    tipoExtratoAnexo: string;
  }) {
    const formData = new FormData();
    formData.append("arquivo", payload.file);
    formData.append("idExtrato", String(payload.idExtrato));
    formData.append("tipoExtratoAnexo", payload.tipoExtratoAnexo);
  
    const res = await fetch(`${API_URL}/extrato-anexos/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Erro ao enviar anexo");
    return res.json();
  }
  