import useSWRImmutable from 'swr/immutable';
import { ExtratoAnexo } from './useExtratoAnexos';
import { fetcher } from '../api';

// Busca anexos de vários extratos em paralelo, retorna { idExtrato: [anexos] }
export function useExtratoAnexosPorExtrato(idsExtrato: number[]) {
  const fetchAnexos = async (ids: number[]): Promise<Record<number, ExtratoAnexo[]>> => {
    if (!ids || ids.length === 0) return {};
    // POST em lote para reduzir overhead de múltiplas conexões
    const res = await fetcher(`/extrato-anexos/by-extratos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    } as any);
    return res as Record<number, ExtratoAnexo[]>;
  };

  const uniqueSortedIds = Array.from(new Set(idsExtrato)).sort((a, b) => a - b);
  const key = uniqueSortedIds.length > 0 ? `anexos-por-extrato:${uniqueSortedIds.join(',')}` : null;
  const { data, error, isLoading, mutate } = useSWRImmutable(
    key,
    () => fetchAnexos(uniqueSortedIds),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
      dedupingInterval: 300000, // 5 min
    }
  );

  return {
    anexosPorExtrato: data || {},
    isLoading,
    isError: error,
    mutate,
  };
}
