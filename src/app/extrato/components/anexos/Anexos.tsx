"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExtratoAnexo, deleteExtratoAnexo, uploadExtratoAnexo } from "@/lib/hooks/useExtratoAnexos";
import { FaTrash, FaTimes, FaPlus, FaDownload } from "react-icons/fa";

interface Props {
  anexos: ExtratoAnexo[];
  onFechar: () => void;
  onAtualizar?: () => void;
  idExtrato?: number;
}

const tiposDisponiveis = [
  { label: "Boleto (BO)", value: "bo" },
  { label: "Comprovante (CO)", value: "co" },
  { label: "Nota Fiscal (NF)", value: "nf" },
  { label: "Recibo (RE)", value: "re" },
  { label: "Outros (OU)", value: "ou" },
];

const Anexos: React.FC<Props> = ({ anexos, onFechar, onAtualizar, idExtrato }) => {
  const [removendoId, setRemovendoId] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("bo");
  const [uploading, setUploading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getExt = (nome: string) => nome.split(".").pop()?.toLowerCase() || "";
  const isImagem = (ext: string) => ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
  const isPDF = (ext: string) => ext === "pdf";
  const isWord = (ext: string) => ["doc", "docx"].includes(ext);
  const isExcel = (ext: string) => ["xls", "xlsx"].includes(ext);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este anexo?")) return;
    try {
      setRemovendoId(id);
      await deleteExtratoAnexo(id);
      onAtualizar?.();
    } catch (err) {
      console.error("Erro ao deletar anexo:", err);
      alert("Erro ao deletar anexo");
    } finally {
      setRemovendoId(null);
    }
  };

  const handleUpload = async () => {
    if (!previewFile || !idExtrato) return;
    setUploading(true);
    try {
      await uploadExtratoAnexo({
        file: previewFile,
        idExtrato,
        tipoExtratoAnexo: tipoSelecionado,
      });
      setPreviewFile(null);
      setPreviewURL(null);
      setTipoSelecionado("bo");
      onAtualizar?.();
    } catch (error) {
      console.error("Erro ao enviar anexo:", error);
      alert("Erro ao enviar anexo.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const downloadBuffer = (bufferData: number[], filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const mimeType = mimeTypes[ext || ""] || "application/octet-stream";

    const blob = new Blob([new Uint8Array(bufferData)], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Limpar referência após o download
    URL.revokeObjectURL(url);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[700px] max-h-[80vh] overflow-auto shadow-lg relative">
        <button onClick={onFechar} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
          <FaTimes size={18} />
        </button>
        <h2 className="text-xl font-bold mb-4">Anexos</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {anexos.map((anexo) => {
            const ext = getExt(anexo.nomeArquivo);

            return (
              <div key={anexo.idAnexo} className="border rounded p-2 shadow-sm relative">
                <div className="w-full h-32 mb-2 flex items-center justify-center rounded bg-gray-100">
                  {isImagem(ext) ? (
                    <img src={`data:;base64,${anexo.caminho}`} alt={anexo.nomeArquivo} className="object-cover h-full w-full rounded" />
                  ) : isPDF(ext) ? (
                    <span className="text-blue-600 font-semibold">📄 PDF</span>
                  ) : isWord(ext) ? (
                    <span className="text-purple-600 font-semibold">📄 Word</span>
                  ) : isExcel(ext) ? (
                    <span className="text-green-600 font-semibold">📊 Excel</span>
                  ) : (
                    <span className="text-gray-500">📎 Arquivo</span>
                  )}
                </div>

                <p className="text-sm truncate mb-1">{anexo.nomeArquivo}</p>
                <p className="text-xs text-gray-500 mb-1">
                  Tipo: {anexo.tipoExtratoAnexo?.toUpperCase() || getExt(anexo.nomeArquivo).toUpperCase()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => anexo.arquivo?.data && downloadBuffer(anexo.arquivo.data, anexo.nomeArquivo)}
                    className="bg-blue-600 text-white flex-1 py-1 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <FaDownload /> Baixar
                  </button>

                  <button
                    onClick={() => handleDelete(anexo.idAnexo)}
                    className="bg-red-600 text-white flex-1 py-1 rounded text-sm hover:bg-red-700"
                    disabled={removendoId === anexo.idAnexo}
                  >
                    {removendoId === anexo.idAnexo ? "Removendo..." : "Deletar"}
                  </button>
                </div>
              </div>
            );
          })}

          {previewFile ? (
            <div className="border rounded p-2 shadow-sm flex flex-col items-center justify-between">
              <div className="w-full h-32 mb-2 flex items-center justify-center rounded bg-gray-100">
                {isImagem(previewFile.name) ? (
                  <img src={previewURL ?? ""} alt="preview" className="object-cover h-full w-full rounded" />
                ) : isPDF(previewFile.name) ? (
                  <span className="text-blue-600 font-semibold">📄 PDF</span>
                ) : isWord(previewFile.name) ? (
                  <span className="text-purple-600 font-semibold">📄 Word</span>
                ) : isExcel(previewFile.name) ? (
                  <span className="text-green-600 font-semibold">📊 Excel</span>
                ) : (
                  <span className="text-gray-500">📎 Arquivo</span>
                )}
              </div>
              <p className="text-sm truncate mb-2">{previewFile.name}</p>

              <select
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value)}
                className="w-full mb-2 px-2 py-1 border rounded"
              >
                {tiposDisponiveis.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>

              <div className="flex w-full gap-2">
                <button
                  onClick={handleUpload}
                  className="bg-green-600 text-white flex-1 py-1 rounded text-sm hover:bg-green-700"
                  disabled={uploading}
                >
                  {uploading ? "Enviando..." : "Fazer upload"}
                </button>
                <button
                  onClick={() => {
                    URL.revokeObjectURL(previewURL ?? "");
                    setPreviewFile(null);
                    setPreviewURL(null);
                  }}
                  className="bg-gray-300 text-black flex-1 py-1 rounded text-sm hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-gray-400 hover:border-blue-500 cursor-pointer rounded flex flex-col items-center justify-center p-6 text-gray-600 hover:text-blue-600 transition"
            >
              <FaPlus size={24} />
              <p className="text-sm mt-2">Adicionar Anexo</p>
              <input
                type="file"
                hidden
                ref={inputRef}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Anexos;