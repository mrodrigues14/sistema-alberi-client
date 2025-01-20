"use client";

import React, { useState } from 'react';

const InsercaoManual: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Função para abrir e fechar o modal
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        {/* Título e botão para fechar */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Inserção Manual</h2>
                            <button
                                className="text-red-600 font-bold"
                                onClick={toggleModal}
                            >
                                Fechar
                            </button>
                        </div>

                        {/* Formulário */}
                        <div className="overflow-auto">
                            <table className="w-full border-collapse border">
                                <thead className="bg-blue-700 text-white">
                                    <tr>
                                        <th className="border px-4 py-2">Data</th>
                                        <th className="border px-4 py-2">Rubrica Financeira</th>
                                        <th className="border px-4 py-2">Fornecedor</th>
                                        <th className="border px-4 py-2">Observação</th>
                                        <th className="border px-4 py-2">Nome no Extrato</th>
                                        <th className="border px-4 py-2">Rubrica Contábil</th>
                                        <th className="border px-4 py-2">Entrada</th>
                                        <th className="border px-4 py-2">Saída</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="date"
                                                className="border rounded w-full px-2"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select className="border rounded w-full px-2">
                                                <option>Selecione uma rubrica</option>
                                                <option>Rubrica 1</option>
                                                <option>Rubrica 2</option>
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select className="border rounded w-full px-2">
                                                <option>Selecione um fornecedor</option>
                                                <option>Fornecedor 1</option>
                                                <option>Fornecedor 2</option>
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                className="border rounded w-full px-2"
                                                placeholder="Digite observação"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                className="border rounded w-full px-2"
                                                placeholder="Digite o nome no extrato"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <select className="border rounded w-full px-2">
                                                <option>Selecione uma rubrica contábil</option>
                                                <option>Rubrica Contábil 1</option>
                                                <option>Rubrica Contábil 2</option>
                                            </select>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                className="border rounded w-full px-2"
                                                placeholder="Digite a entrada"
                                            />
                                        </td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                className="border rounded w-full px-2"
                                                placeholder="Digite a saída"
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Botão de salvar */}
                        <div className="mt-4 flex justify-end">
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                onClick={() => {
                                    // Lógica para salvar os dados
                                    toggleModal();
                                }}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsercaoManual;
