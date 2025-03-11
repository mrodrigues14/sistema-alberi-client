"use client";

import { createBanco } from "@/lib/hooks/userBanco";
import React, { useEffect, useState } from "react";

const AdicionarBanco: React.FC = () => {
    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState<"CONTA CORRENTE" | "CONTA INVESTIMENTO" | "CONTA SALARIO">("CONTA CORRENTE");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [idCliente, setIdCliente] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCliente = sessionStorage.getItem("selectedCliente");
            if (storedCliente) {
                const parsedCliente = JSON.parse(storedCliente);
                setIdCliente(parsedCliente.id); // 🔥 Pega o ID do cliente salvo
            }
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!idCliente) {
            setError("Erro: Nenhum cliente selecionado.");
            setLoading(false);
            return;
        }

        try {
            await createBanco({ nome, tipo }, idCliente);
            alert("Banco adicionado com sucesso!");
            setNome("");
            setTipo("CONTA CORRENTE");
        } catch (err) {
            setError("Erro ao adicionar banco.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Adicionar Conta</h2>

            <div className="border-b mb-4 pb-2 text-gray-600">Informações da Conta</div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-medium text-gray-700">Nome do Banco:</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-gray-700">Tipo:</label>
                    <select
                        className="w-full px-3 py-2 border rounded mt-1 focus:outline-none focus:ring focus:ring-blue-300"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value as "CONTA CORRENTE" | "CONTA INVESTIMENTO" | "CONTA SALARIO")}
                    >
                        <option value="CONTA CORRENTE">Conta Corrente</option>
                        <option value="CONTA INVESTIMENTO">Conta Investimento</option>
                        <option value="CONTA SALARIO">Conta Salário</option>
                    </select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-[#2d3692] text-white py-2 rounded hover:bg-[#1f2859] transition"
                    disabled={loading}
                >
                    {loading ? "Adicionando..." : "Adicionar"}
                </button>
            </form>
        </div>
    );
};

export default AdicionarBanco;
