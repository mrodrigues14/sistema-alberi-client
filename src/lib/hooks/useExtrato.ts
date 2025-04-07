import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Extrato {
  idextrato: number;
  idCliente: number;
  data: string;
  nomeNoExtrato: string;
  valor: number;
  tipoDeTransacao: "ENTRADA" | "SAIDA";
  idFornecedor?: number | null;
  rubricaContabil?: string | null;
  observacao?: string | null;
}

export function useExtratos(idCliente?: number, idBanco?: number, mes?: string, ano?: string) {
  let query = null;
  console.log(mes, ano);
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
  const response = await fetch(`${API_URL}/extratos/${idExtrato}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Erro ao atualizar extrato");

  return response.json();
}

// 🔹 Deletar um extrato pelo ID
export async function deleteExtrato(idExtrato: number) {
  const response = await fetch(`${API_URL}/extratos/${idExtrato}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar extrato");
}
