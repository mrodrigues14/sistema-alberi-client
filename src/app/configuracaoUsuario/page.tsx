"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes, FaBan } from "react-icons/fa";
import {
  useUsuarios,
  createUsuario,
  updateUsuario,
} from "@/lib/hooks/useUsuarios";
import ModalUsuario from "./modalUsuario/modalUsuario";
import { Usuario } from "../../../types/Usuario";

export default function ConfiguracaoUsuario() {
  const { usuarios, isLoading, isError, mutateUsuarios } = useUsuarios();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleSalvarUsuario = async (usuario: Usuario) => {
    if (usuarioEditando) {
      await updateUsuario(usuario.idusuarios, usuario);
    } else {
      await createUsuario(usuario);
    }

    await mutateUsuarios();
    setModalOpen(false);
    setUsuarioEditando(null);
  };

  if (isLoading) return <p className="p-4">Carregando usuários...</p>;
  if (isError) return <p className="p-4 text-red-600">Erro ao carregar usuários.</p>;
  console.log(usuarios);
  const usuariosAtivos = usuarios.filter((u) => u.ativo !== 0);
  const usuariosInativos = usuarios.filter((u) => u.ativo === 0);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-xl font-bold mb-4 text-center">Gerenciar Usuários</h1>

        <div className="mb-6 flex justify-center">
          <button
            onClick={() => {
              setUsuarioEditando(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus /> Adicionar Novo Usuário
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Ativos */}
          <div className="bg-white shadow-md rounded-lg border">
            <h2 className="text-lg font-semibold px-4 pt-4 pb-2 border-b">Usuários Ativos</h2>
            {usuariosAtivos.map((usuario) => (
              <div
                key={usuario.idusuarios}
                className="flex items-center justify-between px-4 py-3 border-b last:border-none"
              >
                <span className="font-medium text-gray-800">{usuario.nomeDoUsuario}</span>
                <div className="flex items-center gap-4">
                  <button
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => {
                      setUsuarioEditando(usuario);
                      setModalOpen(true);
                    }}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <FaCheck className="text-green-600" />
                    <button
                      className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center gap-1"
                      disabled={loadingId === usuario.idusuarios}
                      onClick={async () => {
                        setLoadingId(usuario.idusuarios);
                        await updateUsuario(usuario.idusuarios, { ...usuario, ativo: false });
                        await mutateUsuarios();
                        setLoadingId(null);
                      }}
                    >
                      <FaBan /> {loadingId === usuario.idusuarios ? "Aguarde..." : "Inativar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Inativos */}
          <div className="bg-white shadow-md rounded-lg border">
            <h2 className="text-lg font-semibold px-4 pt-4 pb-2 border-b">Usuários Inativos</h2>
            {usuariosInativos.map((usuario) => (
              <div
                key={usuario.idusuarios}
                className="flex items-center justify-between px-4 py-3 border-b last:border-none"
              >
                <span className="font-medium text-gray-800">{usuario.nomeDoUsuario}</span>
                <div className="flex items-center gap-4">
                  <button
                    className="text-orange-500 hover:text-orange-600"
                    onClick={() => {
                      setUsuarioEditando(usuario);
                      setModalOpen(true);
                    }}
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <FaTimes className="text-red-500" />
                    <button
                      className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                      disabled={loadingId === usuario.idusuarios}
                      onClick={async () => {
                        setLoadingId(usuario.idusuarios);
                        await updateUsuario(usuario.idusuarios, { ...usuario, ativo: true });
                        await mutateUsuarios();
                        setLoadingId(null);
                      }}
                    >
                      <FaCheck /> {loadingId === usuario.idusuarios ? "Aguarde..." : "Ativar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ModalUsuario
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setUsuarioEditando(null);
          }}
          onSave={handleSalvarUsuario}
          usuario={usuarioEditando}
        />
      </div>
    </div>
  );
}
