"use client"
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo: string, anexo: File | null) => void;
}

export default function ModalRecusa({ open, onClose, onConfirm }: Props) {
  const [motivo, setMotivo] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setMotivo("");
      setFile(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-semibold mb-4">Motivo da Recusa</h2>

        <textarea
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Descreva o motivo da recusa..."
          rows={4}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.mp4,.webm,.ogg,.xlxs,.ods"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onConfirm(motivo, file)}
            disabled={!motivo.trim()}
          >
            Confirmar Recusa
          </button>
        </div>
      </div>
    </div>
  );
}
