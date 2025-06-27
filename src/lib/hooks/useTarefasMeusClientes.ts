import useSWR from "swr";
import { fetcher } from "../api";
import { useSession } from "next-auth/react";

// Hook para buscar tarefas dos meus clientes
export function useTarefasMeusClientes() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/tarefas/meus-clientes/${userId}` : null,
    fetcher
  );

  return {
    tarefas: data || [],
    isLoading,
    isError: error,
    mutateTarefas: mutate,
  };
}