"use client";

import React, { useState } from "react";
import { criarFornecedor, Fornecedor } from "@/lib/hooks/useFornecedor";
import { useClienteContext } from "@/context/ClienteContext";

interface AdicionarFornecedorProps {
  onClose: () => void;
  mutate: () => void;
}

const AdicionarFornecedor: React.FC<AdicionarFornecedorProps> = ({ onClose, mutate }) => {
  const { idCliente } = useClienteContext();

  const [nome, setNome] = useState("");
  const [entrada, setEntrada] = useState(false);
  const [saida, setSaida] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAdicionar = async () => {
    if (!nome.trim()) {
      alert("Digite o nome do fornecedor.");
      return;
    }

    if (!idCliente) {
      alert("Erro: Cliente não identificado.");
      return;
    }

    setLoading(true);
    try {
      const novoFornecedor: Partial<Fornecedor> = {
        nome,
        entrada: entrada ? 1 : 0,
        saida: saida ? 1 : 0,
      };
      await criarFornecedor(novoFornecedor, 94);
      mutate();
      onClose();
      alert("Fornecedor adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      alert("Erro ao criar fornecedor.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Alternar tipo (entrada ou saída)
  const handleToggleTipo = (tipo: "entrada" | "saida") => {
    if (tipo === "entrada") {
      setEntrada(!entrada);
      setSaida(false);
    } else {
      setSaida(!saida);
      setEntrada(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Adicionar Fornecedor</h2>

        <label className="block text-sm font-semibold mb-1">Nome do Fornecedor</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded mb-4"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded ${entrada ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => handleToggleTipo("entrada")}
          >
            Fornecedor de Entrada
          </button>
          <button
            className={`px-4 py-2 rounded ${saida ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => handleToggleTipo("saida")}
          >
            Fornecedor de Saída
          </button>
        </div>

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleAdicionar}
            disabled={loading}
          >
            {loading ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdicionarFornecedor;
