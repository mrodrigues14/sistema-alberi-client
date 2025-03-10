import useSWR from "swr";
import { fetcher } from "../api";

export function useTarefas(idCliente?: number, idUsuario?: number) {
  let query = "/tarefas";

  if (idCliente) query += `?id_cliente=${idCliente}`;
  if (idUsuario) query += `?id_usuario=${idUsuario}`;

  const { data, error, isLoading } = useSWR(query, fetcher);

  // Normalizar os dados para corrigir valores inválidos
  const normalizeTarefas = (tarefas: any[]) => {
    return tarefas.map((tarefa) => ({
      ...tarefa,
      dataInicio: isValidDate(tarefa.dataInicio) ? tarefa.dataInicio : null,
      dataConclusao: isValidDate(tarefa.dataConclusao) ? tarefa.dataConclusao : null,
      dataLimite: isValidDate(tarefa.dataLimite) ? tarefa.dataLimite : null,
    }));
  };

  return {
    tarefas: data ? normalizeTarefas(data) : [],
    isLoading,
    isError: error,
  };
}

// Função para validar se a data recebida é válida
function isValidDate(date: any) {
  if (!date || date === "0000-00-00" || date === "1899-11-30" || new Date(date).toString() === "Invalid Date") {
    return false;
  }
  return true;
}
