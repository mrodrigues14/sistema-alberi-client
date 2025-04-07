'use client';

import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCliente } from "@/lib/hooks/useCliente";
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
    socio: any[];
}

export default function Navbar() {
    const { data: session } = useSession();
    const { clientes, isLoading, isError } = useCliente();
    const [usuario, setUsuario] = useState('Carregando...');
    const [showDropdown, setShowDropdownCliente] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
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
        if (savedCliente) {
            setSelectedCliente(JSON.parse(savedCliente));
        }
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


    // Filtrar clientes conforme a pesquisa
    const filteredClientes = sortedClientes.filter((cliente: Cliente) =>
        (cliente.apelido || cliente.nome).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleDropdown = (dropdownName: string) => {
        setShowDropdownCliente(prev => (prev === dropdownName ? null : dropdownName));
    };


    const handleClienteSelect = (cliente: Cliente) => {
        const clienteNome = cliente.apelido || cliente.nome;

        setSelectedCliente({ id: cliente.idcliente, nome: clienteNome }); // 🔥 Atualiza o nome imediatamente
        sessionStorage.setItem("selectedCliente", JSON.stringify({ id: cliente.idcliente, nome: clienteNome }));
        setIdCliente(cliente.idcliente);
        setShowDropdownCliente(null);
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
        console.log("idCliente ou clientes mudou");
    }, [idCliente, clientes]);

    useEffect(() => {
        console.log("selectedCliente mudou", selectedCliente);
    }, [selectedCliente]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (clienteDropdownRef.current && !clienteDropdownRef.current.contains(event.target as Node)) {
                setShowDropdownCliente(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className={`bg-white shadow-md ${font.className}`}>
          <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-6 py-2">
            {/* Lado esquerdo: logo + botão menu mobile */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <a href="/home" className="p-0 mr-4">
                <Image
                  src="/icone_imagem.png"
                  alt="Menu inicial"
                  width={90}
                  height={60}
                  className="object-contain"
                />
              </a>
      
              <button
                className="md:hidden ml-4"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
      
            {/* Menu de navegação principal */}
            <div className={`w-full md:flex md:items-center md:space-x-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
              <Link href="/kanban" className="block px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-md mt-2 md:mt-0">
                Tarefas
              </Link>
      
              {/* Dropdown Estudos */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('estudos')}
                  className="block px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-md mt-2 md:mt-0"
                >
                  Estudos
                </button>
                {showDropdown === 'estudos' && (
                  <div className="absolute bg-white border rounded shadow-lg mt-2 w-52 z-10">
                    {/* ... links de estudos ... */}
                  </div>
                )}
              </div>
      
              <Link href="/extrato" className="block px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-md mt-2 md:mt-0">
                Extrato bancário
              </Link>
      
              {/* Dropdown Configuração de Cliente */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('configuracao-cliente')}
                  className="block px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-md mt-2 md:mt-0"
                >
                  Configuração de Cliente
                </button>
                {showDropdown === 'configuracao-cliente' && (
                  <div className="absolute bg-white border rounded shadow-lg mt-2 w-52 z-10">
                    {/* ... links de configuração ... */}
                  </div>
                )}
              </div>
      
              <Link href="/chamados" className="block px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-md mt-2 md:mt-0">
                Reportar Falha
              </Link>
            </div>
      
            {/* Lado direito: Seletor de Cliente + Usuário */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0 md:ml-4">
              {/* Seletor de Cliente */}
              <div className="relative mt-2 md:mt-0" ref={clienteDropdownRef}>
                <button
                  onClick={() => toggleDropdown('cliente')}
                  className="px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 transition shadow-md w-full md:w-56"

                >
                  {selectedCliente ? selectedCliente.nome : 'Selecionar Cliente'}
                </button>
                {showDropdown === 'cliente' && (
                  <div className="absolute bg-white border rounded shadow-lg mt-2 w-full md:w-[250px] z-10">
                    <input
                      type="text"
                      className="block px-4 py-2 border-b w-full"
                      placeholder="Pesquisar cliente"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isLoading && <p className="text-center p-2">Carregando...</p>}
                    {isError && <p className="text-red-500 text-center p-2">Erro ao buscar clientes</p>}
                    {filteredClientes.length === 0 && !isLoading && (
                      <p className="text-center p-2">Nenhum cliente encontrado</p>
                    )}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredClientes.map((cliente: Cliente) => (
                        <button
                          key={cliente.idcliente}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                          onClick={() => handleClienteSelect(cliente)}
                        >
                          {cliente.apelido || cliente.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
      
              {/* Botão de Usuário */}
              <div className="relative" ref={usuarioDropdownRef}>
                <button
                  onClick={() => toggleDropdown("usuario")}
                  className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-[#8BACAF] transition shadow-md text-center w-full md:w-48"
                >
                  {usuario}
                </button>
                {showDropdown === "usuario" && (
                  <div className="absolute right-0 w-full md:w-48 bg-white border rounded shadow-lg z-20">
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
