"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { FaPlus, FaEdit, FaCheck, FaTimes, FaBan } from "react-icons/fa";
import ModalCliente from "./modalCliente/ModalCliente";
import { createCliente, updateCliente, useCliente, useClientesInativos } from "@/lib/hooks/useCliente";
import { Cliente } from "../../../types/Cliente";
import styles from './page.module.css';

export default function ConfiguracaoCliente() {
  const { clientes: clientesAtivos, isLoading, isError, mutate } = useCliente();
  const { clientes: clientesInativos, mutate: mutateInativos } = useClientesInativos();
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Debug: verificar se o componente está funcionando
  console.log("ConfiguracaoCliente renderizado:", {
    isLoading,
    isError,
    clientesAtivos: clientesAtivos?.length,
    clientesInativos: clientesInativos?.length,
    modalOpen
  });

  const handleSalvarCliente = async (cliente: Cliente) => {
    if (clienteEditando) {
      await updateCliente(cliente.idcliente, cliente);
    } else {
      await createCliente(cliente);
    }

    await mutate();
    await mutateInativos();
    setModalOpen(false);
    setClienteEditando(null);
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
              <h1 className={styles.title}>Configuração de Cliente</h1>
            </div>
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingContent}>
                <div className={styles.spinner}></div>
                <p>Carregando clientes...</p>
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
        <div className="fixed top-0 left-0 w-full z-10">
          <Navbar />
        </div>
        <div className={styles.container}>
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <h1 className={styles.title}>Configuração de Cliente</h1>
            </div>
            <div className={styles.loadingOverlay}>
              <div className={styles.errorContent}>
                <div className={styles.errorIcon}>❌</div>
                <h2 className={styles.errorTitle}>Erro ao carregar clientes</h2>
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
      <div className=" top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1 className={styles.title}>Configuração de Cliente</h1>
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={() => {
                console.log("Botão clicado - abrindo modal");
                setClienteEditando(null);
                setModalOpen(true);
              }}
              className={styles.addButton}
            >
              <FaPlus /> Adicionar Novo Cliente
            </button>
          </div>

          <div className={styles.grid}>
            {/* Clientes Ativos */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                Clientes Ativos
              </div>
              <div className={styles.cardBody}>
                {clientesAtivos.map((cliente: Cliente) => (
                  <div
                    key={cliente.idcliente}
                    className={styles.clientItem}
                  >
                    <span className={styles.clientName}>{cliente.nome}</span>
                    <div className={styles.clientActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setClienteEditando(cliente);
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
                          disabled={loadingId === cliente.idcliente}
                          onClick={async () => {
                            setLoadingId(cliente.idcliente);
                            await updateCliente(cliente.idcliente, { ativo: 0 });
                            await mutate();
                            await mutateInativos();
                            setLoadingId(null);
                          }}
                        >
                          <FaBan /> {loadingId === cliente.idcliente ? "Aguarde..." : "Inativar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clientes Inativos */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                Clientes Inativos
              </div>
              <div className={styles.cardBody}>
                {clientesInativos.map((cliente: Cliente) => (
                  <div
                    key={cliente.idcliente}
                    className={styles.clientItem}
                  >
                    <span className={styles.clientName}>{cliente.nome}</span>
                    <div className={styles.clientActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => {
                          setClienteEditando(cliente);
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
                          disabled={loadingId === cliente.idcliente}
                          onClick={async () => {
                            setLoadingId(cliente.idcliente);
                            await updateCliente(cliente.idcliente, { ativo: 1 });
                            await mutate();
                            await mutateInativos();
                            setLoadingId(null);
                          }}
                        >
                          <FaCheck /> {loadingId === cliente.idcliente ? "Aguarde..." : "Ativar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ModalCliente
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setClienteEditando(null);
            }}
            onSave={handleSalvarCliente}
            cliente={clienteEditando}
          />
        </div>
      </div>
    </>
  );
}
