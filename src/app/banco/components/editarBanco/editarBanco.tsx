"use client";

import { useState } from "react";
import { updateBanco, useBanco } from "@/lib/hooks/userBanco"; // ✅ Importar useBanco para pegar mutate()

interface EditarBancoProps {
  idBanco: number;
  nomeInicial: string;
  tipoInicial: "CONTA CORRENTE" | "CONTA INVESTIMENTO" | "CONTA SALARIO";
  onClose: () => void;
}

const EditarBanco: React.FC<EditarBancoProps> = ({ idBanco, nomeInicial, tipoInicial, onClose }) => {
  const [nome, setNome] = useState(nomeInicial);
  const [tipo, setTipo] = useState(tipoInicial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useBanco(); // ✅ Pegando mutate do hook

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
        await updateBanco(idBanco, { nome, tipo });
        await mutate(); // ✅ Atualiza a lista após edição
        onClose(); // ✅ Fecha o modal apenas após atualizar a lista
    } catch (err) {
        setError("Erro ao atualizar o banco.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[450px] relative">
        <button className="absolute top-3 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
          ✖
        </button>
        <h2 className="text-xl font-bold text-center mb-4">Editar Banco</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nome do Banco:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Digite o nome do banco"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tipo:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as any)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="CONTA CORRENTE">Conta Corrente</option>
            <option value="CONTA INVESTIMENTO">Conta Investimento</option>
            <option value="CONTA SALARIO">Conta Salário</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          className="w-full px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
};

export default EditarBanco;
