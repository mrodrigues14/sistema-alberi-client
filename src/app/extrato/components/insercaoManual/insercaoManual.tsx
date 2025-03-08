"use client";

import React, { useState } from "react";
import CustomDropdown from "../dropdown/CustomDropdown";
import { FaCalendarAlt } from "react-icons/fa";

const InsercaoManual: React.FC<{ adicionarEntrada: (novaEntrada: any) => void }> = ({ adicionarEntrada }) => {
    const [rubricas, setRubricas] = useState(["Aluguel", "Salários", "Impostos", "Materiais", "Marketing"]);
    const [fornecedores, setFornecedores] = useState(["Fornecedor A", "Fornecedor B", "Fornecedor C", "Fornecedor D"]);

    const [entrada, setEntrada] = useState({
        id: Date.now(),
        data: "",
        rubricaSelecionada: "",
        fornecedorSelecionado: "",
        observacao: "",
        nomeExtrato: "",
        rubricaContabil: "",
        entrada: "",
        saida: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setEntrada((prev) => ({
            ...prev,
            entrada: field === "saida" ? "" : prev.entrada, // Limpa "entrada" se estiver preenchendo "saida"
            saida: field === "entrada" ? "" : prev.saida, // Limpa "saida" se estiver preenchendo "entrada"
            [field]: value
        }));
    };
    const handleDateChange = (value: string) => {
        // Remove qualquer caractere que não seja número
        let cleaned = value.replace(/\D/g, "");
    
        // Formata enquanto digita
        if (cleaned.length > 2) cleaned = cleaned.replace(/^(\d{2})/, "$1/");
        if (cleaned.length > 5) cleaned = cleaned.replace(/^(\d{2})\/(\d{2})/, "$1/$2/");
    
        // Permite apenas até DD/MM/YYYY
        if (cleaned.length > 10) return;
    
        setEntrada((prev) => ({ ...prev, data: cleaned }));
    };
    const adicionarLinha = () => {
        if (entrada.entrada || entrada.saida) {
            adicionarEntrada(entrada); // Adiciona na tabela Extrato
            setEntrada({
                id: Date.now(),
                data: "",
                rubricaSelecionada: "",
                fornecedorSelecionado: "",
                observacao: "",
                nomeExtrato: "",
                rubricaContabil: "",
                entrada: "",
                saida: ""
            });
        } else {
            alert("Preencha pelo menos Entrada ou Saída!");
        }
    };
    const formatarMoeda = (valor: string) => {
        // Remove qualquer caractere que não seja número
        const numeroLimpo = valor.replace(/\D/g, "");

        if (!numeroLimpo) return "";

        // Converte para número e divide por 100 para manter casas decimais
        const numero = parseFloat(numeroLimpo) / 100;

        // Retorna no formato BRL
        return numero.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        });
    };

    return (
        <div className="w-full p-4">
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
                    <td className="border px-4 py-2 relative">
    <div className="flex items-center border rounded w-full px-2">
        <input
            type="text"
            className="w-full outline-none"
            placeholder="DD/MM/YYYY"
            value={entrada.data}
            onChange={(e) => handleDateChange(e.target.value)}
            onPaste={(e) => {
                const pastedData = e.clipboardData.getData("text");
                handleDateChange(pastedData);
            }}
        />
        <FaCalendarAlt className="text-gray-500 cursor-pointer ml-2" />
    </div>
</td>

                        <td className="border px-4 py-2">
                            <CustomDropdown
                                label="Selecione uma rubrica"
                                options={rubricas}
                                selectedValue={entrada.rubricaSelecionada}
                                onSelect={(value) => handleInputChange("rubricaSelecionada", value)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <CustomDropdown
                                label="Selecione um fornecedor"
                                options={fornecedores}
                                selectedValue={entrada.fornecedorSelecionado}
                                onSelect={(value) => handleInputChange("fornecedorSelecionado", value)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="text"
                                className="border rounded w-full px-2"
                                placeholder="Observação"
                                value={entrada.observacao}
                                onChange={(e) => handleInputChange("observacao", e.target.value)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="text"
                                className="border rounded w-full px-2"
                                placeholder="Nome no Extrato"
                                value={entrada.nomeExtrato}
                                onChange={(e) => handleInputChange("nomeExtrato", e.target.value)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <select
                                className="border rounded w-full px-2"
                                value={entrada.rubricaContabil}
                                onChange={(e) => handleInputChange("rubricaContabil", e.target.value)}
                            >
                                <option value="">Selecione uma rubrica contábil</option>
                                <option value="Despesas Fixas">Despesas Fixas</option>
                                <option value="Investimentos">Investimentos</option>
                                <option value="Tributos">Tributos</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="text"
                                className="border rounded w-full px-2"
                                placeholder="Entrada"
                                value={entrada.entrada}
                                onChange={(e) => handleInputChange("entrada", formatarMoeda(e.target.value))}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="text"
                                className="border rounded w-full px-2"
                                placeholder="Saída"
                                value={entrada.saida}
                                onChange={(e) => handleInputChange("saida", formatarMoeda(e.target.value))}
                            />
                        </td>

                    </tr>
                </tbody>
            </table>

            {/* Botão Adicionar */}
            <div className="mt-4 flex justify-center">
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    onClick={adicionarLinha}
                >
                    + Adicionar Linha
                </button>
            </div>
        </div>
    );
};

export default InsercaoManual;
