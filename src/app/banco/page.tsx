"use client";

import { useEffect, useState } from "react";
import { deleteBanco, useBanco } from "@/lib/hooks/userBanco";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import AdicionarBanco from "./components/adicionarBanco/adicionarBanco";
import EditarBanco from "./components/editarBanco/editarBanco";

const Bancos = () => {
    const [idCliente, setIdCliente] = useState<number | null>(null);
    const { bancos, isLoading, isError, mutate } = useBanco(idCliente || undefined);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bancoEditando, setBancoEditando] = useState<{ id: number; nome: string; tipo: "CONTA CORRENTE" | "CONTA INVESTIMENTO" | "CONTA SALARIO" } | null>(null);


    const handleDelete = async (idBanco: number) => {
        if (!idCliente) return;

        if (isDeleting) return;
        setIsDeleting(true);

        try {
            await deleteBanco(idBanco, idCliente);
            mutate();
        } catch (error) {
            console.error("Erro ao deletar banco:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCliente = sessionStorage.getItem("selectedCliente");
            if (storedCliente) {
                const parsedCliente = JSON.parse(storedCliente);
                setIdCliente(parsedCliente.id);
            }
        }
    }, []);
    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Bancos Vinculados</h2>

            <div className="text-center mb-4">
                <button
                    className="bg-blue-700 text-white px-4 py-2 rounded shadow-md hover:bg-blue-800 flex items-center space-x-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FaPlus />
                    <span>Adicionar Banco</span>
                </button>
            </div>

            {isLoading && <p className="text-center text-gray-600">Carregando bancos...</p>}
            {isError && <p className="text-center text-red-500">Erro ao carregar bancos.</p>}

            {bancos.length > 0 && (
                <ul className="border border-gray-200 rounded-md">
                    {bancos.map((banco) => (
                        <li key={banco.idbanco} className="flex justify-between items-center p-3 border-b">
                            <span>{banco.nome} - {banco.tipo}</span>
                            <div className="flex space-x-2">
                                <button
                                    className="text-orange-500 hover:text-orange-700"
                                    onClick={() => setBancoEditando({ id: banco.idbanco, nome: banco.nome, tipo: banco.tipo })}
                                >
                                    <FaEdit size={18} />
                                </button>

                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(banco.idbanco)}
                                    disabled={isDeleting}
                                >
                                    <FaTrash size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && bancos.length === 0 && (
                <p className="text-center text-gray-500">Nenhum banco vinculado.</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[450px] relative">
                        <button
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✖
                        </button>
                        <h2 className="text-xl font-bold text-center mb-4">Adicionar Banco</h2>
                        <AdicionarBanco />
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
            {bancoEditando && (
                <EditarBanco
                    idBanco={bancoEditando.id}
                    nomeInicial={bancoEditando.nome}
                    tipoInicial={bancoEditando.tipo}
                    onClose={() => {
                        setBancoEditando(null);
                        mutate();
                    }}
                />
            )}


        </div>
    );
};

export default Bancos;
