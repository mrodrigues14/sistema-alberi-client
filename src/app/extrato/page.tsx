"use client";

import Navbar from '@/components/Navbar';
import React, { useEffect, useMemo, useState } from 'react';
import { FaFilePdf, FaFileExcel, FaPlusCircle, FaUpload, FaDownload } from 'react-icons/fa';
import InsercaoManual from './components/insercaoManual/insercaoManual';
import Calendario from './components/calendario/calendario';
import TabelaExtrato from './components/tabelaExtrato/tabelaExtrato';
import { useBanco, Banco } from '@/lib/hooks/userBanco';
import { deleteExtrato, useExtratos } from '@/lib/hooks/useExtrato';
import { useClienteContext } from '@/context/ClienteContext';
import { useSaldoInicial } from '@/lib/hooks/useSaldoInicial';
import { Categoria, useCategoriasPorCliente } from '@/lib/hooks/useCategoria';
import { useFornecedoresPorCliente } from '@/lib/hooks/useFornecedor';
import { FaChevronDown } from "react-icons/fa";
import * as XLSX from "xlsx";
import PreviewExtrato from './components/previewExtrato/previewExtrato';
import { parsePdfToPreview } from '@/lib/pdf/parsePdfToPreview';
import { useSubextratos } from '@/lib/hooks/useSubextrato';
import { useBancoContext } from '@/context/BancoContext';
import styles from './page.module.css';

