import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SaldoInicial {
  id: number;
  idCliente: number;
  idBanco: number;
  mesAno: string;
  saldo: number;
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
  const { idBanco, idCliente, mesAno, saldo } = novoSaldo;

  if (!idBanco || !idCliente || !mesAno || saldo == null) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos");
  }

  const data = `${mesAno}-01`; // exemplo: "2025-04-01"

  const payload = {
    ...novoSaldo,
    data, 
  };

  const response = await fetch(`${API_URL}/saldo-inicial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Erro ao criar saldo inicial");

  return response.json();
}


export async function upsertSaldoInicial(novoSaldo: Omit<SaldoInicial, "id">) {
  const { idBanco, idCliente, mesAno, saldo } = novoSaldo;

  if (!idBanco || !idCliente || !mesAno || saldo == null) {
    throw new Error("Todos os campos obrigatórios devem ser preenchidos");
  }

  // 🔎 Verifica se já existe um saldo para esse cliente/banco/mesAno
  const checkResponse = await fetch(
    `${API_URL}/saldo-inicial/cliente/${idCliente}/banco/${idBanco}?mesAno=${mesAno}`
  );

  if (checkResponse.ok) {
    const existente = await checkResponse.json();
    if (existente?.id) {
      // 🔁 Atualiza saldo existente
      return await updateSaldoInicial(existente.id, { saldo });
    }
  }

  // 🆕 Caso não exista, cria novo
  const payload = {
    ...novoSaldo,
    data: `${mesAno}-01`,
  };

  const createResponse = await fetch(`${API_URL}/saldo-inicial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!createResponse.ok) throw new Error("Erro ao criar saldo inicial");
  return createResponse.json();
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
