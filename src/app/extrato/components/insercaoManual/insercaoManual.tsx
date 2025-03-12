"use client";

import React, { useEffect, useMemo, useState } from "react";
import CustomDropdown from "../dropdown/CustomDropdown";
import { FaCalendarAlt } from "react-icons/fa";
import { createExtrato } from "@/lib/hooks/useExtrato";
import { useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { useFornecedoresPorCliente } from "@/lib/hooks/useFornecedor";

interface Categoria {
    idcategoria: number;
    nome: string;
    idCategoriaPai?: number | null;
}

const InsercaoManual: React.FC<{
    idCliente: number | null;
    bancoSelecionado: number | null;
}> = ({ idCliente, bancoSelecionado }) => {
    const { categoriasCliente, isLoading } = useCategoriasPorCliente(idCliente || undefined);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<{ id: number; nome: string } | null>(null);

    const categoriasFormatadas = useMemo(() => {
        if (!categoriasCliente || categoriasCliente.length === 0) return [];
    
        const categoriasPai: Categoria[] = categoriasCliente.filter((cat: Categoria) => !cat.idCategoriaPai);
        const categoriasFilhas: Categoria[] = categoriasCliente.filter((cat: Categoria) => cat.idCategoriaPai);
    
        return categoriasPai
            .sort((a, b) => a.nome.localeCompare(b.nome)) // 🔹 Ordenando pais em ordem alfabética
            .flatMap((pai) => {
                const subrubricas = categoriasFilhas
                    .filter((filha) => filha.idCategoriaPai === pai.idcategoria)
                    .sort((a, b) => a.nome.localeCompare(b.nome)) // 🔹 Ordenando filhos em ordem alfabética
                    .map((filha) => ({
                        label: `   └ ${filha.nome}`,
                        value: filha.idcategoria,
                        disabled: false,
                    }));
    
                return [
                    { label: pai.nome, value: pai.idcategoria, disabled: subrubricas.length > 0 }, // 🔹 Pai aparece antes dos filhos
                    ...subrubricas,
                ];
            });
    }, [categoriasCliente]);
    
    const { fornecedores } = useFornecedoresPorCliente();
    
    const fornecedoresFormatados = useMemo(() => {
        if (!fornecedores?.length) return [];
    
        return fornecedores
            .sort((a, b) => a.nome.localeCompare(b.nome)) // 🔹 Ordena os fornecedores por nome
            .map((fornecedor) => ({
                label: fornecedor?.nome,
                value: fornecedor?.idfornecedor,
            }));
    }, [fornecedores]);
    
    
    console.log(fornecedoresFormatados);

    const [entrada, setEntrada] = useState({
        id: Date.now(),
        data: "",
        rubricaSelecionada: "",
        fornecedorSelecionado: "",
        observacao: "",
        nomeExtrato: "",
        rubricaContabil: "",
        entrada: "",
        saida: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setEntrada((prev) => ({
            ...prev,
            entrada: field === "saida" ? "" : prev.entrada,
            saida: field === "entrada" ? "" : prev.saida,
            [field]: value,
        }));
    };


    console.log(fornecedores);
    const handleCategoriaChange = (idCategoria: number) => {
        const categoriaFilha: Categoria | undefined = categoriasCliente?.find((cat: Categoria) => cat.idcategoria === idCategoria);
        const categoriaPai: Categoria | null = categoriaFilha ? categoriasCliente?.find((cat: Categoria) => cat.idcategoria === categoriaFilha.idCategoriaPai) || null : null;

        if (categoriaFilha) {
            setCategoriaSelecionada({
                id: categoriaFilha.idcategoria,
                nome: categoriaPai ? `${categoriaPai.nome} - ${categoriaFilha.nome}` : categoriaFilha.nome,
            });
        }
    };

    const handleDateChange = (value: string) => {
        let cleaned = value.replace(/\D/g, "");

        if (cleaned.length > 2) cleaned = cleaned.replace(/^(\d{2})/, "$1/");
        if (cleaned.length > 5) cleaned = cleaned.replace(/^(\d{2})\/(\d{2})/, "$1/$2/");

        if (cleaned.length > 10) return;

        setEntrada((prev) => ({ ...prev, data: cleaned }));
    };

    const adicionarLinha = async () => {
        if (!entrada.entrada && !entrada.saida) {
            alert("Preencha pelo menos Entrada ou Saída!");
            return;
        }

        if (!idCliente || !bancoSelecionado || !categoriaSelecionada) {
            alert("Selecione um cliente, um banco e uma categoria antes de adicionar!");
            return;
        }

        const novoExtrato = {
            idCliente,
            idBanco: bancoSelecionado,
            idCategoria: categoriaSelecionada.id, // 🔹 Envia apenas o ID da categoria filha para o banco
            data: entrada.data.split("/").reverse().join("-"),
            nomeExtrato: entrada.nomeExtrato,
            descricao: entrada.nomeExtrato,
            valor: entrada.entrada
                ? Number(entrada.entrada.replace(/\D/g, "")) / 100
                : Number(entrada.saida.replace(/\D/g, "")) / 100,
            tipoDeTransacao: entrada.entrada ? "ENTRADA" as "ENTRADA" : "SAIDA" as "SAIDA",
            idFornecedor: null,
            rubricaContabil: entrada.rubricaContabil || null,
            observacao: entrada.observacao || null,
        };

        try {
            await createExtrato(novoExtrato);
            alert("Extrato inserido com sucesso!");

            setEntrada({
                id: Date.now(),
                data: "",
                rubricaSelecionada: "",
                fornecedorSelecionado: "",
                observacao: "",
                nomeExtrato: "",
                rubricaContabil: "",
                entrada: "",
                saida: "",
            });

            setCategoriaSelecionada(null);
        } catch (error) {
            console.error("Erro ao inserir extrato:", error);
            alert("Erro ao inserir extrato.");
        }
    };
    const formatarMoeda = (valor: string) => {
        const numeroLimpo = valor.replace(/\D/g, "");
        if (!numeroLimpo) return "";

        const numero = parseFloat(numeroLimpo) / 100;
        return numero.toLocaleString("pt-BR", {
            style: "currency",
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
                        <td className="border px-4 py-2">
                            <input
                                type="text"
                                className="border rounded w-full px-2"
                                placeholder="DD/MM/YYYY"
                                value={entrada.data}
                                onChange={(e) => handleDateChange(e.target.value)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <CustomDropdown
                                label="Selecione uma rubrica"
                                options={categoriasFormatadas} // ✅ Já estruturado corretamente { label, value }
                                selectedValue={categoriaSelecionada?.id || null} // ✅ Usa o ID para garantir correspondência
                                onSelect={(value) => handleCategoriaChange(value)}
                                type="rubrica"
                            />
                        </td>

                        <td className="border px-4 py-2">
                            <CustomDropdown
                                label="Selecione um fornecedor"
                                options={fornecedoresFormatados}
                                selectedValue={entrada.fornecedorSelecionado}
                                onSelect={(value) => handleInputChange("fornecedorSelecionado", value)}
                                type="rubrica"

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
                            <input
                                type="text"
                                className="border rounded w-full px-2"
                                placeholder="Rubrica Contábil"
                                value={entrada.rubricaContabil}
                                onChange={(e) => handleInputChange("rubricaContabil", e.target.value)}
                            />
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

            <div className="mt-4 flex justify-center">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={adicionarLinha}>
                    + Adicionar Linha
                </button>
            </div>
        </div>
    );
};

export default InsercaoManual;
