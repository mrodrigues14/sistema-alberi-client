import useSWR from "swr";
import { fetcher } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Banco {
    idbanco: number;
    nome: string;
    tipo: "CONTA CORRENTE" | "CONTA INVESTIMENTO" | "CONTA SALARIO";
  }
  
  export function useBanco(idCliente?: number) {
    let query = "/bancos";
  
    if (idCliente) query = `/relacao-cliente-banco/cliente/${idCliente}`;
  
    const { data, error, isLoading, mutate } = useSWR(query, fetcher);
  
    const bancosFormatados: Banco[] = data?.map((relacao: { banco?: Banco }) => (
        relacao.banco ? {  // ✅ Verifica se banco existe antes de acessar
            idbanco: relacao.banco.idbanco,
            nome: relacao.banco.nome,
            tipo: relacao.banco.tipo,
        } : null
    )).filter(Boolean) || []; // ✅ Filtra valores inválidos
    
  
    return {
      bancos: bancosFormatados,
      isLoading,
      isError: error,
      mutate, 
    };
  }



export async function createBanco(
  novoBanco: Pick<Banco, "nome" | "tipo">,
  idCliente?: number
): Promise<Banco> {
  const response = await fetch(`${API_URL}/bancos`, {  // 🛠️ Adicionado API_URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoBanco),
  });

  if (!response.ok) throw new Error("Erro ao criar banco");

  const bancoCriado: Banco = await response.json();

  if (idCliente) {
    const relacaoResponse = await fetch(
      `${API_URL}/relacao-cliente-banco/${idCliente}/${bancoCriado.idbanco}`, // 🛠️ Corrigido aqui também
      {
        method: "POST",
      }
    );

    if (!relacaoResponse.ok)
      throw new Error("Erro ao vincular banco ao cliente");
  }

  return bancoCriado;
}

// 🔹 Atualizar um banco existente
export async function updateBanco(
    idBanco: number,
    updates: Partial<Pick<Banco, "nome" | "tipo">>
): Promise<Banco> {
    const response = await fetch(`${API_URL}/bancos/${idBanco}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error("Erro ao atualizar banco");

    return response.json();
}

  

// 🔹 Deletar um banco ou apenas desvincular de um cliente
export async function deleteBanco(idBanco: number, idCliente?: number) {
  if (idCliente) {
    const response = await fetch(
      `${API_URL}/relacao-cliente-banco/${idCliente}/${idBanco}`, // 🛠️ Adicionado API_URL
      {
        method: "DELETE",
      }
    );

    if (!response.ok) throw new Error("Erro ao remover banco do cliente");

    return;
  }

  const response = await fetch(`${API_URL}/bancos/${idBanco}`, {  // 🛠️ Adicionado API_URL
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Erro ao deletar banco");
}
