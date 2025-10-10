import useSWR from "swr";
import { fetcher } from "../api";
import { Extrato } from "../../../types/Extrato";
import { log } from "console";

const API_URL = process.env.NEXT_PUBLIC_API_URL;



export function useExtratos(idCliente?: number, idBanco?: number, mes?: string, ano?: string) {
  let query = null;
  // Função auxiliar para converter nome do mês para número
  const monthToNumber = (monthName: string): string | null => {
    const monthNames: { [key: string]: number } = {
      "Janeiro": 1, "Fevereiro": 2, "Março": 3, "Abril": 4, "Maio": 5, "Junho": 6,
      "Julho": 7, "Agosto": 8, "Setembro": 9, "Outubro": 10, "Novembro": 11, "Dezembro": 12
    };
    return monthNames[monthName] ? String(monthNames[monthName]).padStart(2, '0') : null;
  };

  // Converte o nome do mês para número
  const mesNumero = mes ? monthToNumber(mes) : null;

  if (idCliente && idBanco) {
    query = `/extratos/cliente/${idCliente}/banco/${idBanco}`;
    console.log(query)
    if (mesNumero && ano) {
      query += `?mes=${mesNumero}&ano=${ano}`;
    }
  }

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);

  return {
    extratos: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}


export async function createExtrato(novoExtrato: Omit<Extrato, "idextrato">) {
  const response = await fetch(`${API_URL}/extratos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoExtrato),
  });

  if (!response.ok) throw new Error("Erro ao criar extrato");

  return response.json();
}
// 🔹 Inserir extratos em lote
export async function createExtratosLote(novosExtratos: Omit<Extrato, "idextrato">[]) {
  const response = await fetch(`${API_URL}/extratos/lote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novosExtratos),
  });

  if (!response.ok) throw new Error("Erro ao inserir extratos em lote");

  return response.json(); // Retorna os extratos criados
}

// 🔹 Atualizar um extrato pelo ID
export async function updateExtrato(
  idExtrato: number,
  updates: Partial<Extrato>
) {
  console.log(updates)
  console.log(idExtrato)
  const response = await fetch(`${API_URL}/extratos/${idExtrato}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  console.log(response)
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao atualizar extrato: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// 🔹 Deletar um extrato pelo ID
export async function deleteExtrato(idExtrato: number) {
  const response = await fetch(`${API_URL}/extratos/${idExtrato}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar extrato");
}

// 🔹 Reordenar extratos em lote
export async function reorderExtratos(ordens: { idextrato: number; ordem: number }[]) {
  const response = await fetch(`${API_URL}/extratos/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ordens),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao reordenar extratos: ${text}`);
  }
}
