"use client";

import React, { useMemo, useState } from "react";
import CustomDropdown from "../dropdown/CustomDropdown";
import { createExtrato } from "@/lib/hooks/useExtrato";
import { useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { useFornecedoresPorCliente } from "@/lib/hooks/useFornecedor";
import { useRubricasContabeis } from "@/lib/hooks/useRubricaContabil";

interface Categoria {
    idcategoria: number;
    nome: string;
    idCategoriaPai?: number | null;
}

const InsercaoManual: React.FC<{
    idCliente: number | null;
    bancoSelecionado: number | null;
    onFechar: () => void;
}> = ({ idCliente, bancoSelecionado, onFechar }) => {
    const { categoriasCliente, isLoading } = useCategoriasPorCliente(idCliente || undefined);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<{ label: string; value: number } | null>(null);

    const categoriasFormatadas = useMemo(() => {
        if (!categoriasCliente?.length) return [];

        const categoriasPai = categoriasCliente.filter((cat: { idCategoriaPai: any; }) => !cat.idCategoriaPai);
        const categoriasFilhas = categoriasCliente.filter((cat: { idCategoriaPai: any; }) => cat.idCategoriaPai);

        return categoriasPai
            .sort((a: Categoria, b: Categoria) => a.nome.localeCompare(b.nome))
            .flatMap((pai: Categoria) => {
                const subrubricas: Array<{ label: string; value: number; disabled: boolean }> = categoriasFilhas
                    .filter((filha: Categoria) => filha.idCategoriaPai === pai.idcategoria)
                    .sort((a: Categoria, b: Categoria) => a.nome.localeCompare(b.nome))
                    .map((filha: Categoria) => ({
                        label: `   └ ${filha.nome}`,
                        value: filha.idcategoria,
                        disabled: false,
                    }));

                return [
                    {
                        label: pai.nome,
                        value: pai.idcategoria,
                        disabled: subrubricas.length > 0,
                    },
                    ...subrubricas,
                ];
            });
    }, [categoriasCliente]);


    const { fornecedores } = useFornecedoresPorCliente(idCliente);
    const fornecedoresFormatados = useMemo(() => {
        if (!fornecedores?.length) return [];

        return fornecedores
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map(fornecedor => ({
                label: fornecedor.nome,
                value: fornecedor.idfornecedor,
                disabled: false,
            }));
    }, [fornecedores]);

    const handleFornecedorChange = (option: { label: string; value: string | number }) => {
        setEntrada((prev) => ({
            ...prev,
            fornecedorSelecionado: {
                label: option.label,
                value: typeof option.value === "string" ? parseInt(option.value, 10) : option.value,
            },
        }));
    };

    const { rubricas } = useRubricasContabeis();
    const [rubricaContabilSelecionada, setRubricaContabilSelecionada] = useState<{ label: string; value: number } | null>(null);
    const rubricasContabeisFormatadas = useMemo(() => {
        if (!rubricas?.length) return [];

        return rubricas
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((rub) => ({
                label: rub.nome,
                value: rub.idRubricaContabil,
                disabled: false,
            }));
    }, [rubricas]);

    const [entrada, setEntrada] = useState({
        id: Date.now(),
        data: "",
        rubricaSelecionada: "",
        fornecedorSelecionado: null as null | { label: string; value: number },
        observacao: "",
        nomeNoExtrato: "",
        rubricaContabil: "",
        entrada: "",
        saida: "",
    });


    const handleInputChange = (field: string, value: any) => {
        setEntrada((prev) => ({
            ...prev,
            entrada: field === "saida" ? "" : prev.entrada,
            saida: field === "entrada" ? "" : prev.saida,
            [field]: value,
        }));
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
          idCategoria: categoriaSelecionada.value,
          data: entrada.data.split("/").reverse().join("-"),
          nomeNoExtrato: entrada.nomeNoExtrato,
          descricao: entrada.observacao,
          valor: entrada.entrada
            ? Number(entrada.entrada.replace(/\D/g, "")) / 100
            : Number(entrada.saida.replace(/\D/g, "")) / 100,
          tipoDeTransacao: entrada.entrada ? ("ENTRADA" as "ENTRADA") : ("SAIDA" as "SAIDA"),
          idFornecedor: entrada.fornecedorSelecionado?.value ?? null,
          rubricaContabil: entrada.rubricaContabil || null,
          idContabil: rubricaContabilSelecionada?.value ?? null, 
        };
      
        try {
          await createExtrato(novoExtrato);
          alert("Extrato inserido com sucesso!");
      
          setEntrada({
            id: Date.now(),
            data: "",
            rubricaSelecionada: "",
            fornecedorSelecionado: null,
            observacao: "",
            nomeNoExtrato: "",
            rubricaContabil: "",
            entrada: "",
            saida: "",
          });
      
          setCategoriaSelecionada(null);
          setRubricaContabilSelecionada(null); // limpar dropdown
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
            currency: "BRL", // ✅ Aqui estava faltando
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
                                options={categoriasFormatadas}
                                selectedValue={categoriaSelecionada ?? { label: "", value: "" }}
                                onSelect={(option) => {
                                    setCategoriaSelecionada({
                                        ...option,
                                        value: Number(option.value),
                                    });
                                }}
                                type="rubrica"
                            />


                        </td>

                        <td className="border px-4 py-2">
                            <CustomDropdown
                                label="Selecione um fornecedor"
                                options={fornecedoresFormatados}
                                selectedValue={entrada.fornecedorSelecionado ?? { label: "", value: "" }}
                                onSelect={handleFornecedorChange}
                                type="fornecedor"
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
                                value={entrada.nomeNoExtrato}
                                onChange={(e) => handleInputChange("nomeNoExtrato", e.target.value)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <CustomDropdown
                                label="Selecione uma rubrica contábil"
                                options={rubricasContabeisFormatadas}
                                selectedValue={rubricaContabilSelecionada ?? { label: "", value: "" }}
                                onSelect={(option) => setRubricaContabilSelecionada({
                                    ...option,
                                    value: Number(option.value),
                                })}
                                type="rubricaContabil"
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

            <div className="mt-4 flex justify-center gap-4">
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={onFechar}
                >
                    Fechar
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={adicionarLinha}>
                    + Adicionar Linha
                </button>
            </div>
        </div>
    );
};

export default InsercaoManual;
