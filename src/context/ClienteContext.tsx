"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ClienteContextProps {
  idCliente: number | null;
  setIdCliente: (id: number | null) => void;
}

const ClienteContext = createContext<ClienteContextProps | undefined>(undefined);

export const ClienteProvider = ({ children }: { children: React.ReactNode }) => {
  const [idCliente, setIdCliente] = useState<number | null>(null);

  useEffect(() => {
    const savedCliente = sessionStorage.getItem("selectedCliente");
    if (savedCliente) {
      const cliente = JSON.parse(savedCliente);
      setIdCliente(cliente.id);
    }
  }, []);

  return (
    <ClienteContext.Provider value={{ idCliente, setIdCliente }}>
      {children}
    </ClienteContext.Provider>
  );
};

export const useClienteContext = () => {
  const context = useContext(ClienteContext);
  if (!context) {
    throw new Error("useClienteContext deve ser usado dentro de um ClienteProvider");
  }
  return context;
};
