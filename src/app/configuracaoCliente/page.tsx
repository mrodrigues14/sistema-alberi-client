"use client";

import Navbar, { Cliente } from "@/components/Navbar";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes, FaTrash, FaBan } from "react-icons/fa";
import ModalAdicionarCliente from "./modalAdicionarCliente/ModalAdicionarCliente";
import { deleteCliente, updateCliente, useCliente } from "@/lib/hooks/useCliente";

export default function ConfiguracaoCliente() {
  const { clientes, isLoading, isError, mutate } = useCliente();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSalvarCliente = async (novoCliente: Cliente) => {
    await mutate();
    setModalOpen(false);
  };

  if (isLoading) return <p className="p-4">Carregando clientes...</p>;
  if (isError) return <p className="p-4 text-red-600">Erro ao carregar clientes.</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-4">Adicionar Cliente</h1>

        <div className="mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus /> Adicionar Novo Cliente
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg border divide-y">
        {clientes.map((cliente: Cliente) => (
            <div
              key={cliente.idcliente!}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="font-medium text-gray-800">{cliente.nome}</span>

              <div className="flex items-center gap-4">
                <button className="text-orange-500 hover:text-orange-600" title="Editar">
                  <FaEdit />
                </button>

                <div className="flex items-center gap-2">
                  {cliente.ativo ? (
                    <>
                      <FaCheck className="text-green-600" title="Ativo" /> Ativo
                      <button
                        className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center gap-1"
                        title="Inativar cliente"
                        onClick={async () => {
                          await updateCliente(cliente.idcliente!, { ativo: false });
                          await mutate();
                        }}
                      >
                        <FaBan /> Inativar
                      </button>
                    </>
                  ) : (
                    <>
                      <FaTimes className="text-red-500" title="Inativo" /> Inativo
                      <button
                        className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                        title="Reativar cliente"
                        onClick={async () => {
                          await updateCliente(cliente.idcliente!, { ativo: true });
                          await mutate();
                        }}
                      >
                        <FaCheck /> Ativar
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                        title="Excluir cliente"
                        onClick={async () => {
                          if (confirm("Deseja realmente excluir este cliente?")) {
                            await deleteCliente(cliente.idcliente!);
                            await mutate();
                          }
                        }}
                      >
                        <FaTrash /> Excluir
                      </button>
                    </>
                  )}

                </div>

              </div>
            </div>
          ))}
        </div>

        <ModalAdicionarCliente
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSalvarCliente}
        />
      </div>
    </div>
  );
}
