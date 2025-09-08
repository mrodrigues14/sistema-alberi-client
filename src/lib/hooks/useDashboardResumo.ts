import useSWR from "swr";
import { fetcher } from "../api";

export interface ResumoMes {
  totalEntradas: number;
  totalSaidas: number;
  saldoMes: number;
  topCategorias: { categoria: string; total: number }[];
  countLancamentos: number;
  maiorGasto: number;
}

export function useDashboardResumo(idCliente?: number, mes?: string, ano?: string) {
  if (!idCliente) return { resumo: null, isLoading: false, isError: null, mutate: () => {} } as any;
  let query = `/extratos/resumo/cliente/${idCliente}`;
  if (mes && ano) query += `?mes=${mes}&ano=${ano}`;
  const { data, error, isLoading, mutate } = useSWR<ResumoMes>(query, fetcher);
  return { resumo: data, isLoading, isError: error, mutate };
}
