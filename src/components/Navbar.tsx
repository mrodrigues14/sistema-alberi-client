'use client';

import { Poppins } from "next/font/google";
import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useCliente } from "@/lib/hooks/useCliente";
import { useClienteContext } from "@/context/ClienteContext";

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
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const { idCliente, setIdCliente } = useClienteContext();

    // Estado para armazenar o cliente selecionado
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
        if (clientes?.length > 0 && !selectedCliente) {
            const savedCliente = sessionStorage.getItem("selectedCliente");
            if (savedCliente) {
                setSelectedCliente(JSON.parse(savedCliente));
            }
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
            const clienteEncontrado: Cliente | undefined = clientes.find((cliente: Cliente) => cliente.idcliente === idCliente);
            if (clienteEncontrado) {
                setSelectedCliente({ id: clienteEncontrado.idcliente, nome: clienteEncontrado.apelido || clienteEncontrado.nome });
            }
        }
    }, [idCliente, clientes]); 

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdownCliente(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className={`bg-white flex shadow-md ${font.className}`}>
            <div className="w-full flex justify-between items-center px-10">
                <div className="flex space-x-2 items-center">
                    <a href="/home" className="text-center mr-20 p-0">
                        <img
                            src="/icone_imagem.png"
                            alt="Menu inicial"
                            className="h-20 object-contain"
                        />
                    </a>

                    <div className="flex space-x-4 items-center">
                        <div className="relative">
                            <Link
                                href="/kanban"
                                className="px-4 py-2 border border-gray-300 rounded  hover:bg-[#2d3692] hover:text-white transition shadow-md text-center"
                            >
                                Tarefas
                            </Link>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('estudos')}
                                className="px-9 py-2 border border-gray-300 rounded hover:bg-[#2d3692] hover:text-white transition shadow-md text-center"
                            >
                                Estudos
                            </button>
                            {showDropdown === 'estudos' && (
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-full">
                                    <a href="/estudos/resumo-mensal" className="block px-4 py-2 hover:bg-gray-200">
                                        Resumo Mensal
                                    </a>
                                    <a href="/estudos/resumo-financeiro" className="block px-4 py-2 hover:bg-gray-200">
                                        Resumo Financeiro
                                    </a>
                                    <a href="/estudos/resumo-anual" className="block px-4 py-2 hover:bg-gray-200">
                                        Resumo Anual
                                    </a>
                                    <a href="/estudos/resumo-faturamento" className="block px-4 py-2 hover:bg-gray-200">
                                        Resumo Faturamento Mensal
                                    </a>
                                    <a href="/estudos/resumo-conta" className="block px-4 py-2 hover:bg-gray-200">
                                        Resumo da Conta
                                    </a>
                                    <a href="/estudos/metas" className="block px-4 py-2 hover:bg-gray-200">Metas</a>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <Link
                                href="/extrato"
                                className="px-4 py-2 border border-gray-300 rounded  hover:bg-[#2d3692] hover:text-white transition shadow-md text-center"
                            >
                                Extrato bancário
                            </Link>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('configuracao-cliente')}
                                className="px-4 py-2 border border-gray-300 rounded  hover:bg-[#2d3692] hover:text-white transition shadow-md text-center"
                            >
                                Configuração de Cliente
                            </button>
                            {showDropdown === 'configuracao-cliente' && (
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-full">
                                    <a href="/configuracao-cliente/cadastro" className="block px-4 py-2 hover:bg-gray-200">
                                        Cadastro de Cliente
                                    </a>
                                    <a href="/configuracao-cliente/editar" className="block px-4 py-2 hover:bg-gray-200">
                                        Editar Cliente
                                    </a>
                                </div>
                            )}
                        </div>

                        <a
                            href="/reportar-falha"
                            className="px-4 py-2 border border-gray-300 rounded  hover:bg-[#2d3692] hover:text-white transition shadow-md text-center"
                        >
                            Reportar Falha ou Melhoria
                        </a>

                        {/* Seletor de Cliente */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => toggleDropdown('cliente')}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center w-[250px]"
                            >
                                {selectedCliente ? selectedCliente.nome : 'Selecionar Cliente'}
                            </button>

                            {showDropdown === 'cliente' && ( // 🔥 Agora só exibe o dropdown certo!
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-[250px] z-10">
                                    <input
                                        type="text"
                                        className="block px-4 py-2 border-b w-full"
                                        placeholder="Digite para pesquisar"
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
                    </div>
                </div>
            </div>

            {/* Perfil do usuário */}
            <div className="flex items-center justify-center px-8" style={{ backgroundColor: '#2d3692' }}>
                <a
                    href="/perfil"
                    className="px-4 py-2 border border-gray-300 rounded bg-white hover:bg-[#8BACAF] transition shadow-md text-center"
                >
                    {usuario}
                </a>
            </div>
        </nav>
    );
}
