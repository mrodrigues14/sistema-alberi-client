"use client";

import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; // Ícones de PDF e Excel
import InsercaoManual from './components/insercaoManual/insercaoManual';
import Calendario from './components/calendario/calendario';
import TabelaExtrato from './components/tabelaExtrato/tabelaExtrato';

const Extrato: React.FC = () => {
    const [bancos, setBancos] = useState([
        { id: 1, nome: 'Banco do Brasil - CONTA CORRENTE' },
        { id: 2, nome: 'Caixa Econômica - POUPANÇA' },
        { id: 3, nome: 'Santander - CONTA CORRENTE' },
        { id: 4, nome: 'Itaú - CONTA SALÁRIO' },
    ]);

    const [bancoSelecionado, setBancoSelecionado] = useState<number | null>(null);
    const [metodoInsercao, setMetodoInsercao] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBancoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBancoSelecionado(Number(event.target.value));
    };

    const handleInsercaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setMetodoInsercao(value);

        if (value === 'manual') {
            setIsModalOpen(true);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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
                        <option value="" disabled>
                            Selecione o Banco
                        </option>
                        {bancos.map((banco) => (
                            <option key={banco.id} value={banco.id}>
                                {banco.nome}
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
                        <button
                            className="px-4 py-2 border rounded shadow-md hover:bg-gray-100 transition"
                        >
                            Download Template
                        </button>
                    )}
                </div>

                <div className="flex space-x-4 mt-8">
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                        title="Gerar PDF"
                    >
                        <FaFilePdf size={24} />
                    </button>
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md"
                        title="Gerar Excel"
                    >
                        <FaFileExcel size={24} />
                    </button>
                </div>
            </div>
            <div className="mt-8 w-full px-10 flex">
    <div className="ml-auto flex items-center space-x-4">
        <div className="text-center">
            <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Inicial
            </div>
            <div className="border px-4 py-2 rounded-b">
                0,00
            </div>
        </div>
        <div className="text-center">
            <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Final
            </div>
            <div className="border px-4 py-2 rounded-b">
                0,00
            </div>
        </div>
    </div>
</div>

            <div className="mt-16 w-full flex justify-between items-center px-10">
                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Adicionar Rubricas
                    </button>
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Adicionar Fornecedor
                    </button>
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Adicionar Banco
                    </button>
                </div>

                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Selecionar Todos
                    </button>
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Deletar Selecionados
                    </button>
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                    >
                        Editar Todas as Linhas
                    </button>
                </div>
            </div>
            <div className='flex justify-center items-center mt-8'>
                <Calendario/>
            </div>
            <div>            <TabelaExtrato/>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 max-w-4xl p-6 rounded shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Inserção Manual</h2>
                            <button
                                className="text-red-600 font-bold"
                                onClick={toggleModal}
                            >
                                Fechar
                            </button>
                        </div>

                        <div className="overflow-auto">
                            <InsercaoManual></InsercaoManual>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                onClick={toggleModal}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Extrato;