const Extrato: React.FC = () => {
    const { idCliente } = useClienteContext();
    const [showModalRubrica, setShowModalRubrica] = useState(false);
    const [showModalBanco, setShowModalBanco] = useState(false);
    const [showModalFornecedor, setShowModalFornecedor] = useState(false);
    const [showModalSaldoInicial, setShowModalSaldoInicial] = useState(false);
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [dropdownAdicionarAberto, setDropdownAdicionarAberto] = useState(false);
    const [dropdownAcoesAberto, setDropdownAcoesAberto] = useState(false);
    const { bancos, isLoading: loadingBancos, isError: errorBancos, mutate: mutateBancos } = useBanco(
        idCliente ? idCliente : undefined
    );
    const { bancoSelecionado, nomeBancoSelecionado, setBancoSelecionado, setNomeBancoSelecionado } = useBancoContext();
    const [metodoInsercao, setMetodoInsercao] = useState<string>("");
    const [mesSelecionado, setMesSelecionado] = useState<string>("");
    const [anoSelecionado, setAnoSelecionado] = useState<string>("");
    const [loadingDeletar, setLoadingDeletar] = useState(false);
    const [dadosTabela, setDadosTabela] = useState<any[]>([]);
    const shouldFetchData = !!idCliente && !!bancoSelecionado && !!mesSelecionado && !!anoSelecionado;
    const [editandoLote, setEditandoLote] = useState(false);

    const [dados, setDados] = useState<{
        data: string;
        categoria: any;
        fornecedor: any;
        descricao: any;
        nome: any;
        rubricaContabil: any;
        tipo: string;
        valor: string;
    }[]>([]);

    const [mostrarPreview, setMostrarPreview] = useState(false);

    const { extratos, mutate: mutateExtratos } = useExtratos(
        shouldFetchData ? idCliente : undefined,
        shouldFetchData ? bancoSelecionado : undefined,
        shouldFetchData ? mesSelecionado : undefined,
        shouldFetchData ? anoSelecionado : undefined
    );

    const { subextratos, isLoading, isError, mutate: mutateSubextratos } = useSubextratos();

    const { saldoInicial, definidoManualmente, isLoading: loadingSaldo } = useSaldoInicial(
        shouldFetchData ? idCliente : undefined,
        shouldFetchData ? bancoSelecionado : undefined,
        shouldFetchData ? mesSelecionado : undefined,
        shouldFetchData ? anoSelecionado : undefined
    );

    const { categoriasCliente } = useCategoriasPorCliente(idCliente || undefined);
    const { fornecedores } = useFornecedoresPorCliente(idCliente);
    const [selecionados, setSelecionados] = useState<number[]>([]);

    const categoriasFormatadas = useMemo(() => {
        if (!categoriasCliente || categoriasCliente.length === 0) return [];

        const categoriasPai: Categoria[] = categoriasCliente.filter((cat: Categoria) => !cat.idCategoriaPai);
        const categoriasFilhas: Categoria[] = categoriasCliente.filter((cat: Categoria) => cat.idCategoriaPai);

        return categoriasPai
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .flatMap((pai) => {
                const subrubricas = categoriasFilhas
                    .filter((filha) => filha.idCategoriaPai === pai.idcategoria)
                    .sort((a, b) => a.nome.localeCompare(b.nome))
                    .map((filha) => ({
                        label: `   └ ${filha.nome}`,
                        value: filha.idcategoria,
                        disabled: false,
                    }));

                return [
                    { label: pai.nome, value: pai.idcategoria, disabled: subrubricas.length > 0 },
                    ...subrubricas,
                ];
            });
    }, [categoriasCliente]);

    const fornecedoresFormatados = useMemo(() => {
        if (!fornecedores?.length) return [];

        return fornecedores
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((fornecedor) => ({
                label: fornecedor?.nome,
                value: fornecedor?.idfornecedor,
            }));
    }, [fornecedores]);

    const excelDateToJSDate = (serial: any) => {
        if (typeof serial !== "number" || isNaN(serial)) return "";

        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);

        if (isNaN(date_info.getTime())) return "";

        return date_info.toISOString().split("T")[0].split("-").reverse().join("/");
    };

    const formatarValorFinanceiro = (valor: number | string) => {
        if (typeof valor === "string") valor = parseFloat(valor.replace(",", "."));
        return Number(valor).toFixed(2).replace(".", ",");
    };

    const handleFile = async (file: File) => {
        try {
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                const bankHint = nomeBancoSelecionado?.toLowerCase().includes('itau') ? 'itau'
                  : nomeBancoSelecionado?.toLowerCase().includes('brasil') ? 'bb'
                  : nomeBancoSelecionado?.toLowerCase().includes('infinit') ? 'infinitpay'
                  : undefined;
                const result = await parsePdfToPreview(file, bankHint);
                setDados(result.linhas);
                setMostrarPreview(true);
            } else {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const processado = jsonData.slice(1).map((row) => {
                    if (row.every((cell) => cell === undefined || cell === null || cell === "")) return null;

                    const extrair = (cell: any) => (typeof cell === "object" && cell?.v !== undefined ? cell.v : cell || "");

                    const valorData = extrair(row[0]);
                    const data = typeof valorData === "number" ? excelDateToJSDate(valorData) : "";
                    const categoria = extrair(row[1]);
                    const fornecedor = extrair(row[2]);
                    const nome = extrair(row[3]);
                    const descricao = extrair(row[4]);
                    const rubricaContabil = extrair(row[5]);
                    const valorEntrada = row[6] ? formatarValorFinanceiro(row[6]) : "";
                    const valorSaida = row[7] ? formatarValorFinanceiro(row[7]) : "";
                    const tipo = valorEntrada ? "entrada" : valorSaida ? "saida" : "";

                    return {
                        data,
                        categoria,
                        fornecedor,
                        descricao,
                        nome,
                        rubricaContabil,
                        tipo,
                        valor: valorEntrada || valorSaida || "",
                    };
                }).filter(Boolean);

                setDados(processado.filter((item): item is {
                    data: string;
                    categoria: any;
                    fornecedor: any;
                    descricao: any;
                    nome: any;
                    rubricaContabil: any;
                    tipo: string;
                    valor: string;
                } => item !== null));
                setMostrarPreview(true);
            }
        } catch (error) {
            console.error("Erro ao processar o arquivo:", error);
        }
    };

    const handleToggleSelecionado = (id: number) => {
        setSelecionados((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelecionarTodos = () => {
        if (selecionados.length === dadosTabela.length) {
            setSelecionados([]);
        } else {
            setSelecionados(dadosTabela.map((row) => row.id));
        }
    };

    const formatarData = (data: string): string => {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    const handleBancoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBancoId = Number(event.target.value);
        const banco = bancos?.find(b => b.idbanco === selectedBancoId);

        if (bancoSelecionado !== selectedBancoId) {
            setBancoSelecionado(selectedBancoId);
            setNomeBancoSelecionado(banco?.nome || null);
        }
    };

    const handleInsercaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMetodoInsercao(event.target.value);
    };

    const handleSelectMonth = (mes: string, ano: string) => {
        if (mes !== mesSelecionado || ano !== anoSelecionado) {
            setMesSelecionado(mes);
            setAnoSelecionado(ano);
        }
    };

    const handleDeletarSelecionados = async () => {
        setLoadingDeletar(true);
        try {
            await Promise.all(selecionados.map(id => deleteExtrato(id)));
            setSelecionados([]);
            await mutateExtratos();
            mutateSubextratos?.();
        } catch (error) {
            console.error("Erro ao deletar extratos:", error);
        } finally {
            setLoadingDeletar(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedBanco = sessionStorage.getItem("bancoSelecionado");
            if (storedBanco && bancoSelecionado === null) {
                setBancoSelecionado(Number(storedBanco));
            }
        }
    }, []);

    useEffect(() => {
        if (bancoSelecionado !== null && bancos.length > 0) {
            const banco = bancos.find(b => b.idbanco === bancoSelecionado);
            if (banco) {
                setNomeBancoSelecionado(banco.nome);
                sessionStorage.setItem("nomeBancoSelecionado", banco.nome);
            }
        }
    }, [bancoSelecionado, bancos, setNomeBancoSelecionado]);

    useEffect(() => {
        if (extratos) {
            const getRubricaInfo = (ex: any): { label: string; parentName?: string; childName?: string; idCat?: number | null; idPai?: number | null } => {
                const catId = ex?.idCategoria2?.idcategoria ?? ex?.idCategoria ?? null;
                const nomeFallback = ex?.idCategoria2?.nome;
                if (!catId || !categoriasCliente || categoriasCliente.length === 0) {
                    return { label: nomeFallback || "Sem categoria", parentName: undefined, childName: undefined, idCat: null, idPai: null };
                }
                const cat = categoriasCliente.find((c: Categoria) => c.idcategoria === catId);
                if (!cat) return { label: nomeFallback || "Sem categoria", parentName: undefined, childName: undefined, idCat: null, idPai: null };
                if (cat.idCategoriaPai) {
                    const pai = categoriasCliente.find((c: Categoria) => c.idcategoria === cat.idCategoriaPai);
                    return { label: `${pai?.nome || ""} - ${cat.nome}`.trim(), parentName: pai?.nome, childName: cat.nome, idCat: cat.idcategoria, idPai: pai?.idcategoria ?? null };
                }
                return { label: cat.nome, parentName: cat.nome, childName: undefined, idCat: cat.idcategoria, idPai: null };
            };

            const novosDados = extratos.map((extrato: any) => ({
                id: extrato.idextrato,
                data: formatarData(extrato.data),
                ...(() => {
                    const info = getRubricaInfo(extrato);
                    return {
                        rubricaSelecionada: info.label,
                        rubricaPaiNome: info.parentName,
                        subrubricaNome: info.childName,
                        idCategoriaSelecionada: info.idCat,
                        idCategoriaPaiSelecionada: info.idPai,
                    };
                })(),
                fornecedorSelecionado: extrato.idFornecedor2?.nome || "Não informado",
                observacao: extrato.descricao || "Sem descrição",
                nomeNoExtrato: extrato.nomeNoExtrato || "Sem nome",
                rubricaContabil: extrato.rubricaContabilRelacionada?.nome || "Não definida",
                entrada: extrato.tipoDeTransacao === "ENTRADA" ? extrato.valor.toFixed(2) : "",
                saida: extrato.tipoDeTransacao === "SAIDA" ? extrato.valor.toFixed(2) : "",
                lancamentoFuturo: !!extrato.lancamentoFuturo,
            }));

            if (JSON.stringify(novosDados) !== JSON.stringify(dadosTabela)) {
                setDadosTabela(novosDados);
            }
        }
    }, [extratos, dadosTabela, categoriasCliente]);

    const subextratosRelacionados = useMemo(() => {
        if (!subextratos || !extratos) return [];

        const idsExtratos = new Set(extratos.map((e: { idextrato: any }) => e.idextrato));

        return subextratos
            .filter((s) => idsExtratos.has(s.idExtratoPrincipal))
            .map((s) => ({
                ...s,
                data: formatarData(s.data),
            }));
    }, [subextratos, extratos]);

    useEffect(() => {
        if (!mesSelecionado || !anoSelecionado) {
            const dataAtual = new Date();
            const nomesMeses = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ];

            const mesAtual = nomesMeses[dataAtual.getMonth()];
            const anoAtual = dataAtual.getFullYear().toString();

            setMesSelecionado(mesAtual);
            setAnoSelecionado(anoAtual);
        }
    }, [mesSelecionado, anoSelecionado]);

    // Totais: a receber, a pagar, saldo atual e com previsões
    const {
        totalReceber,
        totalPagar,
        entradasEfetivas,
        saidasEfetivas,
        saldoAtual,
        saldoComPrevisoes,
    } = useMemo(() => {
        const lista = Array.isArray(extratos) ? extratos : [];
        let receber = 0;
        let pagar = 0;
        let entradasNow = 0;
        let saídasNow = 0;

        for (const e of lista) {
            const isFuturo = !!e.lancamentoFuturo;
            const valor = Number(e.valor) || 0;
            const isEntrada = e.tipoDeTransacao === 'ENTRADA';
            if (isFuturo) {
                if (isEntrada) receber += valor; else pagar += valor;
            } else {
                if (isEntrada) entradasNow += valor; else saídasNow += valor;
            }
        }

        const base = Number(saldoInicial || 0);
        const atual = base + entradasNow - saídasNow;
        const comPrev = atual + receber - pagar;

        return {
            totalReceber: receber,
            totalPagar: pagar,
            entradasEfetivas: entradasNow,
            saidasEfetivas: saídasNow,
            saldoAtual: atual,
            saldoComPrevisoes: comPrev,
        };
    }, [extratos, saldoInicial]);

    return (
        <>
            <div>
                <Navbar />
            </div>

            <div className={styles.container}>
                {/* Header com controles */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.controlsRow}>
                            {/* Controles da esquerda */}
                            <div className={styles.leftControls}>
                                <div className={styles.dropdown}>
                                    <button
                                        onClick={() => setDropdownAberto(prev => !prev)}
                                        className={styles.insertButton}
                                    >
                                        Inserir Lançamentos Extrato <FaPlusCircle />
                                    </button>

                                    {dropdownAberto && (
                                        <div className={styles.dropdownMenu}>
                                            {/* Styled options list to replace the native select for a nicer UI */}
                                            <ul
                                                role="menu"
                                                aria-label="Métodos de inserção"
                                                style={{
                                                    listStyle: 'none',
                                                    margin: 0,
                                                    padding: '6px 0',
                                                    minWidth: 220,
                                                    background: '#ffffff',
                                                    borderRadius: 8,
                                                    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                                                    border: '1px solid rgba(0,0,0,0.06)'
                                                }}
                                            >
                                                {[
                                                    { value: '', label: 'Selecione o Método' },
                                                    { value: 'manual', label: 'Inserção Manual' },
                                                    { value: 'importar', label: 'Importar Arquivo' },
                                                    { value: 'automatica', label: 'Inserção Automatizada (PDF)' }
                                                ].map((opt) => {
                                                    const isPlaceholder = opt.value === '';
                                                    const isSelected = metodoInsercao === opt.value && !isPlaceholder;

                                                    return (
                                                        <li
                                                            key={opt.value ?? 'empty'}
                                                            role="menuitem"
                                                            tabIndex={0}
                                                            onClick={() => {
                                                                if (isPlaceholder) {
                                                                    setDropdownAberto(false);
                                                                    return;
                                                                }
                                                                setMetodoInsercao(opt.value);
                                                                setDropdownAberto(false);
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === ' ') {
                                                                    e.preventDefault();
                                                                    if (isPlaceholder) {
                                                                        setDropdownAberto(false);
                                                                        return;
                                                                    }
                                                                    setMetodoInsercao(opt.value);
                                                                    setDropdownAberto(false);
                                                                }
                                                            }}
                                                            style={{
                                                                padding: '8px 14px',
                                                                cursor: isPlaceholder ? 'default' : 'pointer',
                                                                color: isPlaceholder ? '#6B7280' : isSelected ? '#0b5cff' : '#111827',
                                                                background: isSelected ? 'rgba(11,92,255,0.06)' : 'transparent'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (isPlaceholder) e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                                                else e.currentTarget.style.background = isSelected ? 'rgba(11,92,255,0.06)' : 'rgba(0,0,0,0.03)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = isSelected ? 'rgba(11,92,255,0.06)' : 'transparent';
                                                            }}
                                                        >
                                                            {opt.label}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controles do centro */}
                            <div className={styles.centerControls}>
                                <select
                                    className={styles.bankSelect}
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
                            </div>

                            {/* Controles da direita */}
                            <div className={styles.rightControls}>
                                {/* Botão: Adicionar */}
                                <div className={styles.dropdown}>
                                    <button
                                        onClick={() => {
                                            setDropdownAdicionarAberto(!dropdownAdicionarAberto);
                                            setDropdownAcoesAberto(false);
                                        }}
                                        className={styles.actionButton}
                                    >
                                        Adicionar <FaChevronDown size={14} />
                                    </button>

                                    {dropdownAdicionarAberto && (
                                        <div className={styles.actionDropdown}>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    setShowModalRubrica(true);
                                                    setDropdownAdicionarAberto(false);
                                                }}
                                            >
                                                Adicionar Rubricas
                                            </button>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    setShowModalFornecedor(true);
                                                    setDropdownAdicionarAberto(false);
                                                }}
                                            >
                                                Adicionar Fornecedor
                                            </button>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    setShowModalBanco(true);
                                                    setDropdownAdicionarAberto(false);
                                                }}
                                            >
                                                Adicionar Banco
                                            </button>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    setShowModalSaldoInicial(true);
                                                    setDropdownAdicionarAberto(false);
                                                }}
                                            >
                                                Adicionar Saldo Inicial
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Botão: Ações */}
                                <div className={styles.dropdown}>
                                    <button
                                        onClick={() => {
                                            setDropdownAcoesAberto(!dropdownAcoesAberto);
                                            setDropdownAdicionarAberto(false);
                                        }}
                                        className={styles.actionButton}
                                    >
                                        Ações <FaChevronDown size={14} />
                                    </button>

                                    {dropdownAcoesAberto && (
                                        <div className={styles.actionDropdown}>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    handleSelecionarTodos();
                                                    setDropdownAcoesAberto(false);
                                                }}
                                            >
                                                {selecionados.length === dadosTabela.length ? "Desmarcar Todos" : "Selecionar Todos"}
                                            </button>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    handleDeletarSelecionados();
                                                    setDropdownAcoesAberto(false);
                                                }}
                                            >
                                                Deletar Selecionados
                                            </button>
                                            <button
                                                className={styles.actionDropdownItem}
                                                onClick={() => {
                                                    setEditandoLote(true);
                                                    setDropdownAcoesAberto(false);
                                                }}
                                            >
                                                Editar Todas as Linhas
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de importação */}
                {metodoInsercao === "importar" && (
                    <div className={styles.importSection}>
                        <div className={styles.importGrid}>
                            <a
                                href="/template.xlsx"
                                download
                                className={styles.importButton}
                            >
                                <FaDownload />
                                <span>Baixar Template</span>
                            </a>

                            <label
                                htmlFor="upload-arquivo"
                                className={styles.importButton}
                            >
                                <FaUpload />
                                <span>Selecionar Arquivo</span>
                                <input
                                    id="upload-arquivo"
                                    type="file"
                                    accept=".csv,.xlsx,.pdf"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFile(file);
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                )}

                {/* Inserção automatizada (PDF -> parser do banco selecionado) */}
                {metodoInsercao === "automatica" && (
                    <div className={styles.importSection}>
                        <div className={styles.importGrid}>
                            <label htmlFor="upload-automatico" className={styles.importButton}>
                                <FaUpload />
                                <span>Selecionar PDF</span>
                                <input
                                    id="upload-automatico"
                                    type="file"
                                    accept=".pdf"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        console.log('[UI] automatic-upload:onChange', { hasFile: !!file, name: file?.name, type: file?.type, size: file?.size });
                                        if (!file) return;
                                        try {
                                            // map nome banco selecionado -> id do parser
                                            const nameLower = (nomeBancoSelecionado || '').toLowerCase();
                                            const bankId = nameLower.includes('itau') ? 'itau'
                                                : nameLower.includes('brasil') ? 'bb'
                                                : nameLower.includes('infinite') ? 'infinitepay'
                                                : undefined;
                                            console.log('[UI] automatic-upload:bankHint', { nomeBancoSelecionado, bankId });
                                            const result = await parsePdfToPreview(file, bankId);
                                            console.log('[UI] automatic-upload:parseResult', { linhas: result.linhas.length, warnings: result.warnings });
                                            setDados(result.linhas);
                                            setMostrarPreview(true);
                                        } catch (err) {
                                            console.error('Falha no parser automático:', err);
                                            alert('Não foi possível processar o PDF automaticamente.');
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                )}

                {/* Seção de inserção manual */}
                {metodoInsercao === "manual" && (
                    <div className={styles.manualSection}>
                        <h2 className={styles.manualTitle}>Inserção Manual</h2>
                        <InsercaoManual
                            idCliente={idCliente}
                            bancoSelecionado={bancoSelecionado}
                            onFechar={() => setMetodoInsercao("")}
                        />
                    </div>
                )}

                {/* Calendário */}
                <div className={styles.calendarSection}>
                    <Calendario onSelectMonth={handleSelectMonth} />
                </div>

                {/* Resumo financeiro visível no topo */}
                {shouldFetchData && (
                    <div className={styles.summaryWrapper}>
                        <div className={styles.summaryGrid}>
                            <div className={`${styles.summaryCard} ${styles.cardInicial}`}>
                                <span className={styles.summaryLabel}>Saldo inicial</span>
                                <strong className={styles.summaryValue}>
                                    {Number(saldoInicial || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>

                            <div className={`${styles.summaryCard} ${styles.cardReceber}`}>
                                <span className={styles.summaryLabel}>A receber</span>
                                <strong className={`${styles.summaryValue} ${styles.positivo}`}>
                                    {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>

                            <div className={`${styles.summaryCard} ${styles.cardPagar}`}>
                                <span className={styles.summaryLabel}>A pagar</span>
                                <strong className={`${styles.summaryValue} ${totalPagar > 0 ? styles.negativo : ''}`}>
                                    {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>

                            <div className={`${styles.summaryCard} ${styles.cardAtual}`}>
                                <span className={styles.summaryLabel}>Saldo atual</span>
                                <strong className={styles.summaryValue}>
                                    {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>

                            <div className={`${styles.summaryCard} ${styles.cardPrev} ${styles.spanLg2}`}>
                                <span className={styles.summaryLabel}>Saldo com previsões</span>
                                <strong className={styles.summaryValue}>
                                    {saldoComPrevisoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </strong>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conteúdo principal */}
                <div className={styles.mainContent}>
                    <TabelaExtrato
                        dados={dadosTabela}
                        saldoInicial={saldoInicial}
                        definidoManualmente={definidoManualmente}
                        selecionados={selecionados}
                        onToggleSelecionado={handleToggleSelecionado}
                        onSelecionarTodos={handleSelecionarTodos}
                        categoriasFormatadas={categoriasFormatadas}
                        fornecedoresFormatados={fornecedoresFormatados}
                        banco={nomeBancoSelecionado ?? undefined}
                        mesSelecionado={mesSelecionado}
                        anoSelecionado={anoSelecionado}
                        subextratos={subextratosRelacionados}
                        onAtualizarSubextratos={mutateSubextratos}
                        editandoLote={editandoLote}
                        setEditandoLote={setEditandoLote}
                        onAtualizarExtratos={mutateExtratos}
                    />
                </div>
            </div>

            {/* Modais */}
            {showModalBanco && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Adicionar Banco</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModalBanco(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <iframe src="/banco" className={styles.modalIframe} />
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowModalBanco(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModalRubrica && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Adicionar Rubrica</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModalRubrica(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <iframe src="/categoria" className={styles.modalIframe} />
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowModalRubrica(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModalFornecedor && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Adicionar Fornecedor</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModalFornecedor(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <iframe src="/fornecedor" className={styles.modalIframe} />
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowModalFornecedor(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModalSaldoInicial && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Adicionar Saldo Inicial</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setShowModalSaldoInicial(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <iframe
                                src={`/saldoInicial?idBanco=${bancoSelecionado}&idCliente=${idCliente}&mes=${mesSelecionado}&ano=${anoSelecionado}`}
                                className={styles.modalIframe}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowModalSaldoInicial(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview do extrato */}
            {mostrarPreview && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Pré-visualização do Extrato</h2>
                            <button
                                className={styles.modalClose}
                                onClick={() => setMostrarPreview(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <PreviewExtrato
                                dados={dados}
                                idCliente={idCliente!}
                                idBanco={bancoSelecionado!}
                                onImportarFinalizado={() => setMostrarPreview(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay */}
            {loadingDeletar && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingContent}>
                        <div className={styles.spinner}></div>
                        <span>Deletando selecionados...</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default Extrato;
