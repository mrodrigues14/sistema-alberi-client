"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExtratoAnexo, deleteExtratoAnexo, createExtratoAnexo, uploadExtratoAnexo } from "@/lib/hooks/useExtratoAnexos";
import { FaTrash, FaTimes, FaPlus } from "react-icons/fa";

interface Props {
  anexos: ExtratoAnexo[];
  onFechar: () => void;
  onAtualizar?: () => void;
  idExtrato?: number;
}

const Anexos: React.FC<Props> = ({ anexos, onFechar, onAtualizar, idExtrato }) => {
  const [removendoId, setRemovendoId] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
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
    console.log("Upload iniciado. idExtrato:", idExtrato);

    try {
      await uploadExtratoAnexo({
        file: previewFile,
        idExtrato,
        tipoExtratoAnexo: getExt(previewFile.name),
      });
  
      setPreviewFile(null);
      setPreviewURL(null);
      onAtualizar?.();
    } catch (error) {
      console.error("Erro ao enviar anexo:", error);
      alert("Erro ao enviar anexo.");
    }
  };
  

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
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
                <p className="text-xs text-gray-500 mb-2">
                  Tipo: {anexo.tipoExtratoAnexo?.toUpperCase() || getExt(anexo.nomeArquivo).toUpperCase()}
                </p>

                <button
                  onClick={() => handleDelete(anexo.idAnexo)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 w-full"
                  disabled={removendoId === anexo.idAnexo}
                >
                  {removendoId === anexo.idAnexo ? "Removendo..." : "Deletar"}
                </button>
              </div>
            );
          })}

          {/* Área de pré-visualização + upload */}
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
              <div className="flex w-full gap-2">
                <button
                  onClick={handleUpload}
                  className="bg-green-600 text-white flex-1 py-1 rounded text-sm hover:bg-green-700"
                >
                  Fazer upload
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
