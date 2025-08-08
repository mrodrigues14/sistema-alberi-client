'use client';

import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCliente } from "@/lib/hooks/useCliente";
import { useMeusClientes } from "@/lib/hooks/useMeusClientes";
import { useClienteContext } from "@/context/ClienteContext";
import Image from 'next/image';
import { signOut } from "next-auth/react";

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
  const [usuario, setUsuario] = useState('Carregando...');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'todos' | 'meus'>('todos'); // Estado para controlar o modo de visualização
  const clienteDropdownRef = useRef<HTMLDivElement | null>(null);
  const usuarioDropdownRef = useRef<HTMLDivElement | null>(null);
  const { idCliente, setIdCliente } = useClienteContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<{ id: number, nome: string } | null>(null);

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
  }, [clientes]);



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

    setSelectedCliente({ id: cliente.idcliente, nome: clienteNome }); // 🔥 Atualiza o nome imediatamente
    sessionStorage.setItem("selectedCliente", JSON.stringify({ id: cliente.idcliente, nome: clienteNome }));
    setIdCliente(cliente.idcliente);
    setShowDropdown(null);
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
    setShowDropdown(null);
  };

  useEffect(() => {
    if (idCliente && clientes?.length > 0) {
      const clienteEncontrado = clientes.find((c: { idcliente: number; }) => c.idcliente === idCliente);
      const novoNome = clienteEncontrado?.apelido || clienteEncontrado?.nome;
      if (clienteEncontrado && (selectedCliente?.id !== idCliente || selectedCliente?.nome !== novoNome)) {
        setSelectedCliente({ id: idCliente, nome: novoNome });
      }
    }
  }, [idCliente, clientes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (clienteDropdownRef.current && !clienteDropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`bg-white shadow-md ${font.className} z-50`}>
      <div className="flex flex-col md:flex-row justify-between items-center px-2 sm:px-4 md:px-6 py-2 md:py-2 space-y-2 md:space-y-0">
        {/* Lado esquerdo: logo + seleção de cliente + botão menu mobile */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <a href="/home" className="p-0">
              <Image
                src="/icone_imagem.png"
                alt="Menu inicial"
                width={70}
                height={50}
                className="object-contain"
              />
            </a>
            
            {/* Seleção de Cliente - Visível apenas no mobile */}
            <div className="md:hidden relative" ref={clienteDropdownRef}>
              <button
                onClick={() => toggleDropdown('cliente')}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded border hover:bg-gray-200 transition"
              >
                {selectedCliente ? 
                  `${viewMode === 'meus' ? '👤 ' : '📋 '}${selectedCliente.nome}` : 
                  'Selecionar Cliente'
                }
              </button>
              {showDropdown === 'cliente' && (
                <div className="absolute bg-white border rounded shadow-lg mt-1 w-64 z-10 text-sm">
                  {/* Opções de filtro */}
                  <div className="border-b bg-gray-50">
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                        viewMode === 'todos' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        // Selecionar "Todos os Clientes" (ID 68)
                        const todosClientesId = 68;
                        const todosClientesNome = "Todos Clientes Vinculados ao Perfil!";
                        
                        setSelectedCliente({ id: todosClientesId, nome: todosClientesNome });
                        sessionStorage.setItem("selectedCliente", JSON.stringify({ id: todosClientesId, nome: todosClientesNome }));
                        setIdCliente(todosClientesId);
                        setViewMode('todos');
                        sessionStorage.setItem("viewMode", 'todos');
                        setSearchQuery('');
                        setShowDropdown(null);
                      }}
                    >
                      📋 Todos os Clientes
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                        viewMode === 'meus' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                      }`}
                      onClick={handleMeusClientesSelect}
                    >
                      👤 Meus Clientes
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    className="block px-4 py-2 border-b w-full text-sm"
                    placeholder="Pesquisar cliente"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="max-h-60 overflow-y-auto text-sm">
                    {filteredClientes.map((cliente: Cliente) => (
                      <button
                        key={cliente.idcliente}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleClienteSelect(cliente)}
                      >
                        {cliente.apelido || cliente.nome}
                      </button>
                    ))}
                    {filteredClientes.length === 0 && (
                      <div className="px-4 py-2 text-gray-500 text-center">
                        {viewMode === 'meus' ? 'Nenhum cliente vinculado encontrado' : 'Nenhum cliente encontrado'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden ml-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu principal */}
        <div className={`w-full md:flex md:items-center md:space-x-2 ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white md:bg-transparent`}>
          {/* Nome do usuário - Visível apenas no mobile quando menu aberto */}
          <div className="md:hidden px-3 py-2 text-sm text-gray-600 border-b border-gray-200 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Usuário:</span>
              <span>{usuario}</span>
            </div>
          </div>

          {/* Tarefas */}
          <Link
            href="/kanban"
            className="block px-3 py-2 text-sm border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-sm mt-1 md:mt-0 text-center md:text-left"
          >
            Tarefas
          </Link>

          {/* Dropdown de Estudos */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('estudos')}
              className="block w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-sm mt-1 md:mt-0 text-center md:text-left"
            >
              Estudos
            </button>
            {showDropdown === 'estudos' && (
              <div className="absolute bg-white border rounded shadow-lg mt-1 w-full md:w-52 z-10 text-sm">
                {[
                  { href: '/estudos/resumoMensal', label: 'Resumo Mensal' },
                  { href: '/estudos/resumo-financeiro', label: 'Resumo Financeiro' },
                  { href: '/estudos/resumo-anual', label: 'Resumo Anual' },
                  { href: '/estudos/resumo-faturamento', label: 'Resumo Faturamento Mensal' },
                  { href: '/estudos/resumo-conta', label: 'Resumo da Conta' },
                  { href: '/estudos/metas', label: 'Metas' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

          </div>

          {[
            { href: '/extrato', label: 'Extrato bancário' },
            { href: '/configuracaoCliente', label: 'Configuração de Cliente' },
            { href: '/configuracaoUsuario', label: 'Configuração de Usúario' },
            { href: '/chamados', label: 'Reportar Falha' },
            { href: '/gestaoAssas', label: 'Gestão Asaas' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-sm mt-1 md:mt-0 text-center md:text-left"
            >
              {item.label}
            </Link>
          ))}

          {/* Botão Sair - Visível apenas no mobile quando menu aberto */}
          <div className="md:hidden">
            <button
              className="w-full px-3 py-2 text-sm border border-red-300 rounded bg-red-50 hover:bg-red-100 text-red-700 transition shadow-sm mt-1 text-center"
              onMouseDown={async (e) => {
                e.preventDefault();
                sessionStorage.removeItem("selectedCliente");
                localStorage.clear();
                setIdCliente(null);
                await signOut({ callbackUrl: "/" });
              }}
            >
              Sair
            </button>
          </div>
        </div>



        {/* Lado direito: Cliente + Usuário */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-3 md:mt-0 md:ml-4 text-sm">
          {/* Cliente - Visível apenas no desktop */}
          <div className="relative w-full sm:w-auto hidden md:block" ref={clienteDropdownRef}>
            <button
              onClick={() => toggleDropdown('cliente')}
              className="px-3 py-2 border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 transition shadow-sm w-full sm:w-44 text-center md:text-left"
            >
              {selectedCliente ? 
                `${viewMode === 'meus' ? '👤 ' : '📋 '}${selectedCliente.nome}` : 
                'Selecionar Cliente'
              }
            </button>
            {showDropdown === 'cliente' && (
              <div className="absolute bg-white border rounded shadow-lg mt-1 w-full sm:w-[250px] z-10">
                {/* Opções de filtro */}
                <div className="border-b bg-gray-50">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                      viewMode === 'todos' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      // Selecionar "Todos os Clientes" (ID 68)
                      const todosClientesId = 68;
                      const todosClientesNome = "Todos Clientes Vinculados ao Perfil!";
                      
                      setSelectedCliente({ id: todosClientesId, nome: todosClientesNome });
                      sessionStorage.setItem("selectedCliente", JSON.stringify({ id: todosClientesId, nome: todosClientesNome }));
                      setIdCliente(todosClientesId);
                      setViewMode('todos');
                      sessionStorage.setItem("viewMode", 'todos');
                      setSearchQuery('');
                      setShowDropdown(null);
                    }}
                  >
                    📋 Todos os Clientes
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm font-medium ${
                      viewMode === 'meus' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                    onClick={handleMeusClientesSelect}
                  >
                    👤 Meus Clientes
                  </button>
                </div>
                
                <input
                  type="text"
                  className="block px-4 py-2 border-b w-full text-sm"
                  placeholder="Pesquisar cliente"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="max-h-60 overflow-y-auto text-sm">
                  {filteredClientes.map((cliente: Cliente) => (
                    <button
                      key={cliente.idcliente}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      onClick={() => handleClienteSelect(cliente)}
                    >
                      {cliente.apelido || cliente.nome}
                    </button>
                  ))}
                  {filteredClientes.length === 0 && (
                    <div className="px-4 py-2 text-gray-500 text-center">
                      {viewMode === 'meus' ? 'Nenhum cliente vinculado encontrado' : 'Nenhum cliente encontrado'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Usuário - Visível apenas no desktop */}
          <div className="relative w-full sm:w-auto hidden md:block" ref={usuarioDropdownRef}>
            <button
              onClick={() => toggleDropdown("usuario")}
              className="px-3 py-2 border border-gray-300 rounded bg-white hover:bg-[#2d3692] hover:text-white transition shadow-sm w-full sm:w-44 text-center md:text-left"
            >
              {usuario}
            </button>
            {showDropdown === "usuario" && (
              <div className="absolute right-0 w-full sm:w-44 bg-white border rounded shadow-lg z-20 text-sm">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onMouseDown={async (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem("selectedCliente");
                    localStorage.clear();
                    setIdCliente(null);
                    await signOut({ callbackUrl: "/" });
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );


}
