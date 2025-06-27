import useSWR from "swr";
import { fetcher } from "../api";
import { Cliente } from "../../../types/Cliente";
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useMeusClientes() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/relacao-usuario-cliente/usuario/${userId}/clientes` : null,
    fetcher
  );

  // Filtra apenas clientes ativos
  const clientesFiltrados = Array.isArray(data)
    ? data.filter((cliente: Cliente) => cliente.ativo === 1)
    : [];

  return {
    meusClientes: clientesFiltrados,
    isLoading,
    isError: error,
    mutate,
  };
}
