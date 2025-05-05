import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface SaldoInicial {
  id: number;
  idCliente: number;
  idBanco: number;
  mesAno: string;
  saldo: number;
  definidoManualmente?: boolean;
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

    const mesFormatado = meses[mes] ?? "01";
    const mesAnoFormatado = `${ano}-${mesFormatado}`;

    query = `/saldo-inicial/cliente/${idCliente}/banco/${idBanco}?mesAno=${mesAnoFormatado}`;
  }

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);

  const isValidData = data && typeof data === "object" && "saldo" in data;

  return {
    saldoInicial: isValidData ? Number(data.saldo) || 0 : 0,
    definidoManualmente: isValidData ? data.definidoManualmente === 1 || data.definidoManualmente === true : false,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function upsertSaldoInicial(novoSaldo: Omit<SaldoInicial, "id">) {
  const { idBanco, idCliente, mesAno, saldo, definidoManualmente } = novoSaldo;

  const checkResponse = await fetch(
    `${API_URL}/saldo-inicial/cliente/${idCliente}/banco/${idBanco}?mesAno=${mesAno}`
  );

  // Se já existe, faz update
  if (checkResponse.ok) {
    const existente = await checkResponse.json();

    if (existente && existente.id) {
      return await updateSaldoInicial(existente.id, {
        saldo,
        idBanco,
        idCliente,
        mesAno,
        definidoManualmente,
      });
    }
  }

  // Senão, cria novo
  const payload = {
    ...novoSaldo,
    data: `${mesAno}-01`, // data precisa ser preenchida
  };

  const createResponse = await fetch(`${API_URL}/saldo-inicial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!createResponse.ok) throw new Error("Erro ao criar saldo inicial");
  return await createResponse.json();
}


export async function updateSaldoInicial(id: number, updates: Partial<SaldoInicial>) {
  const response = await fetch(`${API_URL}/saldo-inicial/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) throw new Error("Erro ao atualizar saldo inicial");

  return response.json();
}

export async function deleteSaldoInicial(id: number) {
  const response = await fetch(`${API_URL}/saldo-inicial/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar saldo inicial");
}
