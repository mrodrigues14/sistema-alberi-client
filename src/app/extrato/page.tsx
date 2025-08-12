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
    }, [bancoSelecionado, bancos]);

    useEffect(() => {
        if (extratos) {
            const novosDados = extratos.map((extrato: any) => ({
                id: extrato.idextrato,
                data: formatarData(extrato.data),
                rubricaSelecionada: extrato.idCategoria2?.nome || "Sem categoria",
                fornecedorSelecionado: extrato.idFornecedor2?.nome || "Não informado",
                observacao: extrato.descricao || "Sem descrição",
                nomeNoExtrato: extrato.nomeNoExtrato || "Sem nome",
                rubricaContabil: extrato.rubricaContabilRelacionada?.nome || "Não definida",
                entrada: extrato.tipoDeTransacao === "ENTRADA" ? extrato.valor.toFixed(2) : "",
                saida: extrato.tipoDeTransacao === "SAIDA" ? extrato.valor.toFixed(2) : "",
            }));

            if (JSON.stringify(novosDados) !== JSON.stringify(dadosTabela)) {
                setDadosTabela(novosDados);
            }
        }
    }, [extratos]);

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
    }, []);

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
                                            <select
                                                className={styles.dropdownSelect}
                                                value={metodoInsercao}
                                                onChange={(e) => {
                                                    handleInsercaoChange(e);
                                                    setDropdownAberto(false);
                                                }}
                                            >
                                                <option value="">Selecione o Método</option>
                                                <option value="manual">Inserção Manual</option>
                                                <option value="importar">Importar Arquivo</option>
                                            </select>
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
                                    accept=".csv,.xlsx"
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
