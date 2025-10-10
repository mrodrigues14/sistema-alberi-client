"use client";

import React, { useMemo, useState } from "react";
import CustomDropdown from "../dropdown/CustomDropdown";
import { createExtrato, createExtratosLote } from "@/lib/hooks/useExtrato";
import { useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { useFornecedoresPorCliente } from "@/lib/hooks/useFornecedor";
import { useRubricasContabeis } from "@/lib/hooks/useRubricaContabil";
import { FaTimes, FaPlus } from "react-icons/fa";

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
        mesReferencia: "",
        rubricaSelecionada: "",
        fornecedorSelecionado: null as null | { label: string; value: number },
        observacao: "",
        nomeNoExtrato: "",
        rubricaContabil: "",
        juros: "",
        entrada: "",
        saida: "",
        lancamentoFuturo: false,
    });

    // Recorrência
    const [tipoRecorrencia, setTipoRecorrencia] = useState<"nenhuma" | "mensal" | "semanal" | "anual">("nenhuma");
    const [qtdOcorrencias, setQtdOcorrencias] = useState<number>(1);


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

        const normalizarMesReferencia = (valor: string): string | null => {
            if (!valor) return null;
            const v = valor.trim();
            const mmYYYY = v.match(/^(\d{1,2})\/(\d{4})$/);
            if (mmYYYY) {
                const mm = mmYYYY[1].padStart(2, "0");
                const yyyy = mmYYYY[2];
                return `${yyyy}-${mm}`;
            }
            const yyyyMM = v.match(/^(\d{4})-(\d{1,2})$/);
            if (yyyyMM) {
                const yyyy = yyyyMM[1];
                const mm = yyyyMM[2].padStart(2, "0");
                return `${yyyy}-${mm}`;
            }
            return v; // fallback
        };

        const novoExtratoBase = {
            idCliente,
            idBanco: bancoSelecionado,
            idCategoria: categoriaSelecionada.value,
            data: entrada.data.split("/").reverse().join("-"),
            mesReferencia: normalizarMesReferencia(entrada.mesReferencia),
            nomeNoExtrato: entrada.nomeNoExtrato,
            descricao: entrada.observacao,
            valor: entrada.entrada
                ? Number(entrada.entrada.replace(/\D/g, "")) / 100
                : Number(entrada.saida.replace(/\D/g, "")) / 100,
            tipoDeTransacao: entrada.entrada ? ("ENTRADA" as "ENTRADA") : ("SAIDA" as "SAIDA"),
            idFornecedor: entrada.fornecedorSelecionado?.value ?? null,
            rubricaContabil: entrada.rubricaContabil || null,
            idContabil: rubricaContabilSelecionada?.value ?? null,
            juros: entrada.juros ? Number(entrada.juros.replace(/\D/g, "")) / 100 : null,
            lancamentoFuturo: entrada.lancamentoFuturo,
        };

        // Helpers para recorrência
        const parseDDMMYYYY = (s: string): Date | null => {
            const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (!m) return null;
            const d = Number(m[1]);
            const mo = Number(m[2]) - 1;
            const y = Number(m[3]);
            const dt = new Date(y, mo, d);
            if (isNaN(dt.getTime())) return null;
            return dt;
        };
        const toYYYYMMDD = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
        };
        const mesRefFromDate = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            return `${y}-${m}`;
        };
        const addMonthsClamped = (base: Date, n: number): Date => {
            // Clampa dia (28/29/30/31) para evitar estourar no fim do mês
            const day = base.getDate();
            const target = new Date(base.getFullYear(), base.getMonth() + n + 1, 0); // último dia do mês alvo
            const clampedDay = Math.min(day, target.getDate());
            return new Date(base.getFullYear(), base.getMonth() + n, clampedDay);
        };
        const addWeeks = (base: Date, weeks: number) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + weeks * 7);
        const addYearsClamped = (base: Date, n: number) => {
            const day = base.getDate();
            const target = new Date(base.getFullYear() + n, base.getMonth() + 1, 0);
            const clampedDay = Math.min(day, target.getDate());
            return new Date(base.getFullYear() + n, base.getMonth(), clampedDay);
        };

        // Monta occurrences
        const baseDate = parseDDMMYYYY(entrada.data);
        if (!baseDate) {
            alert("Data inválida. Use DD/MM/YYYY");
            return;
        }

        const ocorrencias: any[] = [];
        const total = Math.max(1, Number(qtdOcorrencias || 1));
        for (let i = 0; i < total; i++) {
            let dt = baseDate;
            if (i > 0) {
                if (tipoRecorrencia === "mensal") dt = addMonthsClamped(baseDate, i);
                else if (tipoRecorrencia === "semanal") dt = addWeeks(baseDate, i);
                else if (tipoRecorrencia === "anual") dt = addYearsClamped(baseDate, i);
            }
            const dataISO = toYYYYMMDD(dt);
            const mesRef = normalizarMesReferencia(entrada.mesReferencia) || mesRefFromDate(dt);
            ocorrencias.push({
                ...novoExtratoBase,
                data: dataISO,
                mesReferencia: mesRef,
            });
        }

        try {
            if (ocorrencias.length > 1) {
                await createExtratosLote(ocorrencias as any);
            } else {
                await createExtrato(ocorrencias[0] as any);
            }
            alert("Extrato(s) inserido(s) com sucesso!");

            setEntrada({
                id: Date.now(),
                data: "",
                mesReferencia: "",
                rubricaSelecionada: "",
                fornecedorSelecionado: null,
                observacao: "",
                nomeNoExtrato: "",
                rubricaContabil: "",
                juros: "",
                entrada: "",
                saida: "",
                lancamentoFuturo: false,
            });

            setCategoriaSelecionada(null);
            setRubricaContabilSelecionada(null); // limpar dropdown
            setTipoRecorrencia("nenhuma");
            setQtdOcorrencias(1);
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
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-slate-800">Inserção Manual</h2>
                <button
                    type="button"
                    onClick={onFechar}
                    title="Fechar"
                    aria-label="Fechar inserção manual"
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={18} />
                </button>
            </div>
            <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-blue-700 text-white sticky top-0 z-10">
                        <tr>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[110px]">Data</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[140px]">Mês referência</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[200px]">Rubrica Financeira</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[200px]">Fornecedor</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[180px]">Observação</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[180px]">Nome no Extrato</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[200px]">Rubrica Contábil</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-right min-w-[140px]">Juros e multa</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-right min-w-[140px]">Entrada</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-right min-w-[140px]">Saída</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-center min-w-[140px]">Lançamento futuro</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[150px]">Recorrência</th>
                            <th className="border border-blue-600/40 px-3 py-2 text-left min-w-[120px]">Ocorrências</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="odd:bg-white even:bg-slate-50">
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                                    placeholder="DD/MM/AAAA"
                                    aria-label="Data do lançamento"
                                    value={entrada.data}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                                    placeholder="MM/AAAA ou YYYY-MM"
                                    aria-label="Mês de referência"
                                    value={entrada.mesReferencia}
                                    onChange={(e) => handleInputChange("mesReferencia", e.target.value)}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <div className="min-w-[200px]">
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
                                </div>
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <div className="min-w-[200px]">
                                    <CustomDropdown
                                        label="Selecione um fornecedor"
                                        options={fornecedoresFormatados}
                                        selectedValue={entrada.fornecedorSelecionado ?? { label: "", value: "" }}
                                        onSelect={handleFornecedorChange}
                                        type="fornecedor"
                                    />
                                </div>
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                                    placeholder="Observação"
                                    aria-label="Observação"
                                    value={entrada.observacao}
                                    onChange={(e) => handleInputChange("observacao", e.target.value)}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
                                    placeholder="Nome no Extrato"
                                    aria-label="Nome no extrato"
                                    value={entrada.nomeNoExtrato}
                                    onChange={(e) => handleInputChange("nomeNoExtrato", e.target.value)}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <div className="min-w-[200px]">
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
                                </div>
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle text-right">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right placeholder-slate-400"
                                    placeholder="Juros"
                                    aria-label="Juros e multa"
                                    value={entrada.juros}
                                    onChange={(e) => handleInputChange("juros", formatarMoeda(e.target.value))}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle text-right">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right placeholder-slate-400"
                                    placeholder="Entrada"
                                    aria-label="Valor de entrada"
                                    value={entrada.entrada}
                                    onChange={(e) => handleInputChange("entrada", formatarMoeda(e.target.value))}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle text-right">
                                <input
                                    type="text"
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right placeholder-slate-400"
                                    placeholder="Saída"
                                    aria-label="Valor de saída"
                                    value={entrada.saida}
                                    onChange={(e) => handleInputChange("saida", formatarMoeda(e.target.value))}
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle text-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-blue-600"
                                    checked={entrada.lancamentoFuturo}
                                    onChange={(e) => handleInputChange("lancamentoFuturo", e.target.checked)}
                                    title="Marcar como lançamento futuro"
                                />
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <select
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={tipoRecorrencia}
                                    onChange={(e) => setTipoRecorrencia(e.target.value as any)}
                                    aria-label="Tipo de recorrência"
                                >
                                    <option value="nenhuma">Nenhuma</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensal">Mensal</option>
                                    <option value="anual">Anual</option>
                                </select>
                            </td>
                            <td className="border border-slate-200 px-3 py-2 align-middle">
                                <input
                                    type="number"
                                    min={1}
                                    className="w-full h-9 px-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={qtdOcorrencias}
                                    onChange={(e) => setQtdOcorrencias(Math.max(1, Number(e.target.value || 1)))}
                                    aria-label="Quantidade de ocorrências"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-3">
                <button
                    className="h-10 px-4 inline-flex items-center gap-2 rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
                    onClick={onFechar}
                >
                    <FaTimes />
                    Fechar
                </button>
                <button
                    className="h-10 px-4 inline-flex items-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                    onClick={adicionarLinha}
                >
                    <FaPlus />
                    Adicionar Linha
                </button>
            </div>
        </div>
    );
};

export default InsercaoManual;
