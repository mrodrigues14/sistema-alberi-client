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
  const query = idCliente
    ? `/extratos/resumo/cliente/${idCliente}${mes && ano ? `?mes=${mes}&ano=${ano}` : ''}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<ResumoMes>(query, fetcher);

  return {
    resumo: data ?? null,
    isLoading: Boolean(idCliente) && Boolean(isLoading),
    isError: idCliente ? error : null,
    mutate,
  } as const;
}
