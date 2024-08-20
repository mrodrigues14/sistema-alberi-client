'use client';

import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Definindo a interface para Empresa
interface Empresa {
    IDCLIENTE: number;
    CNPJ: string | null;
    CPF: string | null;
    TELEFONE: string | null;
    NOME: string;
    ENDERECO: string | null;
    cep: string;
    nome_responsavel: string | null;
    cpf_responsavel: string | null;
    inscricao_estadual: string | null;
    cnae_principal: string | null;
    APELIDO: string;
    socio: any[];
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["400"],
});

export default function Navbar() {
    const { data: session } = useSession();
    const [usuario, setUsuario] = useState('Carregando...');
    const [showDropdown, setShowDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [empresas, setEmpresas] = useState<Empresa[]>([]); // Inicializa como array vazio de Empresa
    const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

    useEffect(() => {
        if (session && session.user) {
            setUsuario(session.user.name || 'Desconhecido');
        } else {
            setUsuario('Usuário não autenticado');
        }
    }, [session]);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_LISTAR_CLIENTES}`, {
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`
                    }
                });
                const data: Empresa[] = await res.json();

                if (Array.isArray(data)) {
                    setEmpresas(data);
                    setFilteredEmpresas(data);
                } else {
                    console.error('A API não retornou um array:', data);
                }
            } catch (err) {
                console.error('Erro ao buscar empresas:', err);
            }
        };

        if (session) {
            fetchEmpresas()
                .then()
        }
    }, [session]);

    useEffect(() => {
        setFilteredEmpresas(
            empresas.filter((empresa) =>
                empresa.APELIDO.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, empresas]);

    const toggleDropdown = (dropdownName: string) => {
        setShowDropdown(showDropdown === dropdownName ? null : dropdownName);
    };

    const handleEmpresaSelect = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        setShowDropdown(null);
    };

    return (
        <nav className={`bg-white shadow-md py-2 ${font.className}`}>
            <div className="w-full flex justify-between items-center px-10">
                <div className="flex space-x-2 items-center">
                    <a href="/home" className="px-4 py-2 border border-r-8 border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center mr-20">
                        Menu inicial
                    </a>
                    <div className="flex space-x-2 items-center">
                        <div className="relative">
                            <button onClick={() => toggleDropdown('estudos')} className="px-9 py-2 border border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center">
                                Estudos
                            </button>
                            {showDropdown === 'estudos' && (
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-full">
                                    <a href="/estudos/resumo-mensal" className="block px-4 py-2 hover:bg-gray-200">Resumo Mensal</a>
                                    <a href="/estudos/resumo-financeiro" className="block px-4 py-2 hover:bg-gray-200">Resumo Financeiro</a>
                                    <a href="/estudos/resumo-anual" className="block px-4 py-2 hover:bg-gray-200">Resumo Anual</a>
                                    <a href="/estudos/resumo-faturamento" className="block px-4 py-2 hover:bg-gray-200">Resumo Faturamento Mensal</a>
                                    <a href="/estudos/resumo-conta" className="block px-4 py-2 hover:bg-gray-200">Resumo da Conta</a>
                                    <a href="/estudos/metas" className="block px-4 py-2 hover:bg-gray-200">Metas</a>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button onClick={() => toggleDropdown('extrato-bancario')} className="px-4 py-2 border border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center">
                                Extrato bancário
                            </button>
                            {showDropdown === 'extrato-bancario' && (
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-full">
                                    <a href="/extrato-bancario/inserir" className="block px-4 py-2 hover:bg-gray-200">Inserir extrato</a>
                                    <a href="/extrato-bancario/consultar" className="block px-4 py-2 hover:bg-gray-200">Consultar extrato</a>
                                    <a href="/extrato-bancario/rubricas" className="block px-4 py-2 hover:bg-gray-200">Rubricas</a>
                                    <a href="/extrato-bancario/adicionar-fornecedor" className="block px-4 py-2 hover:bg-gray-200">Adicionar fornecedor</a>
                                    <a href="/extrato-bancario/adicionar-banco" className="block px-4 py-2 hover:bg-gray-200">Adicionar Banco</a>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button onClick={() => toggleDropdown('configuracao-cliente')} className="px-4 py-2 border border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center">
                                Configuração de Cliente
                            </button>
                            {showDropdown === 'configuracao-cliente' && (
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-full">
                                    <a href="/configuracao-cliente/cadastro" className="block px-4 py-2 hover:bg-gray-200">Cadastro de Cliente</a>
                                    <a href="/configuracao-cliente/editar" className="block px-4 py-2 hover:bg-gray-200">Editar Cliente</a>
                                </div>
                            )}
                        </div>
                        <a href="/reportar-falha" className="px-4 py-2 border border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center">
                            Reportar Falha ou Melhoria
                        </a>
                        <div className="relative">
                            <button onClick={() => toggleDropdown('seletor-empresa')} className="px-4 py-2 border border-gray-300 rounded hover:bg-[#8BACAF] transition shadow-md text-center">
                                {selectedEmpresa ? selectedEmpresa.NOME : "Seletor empresa"}
                            </button>
                            {showDropdown === 'seletor-empresa' && (
                                <div className="absolute bg-white border rounded shadow-lg mt-2 w-[300px]">
                                    <input
                                        type="text"
                                        className="block px-4 py-2 border-b w-full"
                                        placeholder="Digite para pesquisar"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {filteredEmpresas.map((empresa) => (
                                        <a
                                            key={empresa.IDCLIENTE}
                                            href="#"
                                            className="block px-4 py-2 hover:bg-gray-200"
                                            onClick={() => handleEmpresaSelect(empresa)}
                                        >
                                            {empresa.APELIDO}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <a href="/perfil" className="px-4 py-2 border border-gray-300 rounded bg-gray-300 hover:bg-[#8BACAF] transition shadow-md text-center">
                        {usuario}
                    </a>
                </div>
            </div>
        </nav>
    );
}
