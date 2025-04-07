"use client";

import React, { useState } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

import { useClienteContext } from "@/context/ClienteContext";
import {
  deletarFornecedor,
  editarFornecedor,
  Fornecedor,
  useFornecedoresPorCliente,
} from "@/lib/hooks/useFornecedor";
import AdicionarFornecedor from "./components/adicionarFornecedor/adicionarFornecedor";
import EditarFornecedor from "./components/editarFornecedor/editarFornecedor";

const FornecedorPage: React.FC = () => {
  const { idCliente } = useClienteContext();
  const { fornecedores, isLoading, mutate } = useFornecedoresPorCliente(idCliente);
  const [showModal, setShowModal] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<Fornecedor | null>(null);
  const [deletando, setDeletando] = useState(false);
  const [editando, setEditando] = useState(false);

  const handleDelete = async (idFornecedor: number) => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;

    setDeletando(true);

    try {
      await deletarFornecedor(94, idFornecedor);
      mutate();
      alert("Fornecedor excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      alert("Erro ao excluir fornecedor.");
    } finally {
      setDeletando(false);
    }
  };


  const handleToggleTipo = async (idFornecedor: number, tipo: "entrada" | "saida") => {
    const fornecedor = fornecedores?.find((f) => f.idfornecedor === idFornecedor);
    if (!fornecedor) return;

    const atualizacao = {
      entrada: tipo === "entrada" ? 1 : 0,
      saida: tipo === "saida" ? 1 : 0,
    };

    setEditando(true);

    try {
      await editarFornecedor(idFornecedor, atualizacao);
      mutate();
    } catch (error) {
      console.error("Erro ao atualizar tipo do fornecedor:", error);
      alert("Erro ao atualizar fornecedor.");
    } finally {
      setEditando(false);
    }
  };


  const limitarTexto = (texto: string, limite: number) => {
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Fornecedores Financeiros</h2>

      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Adicionar Fornecedor
        </button>
      </div>

      <div className="border rounded p-4">
        {isLoading ? (
          <p>Carregando fornecedores...</p>
        ) : (
          fornecedores?.map((fornecedor: Fornecedor) => (
            <div
              key={fornecedor.idfornecedor}
              className="flex justify-between items-center border-b py-2"
            >
              <span
                className="font-semibold max-w-[200px] truncate"
                title={fornecedor.nome}
              >
                {limitarTexto(fornecedor.nome, 20)}
              </span>

              <div className="flex gap-3 items-center">
                <button className="text-orange-500" onClick={() => setFornecedorSelecionado(fornecedor)}>
                  <FaPencilAlt />
                </button>


                <button
                  className="text-red-500"
                  onClick={() => handleDelete(fornecedor.idfornecedor)}
                >
                  <FaTrash />
                </button>

                <button
                  className={`px-3 py-1 rounded transition ${fornecedor.entrada
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 hover:bg-blue-100"
                    }`}
                  onClick={() => handleToggleTipo(fornecedor.idfornecedor, "entrada")}
                >
                  Fornecedor de Entrada
                </button>

                <button
                  className={`px-3 py-1 rounded transition ${fornecedor.saida
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 hover:bg-green-100"
                    }`}
                  onClick={() => handleToggleTipo(fornecedor.idfornecedor, "saida")}
                >
                  Fornecedor de Saída
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <AdicionarFornecedor
          onClose={() => setShowModal(false)}
          mutate={mutate}
        />
      )}
      {fornecedorSelecionado && (
        <EditarFornecedor
          fornecedor={fornecedorSelecionado}
          onClose={() => setFornecedorSelecionado(null)}
          mutate={mutate}
        />
      )}
      {deletando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg font-semibold mb-2">Excluindo fornecedor...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      )}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg font-semibold mb-2">Salvando tipo do fornecedor...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FornecedorPage;
