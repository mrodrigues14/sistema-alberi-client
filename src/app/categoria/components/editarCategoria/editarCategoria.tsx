"use client";

import React, { useEffect, useState } from "react";
import { Categoria, atualizarCategoria, useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { useClienteContext } from "@/context/ClienteContext";

interface EditarCategoriaProps {
    categoria: Categoria;
    onClose: () => void;
    mutate: () => void;
}

const EditarCategoria: React.FC<EditarCategoriaProps> = ({ categoria, onClose, mutate }) => {
    const { idCliente } = useClienteContext();
    const { categoriasCliente } = useCategoriasPorCliente(idCliente || undefined);

    const [nome, setNome] = useState(categoria.nome);
    const [idPai, setIdPai] = useState<number | null>(categoria.idCategoriaPai || null);
    const [gastoMes, setGastoMes] = useState(categoria.gastoMes);
    const [gastoExtra, setGastoExtra] = useState(categoria.gastoExtra);
    const [loading, setLoading] = useState(false);

    const handleAtualizarCategoria = async () => {
        if (!nome.trim()) {
            alert("Digite um nome para a categoria.");
            return;
        }

        setLoading(true);
        try {
            await atualizarCategoria(categoria.idcategoria, {
                nome,
                idCategoriaPai: idPai,
                gastoMes,
                gastoExtra,
            });
            mutate();
            onClose();
            alert("Categoria atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
            alert("Erro ao atualizar categoria.");
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
                <h2 className="text-xl font-bold mb-4">Editar Categoria</h2>

                <label className="block text-sm font-semibold mb-1">Nome da Categoria</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <label className="block text-sm font-semibold mb-1">Rubrica Financeira Pai (Opcional)</label>
                <select
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={idPai || ""}
                    onChange={(e) => setIdPai(e.target.value ? Number(e.target.value) : null)}
                >
                    <option value="">Nenhuma (Criar Rubrica Financeira)</option>
                    {categoriasCliente
                        .filter((cat: Categoria) => !cat.idCategoriaPai && cat.idcategoria !== categoria.idcategoria)
                        .map((cat: Categoria) => (
                            <option key={cat.idcategoria} value={cat.idcategoria}>
                                {cat.nome}
                            </option>
                        ))}

                </select>

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
                        onClick={handleAtualizarCategoria}
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditarCategoria;
