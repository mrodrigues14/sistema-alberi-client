"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Banco } from "@/lib/hooks/userBanco";

interface BancoContextType {
  bancoSelecionado: number | null;
  nomeBancoSelecionado: string | null;
  setBancoSelecionado: (id: number | null) => void;
  setNomeBancoSelecionado: (nome: string | null) => void;
}

const BancoContext = createContext<BancoContextType | undefined>(undefined);

export const BancoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bancoSelecionado, setBancoSelecionadoState] = useState<number | null>(null);
  const [nomeBancoSelecionado, setNomeBancoSelecionadoState] = useState<string | null>(null);

  useEffect(() => {
    const storedBanco = sessionStorage.getItem("bancoSelecionado");
    const storedNome = sessionStorage.getItem("nomeBancoSelecionado");

    if (storedBanco) setBancoSelecionadoState(Number(storedBanco));
    if (storedNome) setNomeBancoSelecionadoState(storedNome);
  }, []);

  const setBancoSelecionado = (id: number | null) => {
    setBancoSelecionadoState(id);
    if (id !== null) sessionStorage.setItem("bancoSelecionado", String(id));
  };

  const setNomeBancoSelecionado = (nome: string | null) => {
    setNomeBancoSelecionadoState(nome);
    if (nome !== null) sessionStorage.setItem("nomeBancoSelecionado", nome);
  };

  return (
    <BancoContext.Provider
      value={{
        bancoSelecionado,
        nomeBancoSelecionado,
        setBancoSelecionado,
        setNomeBancoSelecionado,
      }}
    >
      {children}
    </BancoContext.Provider>
  );
};

export const useBancoContext = () => {
  const context = useContext(BancoContext);
  if (!context) {
    throw new Error("useBancoContext must be used within a BancoProvider");
  }
  return context;
};
