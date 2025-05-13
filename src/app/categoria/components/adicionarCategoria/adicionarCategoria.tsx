import React, { useState } from "react";
import { Categoria, criarCategoria } from "@/lib/hooks/useCategoria";
import { criarRubrica } from "@/lib/hooks/useRubricaContabil";
import { useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { useClienteContext } from "@/context/ClienteContext";

interface AdicionarCategoriaProps {
  onClose: () => void;
  mutate: () => void;
}

const AdicionarCategoria: React.FC<AdicionarCategoriaProps> = ({ onClose, mutate }) => {
  const { idCliente } = useClienteContext();
  const { categoriasCliente } = useCategoriasPorCliente(idCliente || undefined);

  const [nome, setNome] = useState("");
  const [idPai, setIdPai] = useState<number | null>(null);
  const [gastoMes, setGastoMes] = useState(false);
  const [gastoExtra, setGastoExtra] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<"financeira" | "contabil">("financeira");

  const handleAdicionar = async () => {
    if (!nome.trim()) {
      alert("Digite um nome.");
      return;
    }

    setLoading(true);
    try {
      if (tipo === "contabil") {
        await criarRubrica({ nome, gastoMes, gastoExtra });
      } else {
        if (!idCliente) {
          alert("Erro: Cliente não identificado.");
          return;
        }
        await criarCategoria(nome, idCliente, idPai, gastoMes, gastoExtra);
      }

      mutate();
      onClose();
      alert("Rubrica adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar rubrica:", error);
      alert("Erro ao criar rubrica.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGasto = (tipo: "mes" | "extra") => {
    if (tipo === "mes") {
      setGastoMes(!gastoMes);
      setGastoExtra(false);
    } else {
      setGastoExtra(!gastoExtra);
      setGastoMes(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-bold mb-4">Adicionar Rubrica</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Tipo de Rubrica</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "financeira" | "contabil")}
          >
            <option value="financeira">Rubrica Financeira</option>
            <option value="contabil">Rubrica Contábil</option>
          </select>
        </div>

        <label className="block text-sm font-semibold mb-1">Nome</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded mb-4"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {tipo === "financeira" && (
          <>
            <label className="block text-sm font-semibold mb-1">Rubrica Pai (opcional)</label>
            <select
              className="w-full px-3 py-2 border rounded mb-4"
              value={idPai || ""}
              onChange={(e) => setIdPai(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Nenhuma (Rubrica Principal)</option>
              {categoriasCliente
                .filter((cat: Categoria) => !cat.idCategoriaPai)
                .map((cat: Categoria) => (
                  <option key={cat.idcategoria} value={cat.idcategoria}>
                    {cat.nome}
                  </option>
                ))}
            </select>
          </>
        )}

        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded ${gastoMes ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => handleToggleGasto("mes")}
          >
            Rubrica do Mês
          </button>
          <button
            className={`px-4 py-2 rounded ${gastoExtra ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => handleToggleGasto("extra")}
          >
            Rubrica Extra
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

export default AdicionarCategoria;
