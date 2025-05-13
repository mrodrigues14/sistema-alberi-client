"use client";

import React, { useMemo, useState } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { useCategoriasPorCliente, deletarCategoria, atualizarCategoria } from "@/lib/hooks/useCategoria";
import { useClienteContext } from "@/context/ClienteContext";
import type { Categoria } from "@/lib/hooks/useCategoria";
import AdicionarCategoria from "./components/adicionarCategoria/adicionarCategoria";
import EditarCategoria from "./components/editarCategoria/editarCategoria";
import { atualizarRubrica, deletarRubrica, useRubricasContabeis } from "@/lib/hooks/useRubricaContabil";

const Categoria: React.FC = () => {
  const { idCliente } = useClienteContext();
  const { categoriasCliente, isLoading, mutate } = useCategoriasPorCliente(idCliente || undefined);
  const { rubricas, isLoading: isLoadingRubricas, mutate: mutateRubricas } = useRubricasContabeis();

  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalSubrubrica, setShowModalSubrubrica] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria | null>(null);
  const [loadingAcoes, setLoadingAcoes] = useState(false);


  const categoriasOrganizadas = useMemo(() => {
    if (!categoriasCliente) return { pais: [], filhas: {} };

    const pais: Categoria[] = [];
    const filhas: { [key: number]: Categoria[] } = {};

    categoriasCliente.forEach((cat: Categoria) => {
      if (!cat.idCategoriaPai) {
        pais.push(cat);
      } else {
        if (!filhas[cat.idCategoriaPai]) filhas[cat.idCategoriaPai] = [];
        filhas[cat.idCategoriaPai].push(cat);
      }
    });
    return { pais, filhas };
  }, [categoriasCliente]);

  const handleDelete = async (idCategoria: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    setLoadingAcoes(true);

    try {
      await deletarCategoria(idCategoria);
      mutate();
      alert("Categoria excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      alert("Erro ao excluir categoria.");
    } finally {
      setLoadingAcoes(false);
    }
  };


  // ✅ Alternar Rubrica do Mês ou Extra
  const handleToggleGasto = async (idCategoria: number, tipo: "mes" | "extra") => {
    const categoria: Categoria | undefined = categoriasCliente.find(
      (cat: Categoria) => cat.idcategoria === idCategoria
    );
    if (!categoria) return;

    const novoEstado = {
      gastoMes: tipo === "mes" ? !categoria.gastoMes : false,
      gastoExtra: tipo === "extra" ? !categoria.gastoExtra : false,
    };

    setLoadingAcoes(true);

    try {
      await atualizarCategoria(idCategoria, novoEstado);
      mutate();
    } catch (error) {
      console.error("Erro ao atualizar a categoria:", error);
      alert("Erro ao atualizar a categoria.");
    } finally {
      setLoadingAcoes(false);
    }
  };

  const handleToggleRubrica = async (id: number, tipo: "mes" | "extra") => {
    const rubrica = rubricas.find(r => r.idRubricaContabil === id);
    if (!rubrica) return;

    const updates = {
      gastoMes: tipo === "mes" ? !rubrica.gastoMes : false,
      gastoExtra: tipo === "extra" ? !rubrica.gastoExtra : false,
    };

    setLoadingAcoes(true);
    try {
      await atualizarRubrica(id, updates);
      mutateRubricas();
    } catch (error) {
      console.error("Erro ao atualizar rubrica contábil:", error);
      alert("Erro ao atualizar rubrica contábil.");
    } finally {
      setLoadingAcoes(false);
    }
  };

  const handleDeleteRubrica = async (id: number) => {
    if (!confirm("Deseja mesmo excluir esta rubrica contábil?")) return;
    setLoadingAcoes(true);
    try {
      await deletarRubrica(id);
      mutateRubricas();
      alert("Rubrica contábil excluída.");
    } catch (error) {
      console.error("Erro ao deletar rubrica contábil:", error);
      alert("Erro ao deletar rubrica contábil.");
    } finally {
      setLoadingAcoes(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Rubricas e Sub-Rubricas Financeiras</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModalCategoria(true)}
        >
          Adicionar Nova Rubrica Financeira
        </button>

        <button
          className="bg-blue-800 text-white px-4 py-2 rounded"
          onClick={() => setShowModalSubrubrica(true)}
        >
          Adicionar Nova Subrubrica Financeira
        </button>
      </div>

      {/* ✅ Renderizando Rubricas e Subrubricas */}
      <div className="border rounded p-4">
        {isLoading ? (
          <p>Carregando categorias...</p>
        ) : (
          categoriasOrganizadas.pais.map((categoria: Categoria) => (
            <div key={categoria.idcategoria}>
              {/* 🔹 Rubrica Principal */}
              <div className="flex justify-between items-center border-b py-2">
                <span className="font-semibold">{categoria.nome}</span>
                <div className="flex gap-4">
                  <button className="text-orange-500" onClick={() => setCategoriaSelecionada(categoria)}>
                    <FaPencilAlt />
                  </button>

                  <button className="text-red-500" onClick={() => handleDelete(categoria.idcategoria)}>
                    <FaTrash />
                  </button>

                  <button
                    className={`px-3 py-1 rounded ${categoria.gastoMes ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    onClick={() => handleToggleGasto(categoria.idcategoria, "mes")}
                  >
                    Rubrica do Mês
                  </button>

                  <button
                    className={`px-3 py-1 rounded ${categoria.gastoExtra ? "bg-green-500 text-white" : "bg-gray-300"}`}
                    onClick={() => handleToggleGasto(categoria.idcategoria, "extra")}
                  >
                    Rubrica Extra
                  </button>
                </div>
              </div>

              {/* 🔹 Subrubricas */}
              {categoriasOrganizadas.filhas[categoria.idcategoria]?.map((subrubrica: Categoria) => (
                <div key={subrubrica.idcategoria} className="flex justify-between items-center pl-6 border-b py-2">
                  <span className="font-semibold text-gray-600">↳ {subrubrica.nome}</span>

                  <div className="flex gap-4">
                    <button className="text-orange-500" onClick={() => setCategoriaSelecionada(subrubrica)}>
                      <FaPencilAlt />
                    </button>

                    <button className="text-red-500" onClick={() => handleDelete(subrubrica.idcategoria)}>
                      <FaTrash />
                    </button>

                    {/* Botões de seleção */}
                    <button
                      className={`px-3 py-1 rounded ${subrubrica.gastoMes ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                      onClick={() => handleToggleGasto(subrubrica.idcategoria, "mes")}
                    >
                      Rubrica do Mês
                    </button>

                    <button
                      className={`px-3 py-1 rounded ${subrubrica.gastoExtra ? "bg-green-500 text-white" : "bg-gray-300"}`}
                      onClick={() => handleToggleGasto(subrubrica.idcategoria, "extra")}
                    >
                      Rubrica Extra
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {/* 🔹 Seção para Rubricas Contábeis (sem subrubricas) */}
      <h2 className="text-2xl font-semibold text-center mt-2 mb-4">Rubricas Contabéis</h2>

      <div className="flex justify-center gap-4 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModalCategoria(true)}
        >
          Adicionar Nova Rubrica Contábil
        </button>
      </div>
      <div className="mt-8 border rounded p-4">
        <h3 className="text-lg font-bold mb-4">Rubricas Contábeis</h3>
        {isLoading ? (
          <p>Carregando rubricas contábeis...</p>
        ) : (
          rubricas.map((rubrica) => (
            <div key={rubrica.idRubricaContabil} className="flex justify-between items-center border-b py-2">
              <span className="font-medium">{rubrica.nome}</span>
              <div className="flex gap-4">
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteRubrica(rubrica.idRubricaContabil)}
                >
                  <FaTrash />
                </button>

                <button
                  className={`px-3 py-1 rounded ${rubrica.gastoMes ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                  onClick={() => handleToggleRubrica(rubrica.idRubricaContabil, "mes")}
                >
                  Rubrica do Mês
                </button>

                <button
                  className={`px-3 py-1 rounded ${rubrica.gastoExtra ? "bg-green-500 text-white" : "bg-gray-300"}`}
                  onClick={() => handleToggleRubrica(rubrica.idRubricaContabil, "extra")}
                >
                  Rubrica Extra
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModalCategoria && <AdicionarCategoria onClose={() => setShowModalCategoria(false)} mutate={mutate} />}
      {showModalSubrubrica && <AdicionarCategoria onClose={() => setShowModalSubrubrica(false)} mutate={mutate} />}
      {categoriaSelecionada && (
        <EditarCategoria
          categoria={categoriaSelecionada}
          onClose={() => setCategoriaSelecionada(null)}
          mutate={mutate}
        />
      )}
      {loadingAcoes && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white px-6 py-4 rounded shadow text-center">
            <p className="text-lg font-semibold mb-2">Processando...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
};

export default Categoria;
