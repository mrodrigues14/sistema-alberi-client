"use client";

import { createChamado, updateChamado } from "@/lib/hooks/useChamados";
import { useEffect, useState } from "react";
import { Chamado } from "../../../../../types/Chamado";

interface Props {
  open: boolean;
  onClose: () => void;
  chamadoParaEditar?: Chamado | null;
  onSuccess?: () => void;
}

export default function ChamadoModal({ open, onClose, chamadoParaEditar, onSuccess }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [funcionalidadeAfetada, setFuncionalidadeAfetada] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [removerAnexo, setRemoverAnexo] = useState(false);
  const [prioridade, setPrioridade] = useState("");
  const [descricaoRecusa, setDescricaoRecusa] = useState("");

  const modoEdicao = !!chamadoParaEditar;

  useEffect(() => {
    if (!open) return;

    if (chamadoParaEditar) {
      setTitulo(chamadoParaEditar.titulo || "");
      setDescricao(chamadoParaEditar.descricao || "");
      setTipo(chamadoParaEditar.tipo || "");
      setFuncionalidadeAfetada(chamadoParaEditar.funcionalidadeAfetada || "");
      setPrioridade(chamadoParaEditar.prioridade || "");
      setFile(null);
      setRemoverAnexo(false);
      setDescricaoRecusa(chamadoParaEditar.descricaoRecusa || "");
    } else {
      setTitulo("");
      setDescricao("");
      setTipo("");
      setFuncionalidadeAfetada("");
      setPrioridade("");
      setFile(null);
      setRemoverAnexo(false);
      setDescricaoRecusa("");
    }
  }, [open, chamadoParaEditar]);


  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const chamadoData: {
      titulo: string;
      descricao: string;
      tipo: string;
      funcionalidadeAfetada: string;
      prioridade: string;
      situacao: string;
      data: string;
      idUsuario: number;
      arquivo?: null;
    } = {
      titulo,
      descricao,
      tipo,
      funcionalidadeAfetada,
      prioridade,
      situacao: chamadoParaEditar?.situacao || "Não Iniciado",
      data: new Date().toISOString(),
      idUsuario: 1,
    };

    try {
      if (modoEdicao && chamadoParaEditar) {
        if (file) {
          const formData = new FormData();
          for (const key in chamadoData) {
            const value = chamadoData[key as keyof typeof chamadoData];
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          }
          formData.append("arquivo", file);
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${chamadoParaEditar.id}`, {
            method: "PATCH",
            body: formData,
          });
        } else {
          const atualizacao = { ...chamadoData };
          if (removerAnexo) atualizacao["arquivo"] = null;
          await updateChamado(chamadoParaEditar.id, atualizacao);
        }

        alert("Chamado atualizado com sucesso!");
      } else {
        await createChamado(chamadoData, file ?? undefined);
        alert("Chamado criado com sucesso!");
      }

      onClose();
      onSuccess?.();
    } catch (err) {
      alert("Erro ao salvar chamado");
      console.error(err);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {modoEdicao ? "Editar Chamado" : "Abrir novo chamado"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Descrição do erro ou melhoria"
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {modoEdicao && chamadoParaEditar?.situacao === "Recusados pelo Usuário" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo da Recusa
              </label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={descricaoRecusa}
                onChange={(e) => setDescricaoRecusa(e.target.value)}
                placeholder="Explique o motivo da recusa"
                rows={3}
              />
            </div>
          )}

          <select
            className="w-full border rounded px-3 py-2"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            required
          >
            <option value="">Selecione a prioridade</option>
            <option value="URGENTE">Urgente</option>
            <option value="AJUSTE">Ajuste</option>
            <option value="MELHORIA">Melhoria</option>

          </select>


          <select
            className="w-full border rounded px-3 py-2"
            value={funcionalidadeAfetada}
            onChange={(e) => setFuncionalidadeAfetada(e.target.value)}
            required
          >
            <option value="">Selecione a funcionalidade afetada</option>
            <option value="Extrato">Extrato</option>
            <option value="Tarefas">Tarefas</option>
            <option value="Estudos">Estudos</option>
            <option value="Usuário">Usuário</option>
            <option value="Chamados">Chamados</option>

          </select>


          {modoEdicao && typeof chamadoParaEditar?.arquivo === "string" && !removerAnexo && (
            <div className="text-sm text-gray-600 border rounded p-2 bg-gray-100">
              <p className="mb-1">Anexo atual:</p>
              <a
                href={`data:application/octet-stream;base64,${btoa(
                  chamadoParaEditar.arquivo
                )}`}
                download={`chamado_${chamadoParaEditar.id}_anexo`}
                className="text-blue-600 hover:underline"
              >
                📎 Baixar Anexo
              </a>
              <button
                type="button"
                onClick={() => setRemoverAnexo(true)}
                className="ml-4 text-red-600 hover:underline"
              >
                Remover Anexo
              </button>
            </div>
          )}

          {/* Input de novo anexo */}
          {(!modoEdicao || removerAnexo) && (
            <div>
              <label className="block mb-1 text-sm text-gray-600">
                {modoEdicao ? "Substituir anexo" : "Anexar arquivo"}
              </label>
              <input
                type="file"
                accept="
                        .pdf,
                        .png,
                        .jpg,
                        .jpeg,
                        .doc,
                        .docx,
                        .xls,
                        .xlsx,
                        .mp4,
                        .webm,
                        .ogg,
                        .mp3,
                        .wav,
                        video/*,
                        audio/*,
                        image/*,
                        application/vnd.ms-excel,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                      "
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
              />

            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {modoEdicao ? "Salvar Alterações" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
