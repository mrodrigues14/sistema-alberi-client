"use client";

import React, { useState, useEffect } from "react";
import { editarFornecedor, Fornecedor } from "@/lib/hooks/useFornecedor";

interface EditarFornecedorProps {
  fornecedor: Fornecedor;
  onClose: () => void;
  mutate: () => void;
}

const EditarFornecedor: React.FC<EditarFornecedorProps> = ({
  fornecedor,
  onClose,
  mutate,
}) => {
  const [nome, setNome] = useState(fornecedor.nome);
  const [entrada, setEntrada] = useState(!!fornecedor.entrada);
  const [saida, setSaida] = useState(!!fornecedor.saida);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNome(fornecedor.nome);
    setEntrada(!!fornecedor.entrada);
    setSaida(!!fornecedor.saida);
  }, [fornecedor]);

  const handleEditar = async () => {
    if (!nome.trim()) {
      alert("Digite o nome do fornecedor.");
      return;
    }

    setLoading(true);
    try {
      await editarFornecedor(fornecedor.idfornecedor, {
        nome,
        entrada: entrada ? 1 : 0,
        saida: saida ? 1 : 0,
      });
      mutate();
      onClose();
      alert("Fornecedor editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar fornecedor:", error);
      alert("Erro ao editar fornecedor.");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-xl font-bold mb-4">Editar Fornecedor</h2>

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
            onClick={handleEditar}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarFornecedor;
