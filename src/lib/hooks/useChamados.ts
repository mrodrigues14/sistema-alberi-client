import useSWR from "swr";
import { fetcher } from "../api";
import { Chamado } from "../../../types/Chamado";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 🔹 Buscar todos os chamados
export function useChamados() {
  const { data, error, isLoading, mutate } = useSWR<Chamado[]>('/report', fetcher); // ⬅️ Corrigido
  return {
    chamados: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Buscar chamado por ID
export function useChamado(id?: number) {
  const shouldFetch = id !== undefined;
  const { data, error, isLoading, mutate } = useSWR<Chamado>(
    shouldFetch ? `/report/${id}` : null, // ⬅️ Corrigido
    fetcher
  );

  return {
    chamado: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// 🔹 Criar chamado com arquivo opcional
export async function createChamado(chamadoData: Partial<Chamado>, file?: File) {
  const formData = new FormData();

  for (const key in chamadoData) {
    const value = chamadoData[key as keyof Chamado];
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  if (file) {
    formData.append("arquivo", file);
  }

  const response = await fetch(`${API_URL}/report`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Erro ao criar chamado");

  return await response.json();
}

// 🔹 Atualizar chamado
export async function updateChamado(id: number, updates: Partial<Chamado>) {
  const response = await fetch(`${API_URL}/report/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Erro ao atualizar chamado");

  return await response.json();
}

// 🔹 Deletar chamado
export async function deleteChamado(id: number) {
  const response = await fetch(`${API_URL}/report/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar chamado");

  return true;
}

// 🔹 Download do arquivo do chamado
export async function downloadReportFile(id: number) {
  const response = await fetch(`${API_URL}/report/${id}/file`);

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (response.status === 404 && data?.message?.includes("inválido")) {
      throw new Error("Não foi possível baixar o arquivo: ele está corrompido ou em formato inválido.");
    }
    throw new Error("Erro ao baixar o arquivo.");
  }

  const blob = await response.blob();

  // Nome do arquivo vindo do header ou fallback
  let fileName = `arquivo_${id}`;

  const disposition = response.headers.get("Content-Disposition");
  if (disposition && disposition.includes("filename=")) {
    const match = disposition.match(/filename="(.+?)"/);
    if (match?.[1]) {
      fileName = decodeURIComponent(match[1]);
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

