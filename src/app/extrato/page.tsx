"use client";

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; // Ícones de PDF e Excel
import InsercaoManual from './components/insercaoManual/insercaoManual';
import Calendario from './components/calendario/calendario';
import TabelaExtrato from './components/tabelaExtrato/tabelaExtrato';
import { useBanco, Banco } from '@/lib/hooks/userBanco';

const Extrato: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const { bancos } = useBanco(96);
    const [bancoSelecionado, setBancoSelecionado] = useState<number | null>(null);
    const [metodoInsercao, setMetodoInsercao] = useState<string>("");
    const [dadosTabela, setDadosTabela] = useState([
        {
            id: 1,
            data: "12/03/2024",
            rubricaSelecionada: "Salários",
            fornecedorSelecionado: "Empresa XPTO",
            observacao: "Pagamento mensal",
            nomeExtrato: "Folha de pagamento",
            rubricaContabil: "Despesas Fixas",
            entrada: "",
            saida: "5.000,00"
        },
        {
            id: 2,
            data: "15/03/2024",
            rubricaSelecionada: "Impostos",
            fornecedorSelecionado: "Receita Federal",
            observacao: "Pagamento de impostos",
            nomeExtrato: "IRPJ",
            rubricaContabil: "Tributos",
            entrada: "",
            saida: "1.200,00"
        },
        {
            id: 3,
            data: "18/03/2024",
            rubricaSelecionada: "Materiais",
            fornecedorSelecionado: "Loja ABC",
            observacao: "Compra de insumos",
            nomeExtrato: "Compra de papel",
            rubricaContabil: "Despesas Variáveis",
            entrada: "",
            saida: "350,00"
        },
        {
            id: 4,
            data: "20/03/2024",
            rubricaSelecionada: "Marketing",
            fornecedorSelecionado: "Agência Criativa",
            observacao: "Campanha publicitária",
            nomeExtrato: "Publicidade",
            rubricaContabil: "Investimentos",
            entrada: "",
            saida: "2.500,00"
        },
        {
            id: 5,
            data: "22/03/2024",
            rubricaSelecionada: "Recebimentos",
            fornecedorSelecionado: "Cliente Y",
            observacao: "Pagamento de serviço prestado",
            nomeExtrato: "Fatura #1234",
            rubricaContabil: "Receitas",
            entrada: "8.000,00",
            saida: ""
        },
        {
            id: 6,
            data: "25/03/2024",
            rubricaSelecionada: "Aluguel",
            fornecedorSelecionado: "Imobiliária ABC",
            observacao: "Pagamento mensal",
            nomeExtrato: "Aluguel da sede",
            rubricaContabil: "Despesas Fixas",
            entrada: "",
            saida: "4.200,00"
        },
    ]);

    const handleBancoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBanco = Number(event.target.value);
        setBancoSelecionado(selectedBanco);

        if (typeof window !== "undefined") {
            sessionStorage.setItem("bancoSelecionado", String(selectedBanco));
        }
    };


    const handleInsercaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMetodoInsercao(event.target.value);
    };

    const adicionarEntrada = (novaEntrada: any) => {
        setDadosTabela((prevDados) => [...prevDados, novaEntrada]);
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedBanco = sessionStorage.getItem("bancoSelecionado");
            if (storedBanco) {
                setBancoSelecionado(Number(storedBanco));
            }
        }
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 w-full z-10">
                <Navbar />
            </div>
            <div className="mt-20 flex flex-col items-center space-y-4 px-4">
                <div className="flex space-x-4 mt-8">
                    <select
                        className="px-4 py-2 border rounded shadow-md"
                        value={bancoSelecionado || ''}
                        onChange={handleBancoChange}
                    >
                        <option value="" disabled>Selecione o Banco</option>
                        {bancos.map((banco: Banco) => (
                            <option key={banco.idbanco} value={banco.idbanco}>
                                {banco.nome} - {banco.tipo}
                            </option>
                        ))}
                    </select>


                    <select
                        className="px-4 py-2 border rounded shadow-md"
                        value={metodoInsercao}
                        onChange={handleInsercaoChange}
                    >
                        <option value="">Selecione o Método de Inserção</option>
                        <option value="manual">Inserção Manual</option>
                        <option value="importar">Importar Arquivo</option>
                    </select>

                    {metodoInsercao === 'importar' && (
                        <button className="px-4 py-2 border rounded shadow-md hover:bg-gray-100 transition">
                            Download Template
                        </button>
                    )}
                </div>

                <div className="flex space-x-4 mt-8">
                    <button className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md" title="Gerar PDF">
                        <FaFilePdf size={24} />
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md" title="Gerar Excel">
                        <FaFileExcel size={24} />
                    </button>
                </div>

                {/* Inserção Manual será exibida aqui se selecionado */}
                {metodoInsercao === "manual" && (
                    <div className="p-6 border rounded shadow-md mt-6">
                        <h2 className="text-xl font-bold mb-4">Inserção Manual</h2>
                        <InsercaoManual adicionarEntrada={adicionarEntrada} />
                    </div>
                )}
            </div>


            <div className="mt-16 w-full flex justify-between items-center px-10">
                <div className="flex space-x-4">
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Adicionar Rubricas
                    </button>
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Adicionar Fornecedor
                    </button>
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        onClick={() => setShowModal(true)}
                    >
                        Adicionar Banco
                    </button>

                </div>

                <div className="flex space-x-4">
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Selecionar Todos
                    </button>
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Deletar Selecionados
                    </button>
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Editar Todas as Linhas
                    </button>
                </div>
            </div>
            <div className='flex justify-center items-center mt-8'>
                <Calendario />
            </div>

            <div className="mt-8 w-full px-10">
                <TabelaExtrato dados={dadosTabela} />
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[800px]">
                        <h2 className="text-xl font-bold mb-4">Adicionar Banco</h2>
                        <iframe src="/banco" className="w-full h-[600px] border-none"></iframe>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => setShowModal(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

        </>
    );
};

export default Extrato;
