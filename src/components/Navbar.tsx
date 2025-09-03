'use client';

import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCliente } from "@/lib/hooks/useCliente";
import { useMeusClientes } from "@/lib/hooks/useMeusClientes";
import { useClienteContext } from "@/context/ClienteContext";
import { usePermissions } from "@/lib/hooks/usePermissions";
import Image from 'next/image';
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// Ícones SVG inline para melhor performance
const Icons = {
  tasks: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  studies: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  bank: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  client: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  user: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  bug: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  asaas: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  contract: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  category: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  supplier: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  balance: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  chevronDown: () => (
    <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export interface Cliente {
  idcliente: number;
  cnpj: string | null;
  cpf: string | null;
  telefone: string | null;
  nome: string;
  endereco: string | null;
  cep: string | null;
  nome_responsavel: string | null;
  cpf_responsavel: string | null;
  inscricao_estadual: string | null;
  cnae_principal: string | null;
  apelido?: string;
  email: string | null;
  ativo: boolean;
  socio: any[];
}

export default function Navbar() {
  const { data: session } = useSession();
  const { clientes, isLoading, isError } = useCliente();
  const { meusClientes, isLoading: isLoadingMeusClientes } = useMeusClientes();
  const { userNavigation, userRole, getRoleDescription } = usePermissions();
  const [usuario, setUsuario] = useState('Carregando...');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'todos' | 'meus'>('todos'); // Estado para controlar o modo de visualização
  const clienteDropdownRef = useRef<HTMLDivElement | null>(null);
  const usuarioDropdownRef = useRef<HTMLDivElement | null>(null);
  const { idCliente, setIdCliente } = useClienteContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<{ id: number, nome: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (session?.user?.name) {
      setUsuario(session.user.name);
    } else {
      setUsuario('Usuário não autenticado');
    }

    const savedCliente = sessionStorage.getItem("selectedCliente");
    const savedViewMode = sessionStorage.getItem("viewMode") as 'todos' | 'meus' || 'todos';
    
    if (savedCliente) {
      setSelectedCliente(JSON.parse(savedCliente));
    }
    setViewMode(savedViewMode);
  }, [session]);

  useEffect(() => {
    const savedCliente = sessionStorage.getItem("selectedCliente");
    if (clientes?.length > 0 && savedCliente && !selectedCliente) {
      setSelectedCliente(JSON.parse(savedCliente));
    }
  }, [clientes, selectedCliente]);



  // Ordenar clientes alfabeticamente e garantir "Todos Clientes Vinculados ao Perfil!" como primeiro
  const sortedClientes = clientes?.slice().sort((a: Cliente, b: Cliente) => {
    if (a.idcliente === 68) return -1; // "Todos Clientes" sempre primeiro
    if (b.idcliente === 68) return 1;
    return (a.apelido || a.nome).localeCompare(b.apelido || b.nome);
  }) || [];

  // Decidir quais clientes mostrar baseado no modo de visualização
  const clientesParaMostrar = viewMode === 'meus' ? meusClientes : sortedClientes;

  // Filtrar clientes conforme a pesquisa
  const filteredClientes = clientesParaMostrar.filter((cliente: Cliente) =>
    (cliente.apelido || cliente.nome).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (dropdownName: string) => {
    setShowDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };


  const handleClienteSelect = (cliente: Cliente) => {
    const clienteNome = cliente.apelido || cliente.nome;

    setSelectedCliente({ id: cliente.idcliente, nome: clienteNome });
    sessionStorage.setItem("selectedCliente", JSON.stringify({ id: cliente.idcliente, nome: clienteNome }));
    setIdCliente(cliente.idcliente);
    setShowDropdown(null); // Fecha apenas quando um cliente é selecionado
  };

  const handleMeusClientesSelect = () => {
    // Define um ID especial para "Meus Clientes" (pode ser -1 ou outro valor especial)
    const meusClientesId = -1;
    const meusClientesNome = "Meus Clientes";

    setSelectedCliente({ id: meusClientesId, nome: meusClientesNome });
    sessionStorage.setItem("selectedCliente", JSON.stringify({ id: meusClientesId, nome: meusClientesNome }));
    setIdCliente(meusClientesId);
    setViewMode('meus');
    sessionStorage.setItem("viewMode", 'meus');
    setSearchQuery(''); // Limpa a pesquisa ao trocar o modo
    setShowDropdown(null); // Fecha apenas quando uma ação é executada
  };

  const handleTodosClientesSelect = () => {
    const todosClientesId = 68;
    const todosClientesNome = "Todos Clientes";
    
    setSelectedCliente({ id: todosClientesId, nome: todosClientesNome });
    sessionStorage.setItem("selectedCliente", JSON.stringify({ id: todosClientesId, nome: todosClientesNome }));
    setIdCliente(todosClientesId);
    setViewMode('todos');
    sessionStorage.setItem("viewMode", 'todos');
    setSearchQuery('');
    setShowDropdown(null); // Fecha apenas quando uma ação é executada
  };

  useEffect(() => {
    if (idCliente && clientes?.length > 0) {
      const clienteEncontrado = clientes.find((c: { idcliente: number; }) => c.idcliente === idCliente);
      const novoNome = clienteEncontrado?.apelido || clienteEncontrado?.nome;
      if (clienteEncontrado && (selectedCliente?.id !== idCliente || selectedCliente?.nome !== novoNome)) {
        setSelectedCliente({ id: idCliente, nome: novoNome });
      }
    }
  }, [idCliente, clientes, selectedCliente?.id, selectedCliente?.nome]);

  // Removido o useEffect que detectava cliques fora - estava causando problemas
  
  return (
    <>
      {/* Navbar principal - Logo + Controles do usuário */}
      <nav className={`bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 shadow-lg backdrop-blur-sm ${font.className} z-50 sticky top-0`}>
        <div className="w-full px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Nome da Empresa */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <Link href="/home" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Image
                    src="/icone_imagem.png"
                    alt="Alberi"
                    width={50}
                    height={50}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Alberi Consult
                  </h1>
                  <p className="text-xs text-slate-500">Sistema de Gestão</p>
                </div>
              </Link>
            </div>

            {/* Lado direito: Cliente + Usuário */}
            <div className="flex items-center space-x-3">
              {/* Cliente - Visível apenas no desktop */}
              <div className="relative hidden md:block" ref={clienteDropdownRef}>
                <button
                  onClick={() => toggleDropdown('cliente')}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 shadow-sm w-56 text-left"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="truncate">
                    {selectedCliente ? 
                      `${selectedCliente.nome}` : 
                      'Selecionar Cliente'
                    }
                  </span>
                  <Icons.chevronDown />
                </button>
                {showDropdown === 'cliente' && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {/* Opções de filtro */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-3 border-b border-slate-200/40">
                      <div className="flex space-x-2">
                        <button
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            viewMode === 'todos' 
                              ? 'bg-blue-500 text-white shadow-md' 
                              : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTodosClientesSelect();
                          }}
                        >
                          Todos os Clientes
                        </button>
                        <button
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            viewMode === 'meus' 
                              ? 'bg-blue-500 text-white shadow-md' 
                              : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMeusClientesSelect();
                          }}
                        >
                          Meus Clientes
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 border-b border-slate-200/40">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-2 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="🔍 Pesquisar cliente..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onFocus={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {filteredClientes.map((cliente: Cliente) => (
                        <button
                          key={cliente.idcliente}
                          className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleClienteSelect(cliente);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium">{cliente.apelido || cliente.nome}</span>
                          </div>
                        </button>
                      ))}
                      {filteredClientes.length === 0 && (
                        <div className="px-4 py-8 text-center text-slate-500">
                          <svg className="mx-auto w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-sm">
                            {viewMode === 'meus' ? 'Nenhum cliente vinculado encontrado' : 'Nenhum cliente encontrado'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Usuário - Visível apenas no desktop */}
              <div className="relative hidden md:block" ref={usuarioDropdownRef}>
                <button
                  onClick={() => toggleDropdown("usuario")}
                  className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-slate-700 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 hover:shadow-lg transition-all duration-300 shadow-md w-48 text-left rounded-xl"
                >
                  <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md aspect-square">
                    {usuario.split(' ').length > 1 
                      ? `${usuario.split(' ')[0].charAt(0)}${usuario.split(' ')[1].charAt(0)}`
                      : usuario.charAt(0)
                    }
                  </div>
                  <span className="truncate">{usuario}</span>
                  <Icons.chevronDown />
                </button>
                {showDropdown === "usuario" && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl z-20 overflow-hidden">
                    {/* Informações do role */}
                    {userRole && (
                      <div className="px-4 py-3 border-b border-slate-200/40 bg-gradient-to-r from-slate-50 to-slate-100/50">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs font-medium text-slate-600">
                            {getRoleDescription()}
                          </span>
                        </div>
                      </div>
                    )}
                    <button
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150 flex items-center space-x-3"
                      onMouseDown={async (e) => {
                        e.preventDefault();
                        sessionStorage.removeItem("selectedCliente");
                        localStorage.clear();
                        setIdCliente(null);
                        await signOut({ callbackUrl: "/" });
                      }}
                    >
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Botão menu mobile */}
              <button
                className="md:hidden p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <Icons.close /> : <Icons.menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Submenu de navegação - Todos os links (oculto no mobile) */}
      {pathname !== '/' && (
        <div className="hidden md:block bg-white border-b border-slate-200/60 shadow-sm">
          <div className="w-full px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-center space-x-3 py-3">
              {/* Renderiza apenas os itens de navegação que o usuário pode acessar */}
              {userNavigation.map((item) => {
                // Se for o item de estudos, renderiza com dropdown
                if (item.href === '/estudos') {
                  return (
                    <div key={item.href} className="relative">
                      <button
                        onClick={() => toggleDropdown('estudos')}
                        className={`group flex items-center space-x-3 px-4 py-2.5 text-sm font-medium backdrop-blur-sm border-2 rounded-xl transition-all duration-300 shadow-md hover:scale-105 ${
                          pathname.startsWith('/estudos')
                            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg'
                            : 'text-slate-700 bg-white/90 border-slate-200/60 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 hover:text-slate-800 hover:border-slate-300 hover:shadow-lg'
                        }`}
                      >
                        {getIconComponent(item.icon)()}
                        <span>{item.label}</span>
                        <Icons.chevronDown />
                      </button>
                      {showDropdown === 'estudos' && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border-2 border-slate-200/60 rounded-2xl shadow-xl z-50 overflow-hidden">
                          <div className="p-2">
                            {[
                              { href: '/estudos/resumoMensal', label: 'Resumo Mensal', icon: '📊' },
                              { href: '/estudos/resumo-financeiro', label: 'Resumo Financeiro', icon: '💰' },
                              { href: '/estudos/resumo-anual', label: 'Resumo Anual', icon: '📈' },
                              { href: '/estudos/resumo-faturamento', label: 'Resumo Faturamento Mensal', icon: '📋' },
                              { href: '/estudos/resumo-conta', label: 'Resumo da Conta', icon: '🏦' },
                              { href: '/estudos/metas', label: 'Metas', icon: '🎯' },
                            ].map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-colors duration-150 ${
                                  pathname === subItem.href
                                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white'
                                    : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100'
                                }`}
                              >
                                <span className="font-medium">{subItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Para outros itens, renderiza como link normal
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center space-x-3 px-4 py-2.5 text-sm font-medium backdrop-blur-sm border-2 rounded-xl transition-all duration-300 shadow-md hover:scale-105 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white border-slate-600 shadow-lg'
                        : 'text-slate-700 bg-white/90 border-slate-200/60 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 hover:text-slate-800 hover:border-slate-300 hover:shadow-lg'
                    }`}
                  >
                    {getIconComponent(item.icon)()}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Menu mobile expandido */}
  <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-lg p-4 mt-4 mx-auto max-w-[94%]`}>
        {/* Seleção de Cliente - Mobile */}
        <div className="relative mb-4" ref={clienteDropdownRef}>
          <button
            onClick={() => toggleDropdown('cliente')}
            className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-sm w-full"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="font-medium">
              {selectedCliente ? 
                `${selectedCliente.nome.length > 20 ? selectedCliente.nome.substring(0, 20) + '...' : selectedCliente.nome}` : 
                'Selecionar Cliente'
              }
            </span>
            <Icons.chevronDown />
          </button>
          {showDropdown === 'cliente' && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl z-50 overflow-hidden">
              {/* Opções de filtro */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-3 border-b border-slate-200/40">
                <div className="flex space-x-2">
                  <button
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      viewMode === 'todos' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTodosClientesSelect();
                    }}
                  >
                    Todos os Clientes
                  </button>
                  <button
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      viewMode === 'meus' 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMeusClientesSelect();
                    }}
                  >
                    Meus Clientes
                  </button>
                </div>
              </div>
              
              <div className="p-3 border-b border-slate-200/40">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 pl-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="🔍 Pesquisar cliente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onFocus={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                {filteredClientes.map((cliente: Cliente) => (
                  <button
                    key={cliente.idcliente}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClienteSelect(cliente);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">{cliente.apelido || cliente.nome}</span>
                    </div>
                  </button>
                ))}
                {filteredClientes.length === 0 && (
                  <div className="px-4 py-8 text-center text-slate-500">
                    <svg className="mx-auto w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm">
                      {viewMode === 'meus' ? 'Nenhum cliente vinculado encontrado' : 'Nenhum cliente encontrado'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nome do usuário e role - Mobile */}
        <div className="px-4 py-3 text-sm text-slate-600 border-b border-slate-200/60 mb-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {usuario.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-slate-800">Usuário:</span>
              <p className="text-slate-700">{usuario}</p>
              {userRole && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">{getRoleDescription()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div className="space-y-3">
          {/* Renderiza apenas os itens de navegação que o usuário pode acessar */}
          {userNavigation.map((item) => {
            // Se for o item de estudos, renderiza com dropdown
            if (item.href === '/estudos') {
              return (
                <div key={item.href} className="relative">
                        <button
                          onClick={() => toggleDropdown('estudos')}
                          className={`group flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-sm w-full ${
                            pathname.startsWith('/estudos')
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
                              : 'text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent'
                          }`}
                        >
                          {getIconComponent(item.icon)()}
                          <span>{item.label}</span>
                          <Icons.chevronDown />
                        </button>
                  {showDropdown === 'estudos' && (
                    <div className="mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-2">
                        {[
                          { href: '/estudos/resumoMensal', label: 'Resumo Mensal', icon: '📊' },
                          { href: '/estudos/resumo-financeiro', label: 'Resumo Financeiro', icon: '💰' },
                          { href: '/estudos/resumo-anual', label: 'Resumo Anual', icon: '📈' },
                          { href: '/estudos/resumo-faturamento', label: 'Resumo Faturamento Mensal', icon: '📋' },
                          { href: '/estudos/resumo-conta', label: 'Resumo da Conta', icon: '🏦' },
                          { href: '/estudos/metas', label: 'Metas', icon: '🎯' },
                        ].map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`flex items-center space-x-3 px-4 py-3 text-sm rounded-lg transition-colors duration-150 ${
                              pathname === subItem.href
                                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            
            // Para outros itens, renderiza como link normal
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 shadow-sm w-full ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
                    : 'text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:border-transparent'
                }`}
              >
                {getIconComponent(item.icon)()}
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Botão Sair - Mobile */}
          <button
            className="w-full px-4 py-3 text-sm font-medium border border-red-200 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 hover:from-red-100 hover:to-red-200 text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
            onMouseDown={async (e) => {
              e.preventDefault();
              sessionStorage.removeItem("selectedCliente");
              localStorage.clear();
              setIdCliente(null);
              await signOut({ callbackUrl: "/" });
            }}
          >
            🚪 Sair
          </button>
        </div>
      </div>
    </>
  );
}

// Função auxiliar para obter o componente de ícone baseado no nome
function getIconComponent(iconName: string) {
  const iconMap: { [key: string]: () => JSX.Element } = {
    tasks: Icons.tasks,
    studies: Icons.studies,
    bank: Icons.bank,
    client: Icons.client,
    user: Icons.user,
    bug: Icons.bug,
    asaas: Icons.asaas,
    contract: Icons.contract,
    category: Icons.category,
    supplier: Icons.supplier,
    balance: Icons.balance,
  };
  
  return iconMap[iconName] || Icons.tasks;
}
