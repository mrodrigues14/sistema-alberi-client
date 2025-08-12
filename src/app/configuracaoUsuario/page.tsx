"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes, FaBan } from "react-icons/fa";
import {
  useUsuarios,
  createUsuario,
  updateUsuario,
  useUsuariosInativos,
} from "@/lib/hooks/useUsuarios";
import ModalUsuario from "./modalUsuario/modalUsuario";
import { Usuario } from "../../../types/Usuario";
import styles from './page.module.css';

export default function ConfiguracaoUsuario() {
  const { usuarios: usuariosAtivos, isLoading, isError, mutateUsuarios } = useUsuarios();
  const { usuarios: usuariosInativos, mutateUsuarios: mutateInativos } = useUsuariosInativos();

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
    await mutateInativos();
    setModalOpen(false);
    setUsuarioEditando(null);
  };

  if (isLoading) {
    return (
      <>
        <div>
          <Navbar />
        </div>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <h1 className={styles.title}>Configuração de Usuário</h1>
            </div>
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingContent}>
                <div className={styles.spinner}></div>
                <p>Carregando usuários...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (isError) {
    return (
      <>
        <div>
          <Navbar />
        </div>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <h1 className={styles.title}>Configuração de Usuário</h1>
            </div>
            <div className={styles.loadingOverlay}>
              <div className={styles.errorContent}>
                <div className={styles.errorIcon}>❌</div>
                <h2 className={styles.errorTitle}>Erro ao carregar usuários</h2>
                <p className={styles.errorMessage}>Tente recarregar a página</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Configuração de Usuário</h1>
            <button
              onClick={() => {
                setUsuarioEditando(null);
                setModalOpen(true);
              }}
              className={styles.addButton}
            >
              <FaPlus /> Adicionar Novo Usuário
            </button>
          </div>

          <div className={styles.grid}>
            {/* Usuários Ativos */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                Usuários Ativos
              </div>
              <div className={styles.cardBody}>
                {usuariosAtivos.map((usuario) => (
                  <div
                    key={usuario.idusuarios}
                    className={styles.userItem}
                  >
                    <span className={styles.userName}>{usuario.nomeDoUsuario}</span>
                    <div className={styles.userActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setUsuarioEditando(usuario);
                          setModalOpen(true);
                        }}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <div className={styles.statusSection}>
                        <span className={styles.statusLabel}>Status:</span>
                        <FaCheck className={`${styles.statusIcon} ${styles.active}`} />
                        <button
                          className={`${styles.actionButton} ${styles.deactivateButton}`}
                          disabled={loadingId === usuario.idusuarios}
                          onClick={async () => {
                            setLoadingId(usuario.idusuarios);
                            await updateUsuario(usuario.idusuarios, { ...usuario, ativo: false });
                            await mutateUsuarios();
                            await mutateInativos();
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
            </div>

            {/* Usuários Inativos */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                Usuários Inativos
              </div>
              <div className={styles.cardBody}>
                {usuariosInativos.map((usuario) => (
                  <div
                    key={usuario.idusuarios}
                    className={styles.userItem}
                  >
                    <span className={styles.userName}>{usuario.nomeDoUsuario}</span>
                    <div className={styles.userActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setUsuarioEditando(usuario);
                          setModalOpen(true);
                        }}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <div className={styles.statusSection}>
                        <span className={styles.statusLabel}>Status:</span>
                        <FaTimes className={`${styles.statusIcon} ${styles.inactive}`} />
                        <button
                          className={`${styles.actionButton} ${styles.activateButton}`}
                          disabled={loadingId === usuario.idusuarios}
                          onClick={async () => {
                            setLoadingId(usuario.idusuarios);
                            await updateUsuario(usuario.idusuarios, { ...usuario, ativo: true });
                            await mutateUsuarios();
                            await mutateInativos();
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
    </>
  );
}
