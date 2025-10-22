"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExtratoAnexo, deleteExtratoAnexo, uploadExtratoAnexo, getExtratoAnexo } from "@/lib/hooks/useExtratoAnexos";
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
  const [loadingPreviewId, setLoadingPreviewId] = useState<number | null>(null);
  const [previews, setPreviews] = useState<Record<number, string>>({}); // idAnexo -> objectURL
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

  const ensurePreview = async (anexo: ExtratoAnexo) => {
    if (previews[anexo.idAnexo]) return; // already loaded
    try {
      setLoadingPreviewId(anexo.idAnexo);
      // Try to use existing buffer; if not present, fetch
      let data = anexo.arquivo?.data as number[] | undefined;
      let nome = anexo.nomeArquivo;
      if (!data) {
        const full = await getExtratoAnexo(anexo.idAnexo);
        data = full.arquivo?.data as number[] | undefined;
        nome = full.nomeArquivo || nome;
      }
      if (!data) return;
      // Create object URL
      const ext = nome.split(".").pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        pdf: "application/pdf",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        bmp: "image/bmp",
        webp: "image/webp",
      };
      const mime = mimeTypes[ext || ""] || "application/octet-stream";
      const blob = new Blob([new Uint8Array(data)], { type: mime });
      const url = URL.createObjectURL(blob);
      setPreviews(prev => ({ ...prev, [anexo.idAnexo]: url }));
    } finally {
      setLoadingPreviewId(null);
    }
  };


  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(6px)' }}>
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
                <div className="w-full h-32 mb-2 flex items-center justify-center rounded bg-gray-100 overflow-hidden">
                  {isImagem(ext) && previews[anexo.idAnexo] ? (
                    // Show loaded preview
                    <Image
                      src={previews[anexo.idAnexo]}
                      alt={anexo.nomeArquivo}
                      className="object-cover h-full w-full rounded"
                      width={200}
                      height={128}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                      <span className="text-2xl">📎</span>
                      <span className="mt-1 uppercase">{ext || "ARQ"}</span>
                      {isImagem(ext) && (
                        <button
                          onClick={() => ensurePreview(anexo)}
                          className="mt-2 px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          disabled={loadingPreviewId === anexo.idAnexo}
                        >
                          {loadingPreviewId === anexo.idAnexo ? "Carregando…" : "Pré-visualizar"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-sm truncate mb-1">{anexo.nomeArquivo}</p>
                <p className="text-xs text-gray-500 mb-1">
                  Tipo: {anexo.tipoExtratoAnexo?.toUpperCase() || getExt(anexo.nomeArquivo).toUpperCase()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (anexo.arquivo?.data) {
                        downloadBuffer(anexo.arquivo.data, anexo.nomeArquivo);
                        return;
                      }
                      try {
                        const full = await getExtratoAnexo(anexo.idAnexo);
                        const data = full.arquivo?.data;
                        if (data) downloadBuffer(data, full.nomeArquivo || anexo.nomeArquivo);
                        else alert("Arquivo indisponível para download.");
                      } catch (e) {
                        console.error(e);
                        alert("Erro ao baixar anexo.");
                      }
                    }}
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
                  <Image 
                    src={previewURL ?? ""} 
                    alt="preview" 
                    className="object-cover h-full w-full rounded"
                    width={200}
                    height={128}
                  />
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