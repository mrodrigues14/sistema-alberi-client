"use client";

import React, { useMemo, useState } from "react";

export type ClienteItem = { idcliente: number; apelido?: string | null; nome: string };

interface Props {
  userRole?: string | null;
  viewMode: "todos" | "meus";
  setViewMode: (m: "todos" | "meus") => void;
  rolesLimitados?: string[];
  clientesAll: ClienteItem[];
  meusClientes: ClienteItem[];
  onSelectCliente: (c: ClienteItem) => void;
  onSelectTodos: () => void;
  onSelectMeus: () => void;
  compact?: boolean; // estilização mais compacta (para dropdown)
}

export default function ClienteSelectorPanel({
  userRole,
  viewMode,
  setViewMode,
  rolesLimitados = ['usuario interno (restrito)', 'usuario externo (consulta)', 'usuario externo (financeiro)'],
  clientesAll,
  meusClientes,
  onSelectCliente,
  onSelectTodos,
  onSelectMeus,
  compact = false,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const sortedClientes = useMemo(() => {
    const list = [...clientesAll];
    return list.sort((a, b) => {
      if (a.idcliente === 68) return -1;
      if (b.idcliente === 68) return 1;
      return (a.apelido || a.nome).localeCompare(b.apelido || b.nome);
    });
  }, [clientesAll]);

  const clientesParaMostrar = useMemo(() => {
    if (rolesLimitados.includes(userRole || "")) return meusClientes;
    return viewMode === "meus" ? meusClientes : sortedClientes;
  }, [rolesLimitados, userRole, viewMode, meusClientes, sortedClientes]);

  const filteredClientes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (clientesParaMostrar || []).filter(c => (c.apelido || c.nome).toLowerCase().includes(q));
  }, [clientesParaMostrar, searchQuery]);

  const buttonBase = compact
    ? "px-3 py-2 text-sm"
    : "px-3 py-2 text-sm";

  return (
    <div className={compact ? "w-80" : "w-full"}>
      {/* Filtros */}
      {!rolesLimitados.includes(userRole || "") && (
        <div className={compact ? "bg-gradient-to-r from-slate-50 to-slate-100/50 p-3 border-b border-slate-200/40" : "mb-3"}>
          <div className="flex gap-2">
            <button
              className={`flex-1 ${buttonBase} font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'todos' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm border border-slate-200'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setViewMode('todos');
                onSelectTodos();
              }}
            >
              Todos os Clientes
            </button>
            <button
              className={`flex-1 ${buttonBase} font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'meus' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm border border-slate-200'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setViewMode('meus');
                onSelectMeus();
              }}
            >
              {['usuario interno (restrito)', 'usuario externo (consulta)', 'usuario externo (financeiro)'].includes(userRole || '') ? 'Minhas Empresas' : 'Meus Clientes'}
            </button>
          </div>
        </div>
      )}

      {/* Busca */}
      <div className={compact ? "p-3 border-b border-slate-200/40" : "mb-3"}>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Pesquisar empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Lista */}
      <div className={compact ? "max-h-64 overflow-y-auto" : "max-h-80 overflow-y-auto border border-slate-200 rounded-xl"}>
        {filteredClientes.length > 0 ? (
          filteredClientes.map((cliente) => (
            <button
              key={cliente.idcliente}
              className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0"
              onClick={(e) => {
                e.preventDefault();
                onSelectCliente(cliente);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{cliente.apelido || cliente.nome}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-slate-500">
            <svg className="mx-auto w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm">Nenhuma empresa encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
