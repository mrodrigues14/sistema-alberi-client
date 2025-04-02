import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SaldoInicial {
  id: number;
  idCliente: number;
  idBanco: number;
  mesAno: string;
  valor: number;
}

export function useSaldoInicial(idCliente?: number, idBanco?: number, mes?: string, ano?: string) {
    let query = null;
  
    if (idCliente && idBanco && mes && ano) {
      const meses: Record<string, string> = {
        "Janeiro": "01",
        "Fevereiro": "02",
        "Março": "03",
        "Abril": "04",
        "Maio": "05",
        "Junho": "06",
        "Julho": "07",
        "Agosto": "08",
        "Setembro": "09",
        "Outubro": "10",
        "Novembro": "11",
        "Dezembro": "12",
      };

      const mesFormatado = meses[mes] ?? "01"; // Converte o nome do mês para número
      const mesAnoFormatado = `${ano}-${mesFormatado}`; // Exemplo: 2024-12

      query = `/saldo-inicial/cliente/${idCliente}/banco/${idBanco}?mesAno=${mesAnoFormatado}`;
    }
  
    const { data, error, isLoading, mutate } = useSWR(query, fetcher);
    return {
      saldoInicial: data ? Number(data.saldo) || 0 : 0, // Garante que o valor seja tratado corretamente
      isLoading,
      isError: error,
      mutate,
    };
}

  

// 🔹 Criar um novo saldo inicial
export async function createSaldoInicial(novoSaldo: Omit<SaldoInicial, "id">) {
  const response = await fetch(`${API_URL}/saldo-inicial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoSaldo),
  });

  if (!response.ok) throw new Error("Erro ao criar saldo inicial");

  return response.json();
}

// 🔹 Atualizar um saldo inicial pelo ID
export async function updateSaldoInicial(id: number, updates: Partial<SaldoInicial>) {
  const response = await fetch(`${API_URL}/saldo-inicial/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Erro ao atualizar saldo inicial");

  return response.json();
}

// 🔹 Deletar um saldo inicial pelo ID
export async function deleteSaldoInicial(id: number) {
  const response = await fetch(`${API_URL}/saldo-inicial/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar saldo inicial");
}
