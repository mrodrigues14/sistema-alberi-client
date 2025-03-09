import useSWR from "swr";
import { fetcher } from "../api";

export function useTarefas(idCliente?: number, idUsuario?: number) {
  let query = "/tarefas";

  if (idCliente) query += `?id_cliente=${idCliente}`;
  if (idUsuario) query += `?id_usuario=${idUsuario}`;

  const { data, error, isLoading } = useSWR(query, fetcher);

  return {
    tarefas: data,
    isLoading,
    isError: error,
  };
}
