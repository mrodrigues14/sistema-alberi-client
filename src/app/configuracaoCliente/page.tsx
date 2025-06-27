"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes, FaBan } from "react-icons/fa";
import ModalCliente from "./modalCliente/ModalCliente";
import { createCliente, updateCliente, useCliente, useClientesInativos } from "@/lib/hooks/useCliente";
import { Cliente } from "../../../types/Cliente";

export default function ConfiguracaoCliente() {
  const { clientes: clientesAtivos, isLoading, isError, mutate } = useCliente();
  const { clientes: clientesInativos, mutate: mutateInativos } = useClientesInativos();
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleSalvarCliente = async (cliente: Cliente) => {
    if (clienteEditando) {
      await updateCliente(cliente.idcliente, cliente);
    } else {
      await createCliente(cliente);
    }

    await mutate();
    await mutateInativos();
    setModalOpen(false);
    setClienteEditando(null);
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-xl font-bold mb-4 text-center">Adicionar Cliente</h1>
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando clientes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-xl font-bold mb-4 text-center">Adicionar Cliente</h1>
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-600 text-lg">❌ Erro ao carregar clientes</p>
              <p className="text-gray-500 mt-2">Tente recarregar a página</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-4 text-center">Adicionar Cliente</h1>

        <div className="mb-6 flex justify-center">
          <button
            onClick={() => {
              setClienteEditando(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus /> Adicionar Novo Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Ativos */}
          <div className="bg-white shadow-md rounded-lg border">
            <h2 className="text-lg font-semibold px-4 pt-4 pb-2 border-b">Clientes Ativos</h2>
            {clientesAtivos.map((cliente: Cliente) => (
              <div
                key={cliente.idcliente}
                className="flex items-center justify-between px-4 py-3 border-b last:border-none"
              >
                <span className="font-medium text-gray-800">{cliente.nome}</span>
                <div className="flex items-center gap-4">
                  <button
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => {
                      setClienteEditando(cliente);
                      setModalOpen(true);
                    }}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <FaCheck className="text-green-600" />
                    <button
                      className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center gap-1"
                      disabled={loadingId === cliente.idcliente}
                      onClick={async () => {
                        setLoadingId(cliente.idcliente);
                        await updateCliente(cliente.idcliente, { ativo: 0 });
                        await mutate();
                        await mutateInativos();
                        setLoadingId(null);
                      }}
                    >
                      <FaBan /> {loadingId === cliente.idcliente ? "Aguarde..." : "Inativar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inativos */}
          <div className="bg-white shadow-md rounded-lg border">
            <h2 className="text-lg font-semibold px-4 pt-4 pb-2 border-b">Clientes Inativos</h2>
            {clientesInativos.map((cliente: Cliente) => (
              <div
                key={cliente.idcliente}
                className="flex items-center justify-between px-4 py-3 border-b last:border-none"
              >
                <span className="font-medium text-gray-800">{cliente.nome}</span>
                <div className="flex items-center gap-4">
                  <button
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => {
                      setClienteEditando(cliente);
                      setModalOpen(true);
                    }}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <FaTimes className="text-red-500" />
                    <button
                      className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                      disabled={loadingId === cliente.idcliente}
                      onClick={async () => {
                        setLoadingId(cliente.idcliente);
                        await updateCliente(cliente.idcliente, { ativo: 1 });
                        await mutate();
                        await mutateInativos();
                        setLoadingId(null);
                      }}
                    >
                      <FaCheck /> {loadingId === cliente.idcliente ? "Aguarde..." : "Ativar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ModalCliente
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setClienteEditando(null);
          }}
          onSave={handleSalvarCliente}
          cliente={clienteEditando}
        />
      </div>
    </div>
  );
}
