"use client";

import { useState } from "react";
import { useChamados, downloadReportFile, updateChamado, deleteChamado } from "@/lib/hooks/useChamados";
import ChamadoModal from "./components/chamadosModal/chamadosModal";
import Navbar from "@/components/Navbar";
import { FaPlusCircle } from "react-icons/fa";
import { Chamado } from "../../../types/Chamado";
import { FaEdit, FaCheck, FaTimes, FaBan, FaPlay, FaEye } from "react-icons/fa";
import { useUsuarios } from "@/lib/hooks/useUsuarios";
import ModalRecusa from "./components/recusaModal/ModalRecusa";
import AvisoAlerta from "@/components/avisoAlerta/avisoAlerta";

const statusLabels = [
  { label: "Não Iniciado", color: "bg-yellow-400", value: "Não Iniciado" },
  { label: "Em Desenvolvimento", color: "bg-blue-500", value: "Em Desenvolvimento" },
  { label: "Em Validação", color: "bg-purple-700", value: "Em Validação" },
  { label: "Concluído", color: "bg-green-600", value: "Concluído" },
  { label: "Recusados pelo Usuário", color: "bg-red-500", value: "Recusados pelo Usuário" },
];

export default function ChamadosPage() {
  const { chamados, isLoading, isError, mutate } = useChamados();
  console.log(chamados)
  const [filtroSituacao, setFiltroSituacao] = useState("Não Iniciado");
  const [modalOpen, setModalOpen] = useState(false);
  const [chamadoSelecionado, setChamadoSelecionado] = useState<Chamado | null>(null);
  const [loadingAvaliacao, setLoadingAvaliacao] = useState(false);
  const [modalRecusaOpen, setModalRecusaOpen] = useState(false);
  const [chamadoRecusando, setChamadoRecusando] = useState<Chamado | null>(null);
  const { usuarios } = useUsuarios();
  const [alerta, setAlerta] = useState<{ mensagem: string; tipo: "success" | "danger" | "warning" | "info" } | null>(null);

  const handleConcluirChamado = async (id: number) => {
    setLoadingAvaliacao(true);
    try {
      await updateChamado(id, { situacao: "Concluído" });
      await mutate();
      setAlerta({ mensagem: "Chamado concluído com sucesso!", tipo: "success" });
    } catch (error) {
      setAlerta({ mensagem: "Erro ao concluir chamado", tipo: "danger" });
      console.error(error);
    } finally {
      setLoadingAvaliacao(false);
    }
  };

  const handleCancelarChamado = async (id: number) => {
    if (!confirm("Tem certeza que deseja cancelar (excluir) este chamado?")) return;
    setLoadingAvaliacao(true);
    try {
      await deleteChamado(id);
      await mutate();
      setAlerta({ mensagem: "Chamado cancelado com sucesso!", tipo: "success" });
    } catch (error) {
      setAlerta({ mensagem: "Erro ao cancelar chamado", tipo: "danger" });
      console.error(error);
    } finally {
      setLoadingAvaliacao(false);
    }
  };

  const handleRecusarChamado = (chamado: Chamado) => {
    setChamadoRecusando(chamado);
    setModalRecusaOpen(true);
  };

  const handleEmDesenvolvimento = async (id: number) => {
    setLoadingAvaliacao(true);
    try {
      console.log('Alterando para Em Desenvolvimento:', { id, situacao: "Em Desenvolvimento" });
      await updateChamado(id, { situacao: "Em Desenvolvimento" });
      await mutate();
      setAlerta({ mensagem: "Status alterado para Em Desenvolvimento!", tipo: "success" });
    } catch (error) {
      console.error('Erro detalhado:', error);
      setAlerta({ mensagem: "Erro ao alterar status para Em Desenvolvimento", tipo: "danger" });
    } finally {
      setLoadingAvaliacao(false);
    }
  };

  const handleValidar = async (id: number) => {
    setLoadingAvaliacao(true);
    try {
      console.log('Alterando para Em Validação:', { id, situacao: "Em Validação" });
      await updateChamado(id, { situacao: "Em Validação" });
      await mutate();
      setAlerta({ mensagem: "Status alterado para Em Validação!", tipo: "success" });
    } catch (error) {
      console.error('Erro detalhado:', error);
      setAlerta({ mensagem: "Erro ao alterar status para Em Validação", tipo: "danger" });
    } finally {
      setLoadingAvaliacao(false);
    }
  };

  const renderBotoesAcao = (chamado: Chamado) => {
    const situacao = chamado.situacao;

    switch (situacao) {
      case "Não Iniciado":
        return (
          <>
            <button
              onClick={() => handleEmDesenvolvimento(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              <FaPlay /> Em Desenvolvimento
            </button>
            <button
              onClick={() => handleCancelarChamado(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              <FaTimes /> Cancelar
            </button>
          </>
        );

      case "Em Desenvolvimento":
        return (
          <>
            <button
              onClick={() => handleValidar(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            >
              <FaEye /> Validar
            </button>
            <button
              onClick={() => handleCancelarChamado(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              <FaTimes /> Cancelar
            </button>
          </>
        );

      case "Em Validação":
        return (
          <>
            <button
              onClick={() => handleConcluirChamado(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              <FaCheck /> Concluir
            </button>
            <button
              onClick={() => handleRecusarChamado(chamado)}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              <FaBan /> Recusar
            </button>
            <button
              onClick={() => handleCancelarChamado(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              <FaTimes /> Cancelar
            </button>
          </>
        );

      case "Concluído":
        return (
          <button
            onClick={() => handleCancelarChamado(chamado.id)}
            className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
          >
            <FaTimes /> Cancelar
          </button>
        );

      case "Recusados pelo Usuário":
        return (
          <>
            <button
              onClick={() => handleValidar(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            >
              <FaEye /> Validar
            </button>
            <button
              onClick={() => handleCancelarChamado(chamado.id)}
              className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              <FaTimes /> Cancelar
            </button>
          </>
        );

      default:
        return (
          <button
            onClick={() => handleCancelarChamado(chamado.id)}
            className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
          >
            <FaTimes /> Cancelar
          </button>
        );
    }
  };


  const handleEditarChamado = (chamado: Chamado) => {
    setChamadoSelecionado(chamado);
    setModalOpen(true);
  };

  function normalizarTexto(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }


  const filtrados = chamados
    .filter((c) => normalizarTexto(c.situacao || "") === normalizarTexto(filtroSituacao))
    .sort((a, b) => b.id - a.id);


  const statusCounts = chamados.reduce<Record<string, number>>((acc, chamado) => {
    const situacaoNormalizada = normalizarTexto(chamado.situacao || "");
    const key = statusLabels.find(s => normalizarTexto(s.value) === situacaoNormalizada)?.value;
    if (key) {
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  const confirmarRecusaChamado = async (motivo: string) => {
    if (!chamadoRecusando) return;
    setLoadingAvaliacao(true);
    try {
      await updateChamado(chamadoRecusando.id, {
        situacao: "Recusados pelo Usuário",
        descricaoRecusa: motivo,
      });
      await mutate();
      setAlerta({ mensagem: "Chamado recusado com sucesso!", tipo: "success" });
    } catch (error) {
      setAlerta({ mensagem: "Erro ao recusar chamado", tipo: "danger" });
      console.error(error);
    } finally {
      setLoadingAvaliacao(false);
      setModalRecusaOpen(false);
      setChamadoRecusando(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Chamados</h1>
          <button
            onClick={() => {
              setChamadoSelecionado(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            <FaPlusCircle />
            Novo Chamado
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {statusLabels.map((status) => {
            const count = statusCounts[status.value] || 0;
            return (
              <button
                key={status.value}
                onClick={() => setFiltroSituacao(status.value)}
                className={`text-white px-4 py-2 rounded shadow-sm transition ${status.color} ${filtroSituacao === status.value ? "ring-2 ring-offset-2 ring-black" : "opacity-80 hover:opacity-100"
                  }`}
              >
                {status.label} ({count})
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando chamados...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-600 mb-4">Erro ao carregar chamados</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : filtrados.length === 0 ? (
          <p className="text-gray-500 italic">Nenhum chamado com status: {filtroSituacao}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((chamado) => (
              <div
                key={chamado.id}
                className="relative bg-white rounded-lg border shadow-sm p-5 hover:shadow-md transition flex flex-col justify-between"
              >
                {/* Ícone de edição */}
                <button
                  onClick={() => handleEditarChamado(chamado)}
                  className="absolute top-2 left-3 text-gray-500 hover:text-black transition"
                  title="Editar chamado"
                >
                  <FaEdit size={18} />
                </button>

                <div className="absolute top-2 right-3">
                  <span className="text-sm text-gray-500 font-semibold">#{chamado.id}</span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-3">{chamado.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Prioridade:</strong> {chamado.prioridade}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Funcionalidade:</strong> {chamado.funcionalidadeAfetada}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Descrição:</strong> {chamado.descricao}
                  </p>
                  {chamado.situacao === "Recusados pelo Usuário" && chamado.descricaoRecusa && (
                    <p className="text-sm text-red-600 mt-2">
                      <strong>Motivo da recusa:</strong> {chamado.descricaoRecusa}
                    </p>
                  )}

                  <p className="text-sm text-gray-400 mt-3">
                    <strong>Data:</strong>{" "}
                    {chamado.data ? new Date(chamado.data).toLocaleDateString() : "Sem data"}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Usuário:</strong>{" "}
                    {(() => {
                      const usuario = usuarios.find((u) => u.idusuarios === chamado.idUsuario);
                      if (!usuario) return "Desconhecido";
                      const nomes = usuario.nomeDoUsuario.split(" ");
                      return `${nomes[0]} ${nomes[1] || ""}`;
                    })()}
                  </p>

                </div>

                {/* Botão de download do arquivo */}
                {chamado.temArquivo && (
                  <div
                    className="bg-gray-200 border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-300 transition"
                    onClick={async () => {
                      try {
                        await downloadReportFile(chamado.id);
                        setAlerta({ mensagem: "Download iniciado com sucesso!", tipo: "success" });
                      } catch (error: any) {
                        setAlerta({ mensagem: error.message || "Erro ao baixar o arquivo", tipo: "danger" });
                      }
                    }}

                  >
                    📦 Baixar Arquivo
                  </div>
                )}

                {/* Ações */}
                <div className="mt-4 flex gap-2 justify-end">
                  {renderBotoesAcao(chamado)}
                </div>
              </div>
            ))}
          </div>
        )}

        <ChamadoModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setChamadoSelecionado(null);
          }}
          chamadoParaEditar={chamadoSelecionado}
          onSuccess={() => mutate()}
        />

        <ModalRecusa
          open={modalRecusaOpen}
          onClose={() => setModalRecusaOpen(false)}
          onConfirm={confirmarRecusaChamado}
        />

        {loadingAvaliacao && (
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-gray-800 font-medium">Processando...</p>
            </div>
          </div>
        )}

        {alerta && (
          <AvisoAlerta
            mensagem={alerta.mensagem}
            tipo={alerta.tipo}
            onClose={() => setAlerta(null)}
          />
        )}
      </div>
    </div>
  );
}
