"use client";

import Navbar from '@/components/Navbar';
import React, { useEffect, useMemo, useState } from 'react';
import { FaFilePdf, FaFileExcel, FaPlusCircle, FaUpload, FaDownload } from 'react-icons/fa'; // Ícones de PDF e Excel
import InsercaoManual from './components/insercaoManual/insercaoManual';
import Calendario from './components/calendario/calendario';
import TabelaExtrato from './components/tabelaExtrato/tabelaExtrato';
import { useBanco, Banco } from '@/lib/hooks/userBanco';
import { useExtratos } from '@/lib/hooks/useExtrato';
import { useClienteContext } from '@/context/ClienteContext';
import { useSaldoInicial } from '@/lib/hooks/useSaldoInicial';
import { Categoria, useCategoriasPorCliente } from '@/lib/hooks/useCategoria';
import { useFornecedoresPorCliente } from '@/lib/hooks/useFornecedor';
import { FaChevronDown } from "react-icons/fa";
import * as XLSX from "xlsx";
import PreviewExtrato from './components/previewExtrato/previewExtrato';
import { useSubextratos } from '@/lib/hooks/useSubextrato';

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
    const [bancoSelecionado, setBancoSelecionado] = useState<number | null>(null);
    const [nomeBancoSelecionado, setNomeBancoSelecionado] = useState<string | null>(null);
    const [metodoInsercao, setMetodoInsercao] = useState<string>("");
    const [mesSelecionado, setMesSelecionado] = useState<string>("");
    const [anoSelecionado, setAnoSelecionado] = useState<string>("");
    const [dadosTabela, setDadosTabela] = useState<any[]>([]);
    const shouldFetchData = !!idCliente && !!bancoSelecionado && !!mesSelecionado && !!anoSelecionado;
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
    const { extratos } = useExtratos(
        shouldFetchData ? idCliente : undefined,
        shouldFetchData ? bancoSelecionado : undefined,
        shouldFetchData ? mesSelecionado : undefined,
        shouldFetchData ? anoSelecionado : undefined
    );

    const { subextratos, isLoading, isError, mutate: mutateSubextratos } = useSubextratos();

    const { saldoInicial, isLoading: loadingSaldo } = useSaldoInicial(
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

    const fornecedoresFormatados = useMemo(() => {
        if (!fornecedores?.length) return [];

        return fornecedores
            .sort((a, b) => a.nome.localeCompare(b.nome)) // 🔹 Ordena os fornecedores por nome
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
                const nome = extrair(row[2]);
                const descricao = extrair(row[3]);
                const fornecedor = extrair(row[4]);
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
            setMostrarPreview(true); // <- aqui mostra o modal
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
    /** ✅ Atualiza o banco selecionado e salva no sessionStorage **/
    const handleBancoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBancoId = Number(event.target.value);
        const banco = bancos?.find(b => b.idbanco === selectedBancoId);

        if (bancoSelecionado !== selectedBancoId) {
            setBancoSelecionado(selectedBancoId);
            setNomeBancoSelecionado(banco?.nome || null);

            if (typeof window !== "undefined") {
                sessionStorage.setItem("bancoSelecionado", String(selectedBancoId));
                sessionStorage.setItem("nomeBancoSelecionado", banco?.nome || "");
            }
        }
    };


    /** ✅ Atualiza o método de inserção **/
    const handleInsercaoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMetodoInsercao(event.target.value);
    };


    const handleSelectMonth = (mes: string, ano: string) => {
        if (mes !== mesSelecionado || ano !== anoSelecionado) {
            setMesSelecionado(mes);
            setAnoSelecionado(ano);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                rubricaContabil: extrato.rubricaContabil || "Não definida",
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
            <div className="fixed top-0 left-0 w-full z-10">
                <Navbar />
                <div className="mt-5 w-full px-10 flex justify-between items-start gap-4 flex-wrap">
                    {/* Esquerda: Botão de Inserir Lançamento */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownAberto(prev => !prev)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                        >
                            Inserir Lançamentos Extrato <FaPlusCircle />
                        </button>

                        {dropdownAberto && (
                            <div className="absolute mt-2 bg-white border rounded shadow-md p-4 min-w-[250px] z-50">
                                <select
                                    className="w-full px-3 py-2 border rounded mb-2"
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

                    {/* Centro: Seletor de banco */}
                    <div className="flex-1 flex justify-center">
                        <select
                            className="px-4 py-2 border rounded shadow-md min-w-[250px]"
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

                    {/* Direita: Adicionar e Ações */}
                    <div className="flex items-center gap-4">
                        {/* Botão: Adicionar */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setDropdownAdicionarAberto(!dropdownAdicionarAberto);
                                    setDropdownAcoesAberto(false);
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-100 transition flex items-center gap-2"
                            >
                                Adicionar <FaChevronDown size={14} />
                            </button>

                            {dropdownAdicionarAberto && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-52 z-50">
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setShowModalRubrica(true);
                                            setDropdownAdicionarAberto(false);
                                        }}
                                    >
                                        Adicionar Rubricas
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setShowModalFornecedor(true);
                                            setDropdownAdicionarAberto(false);
                                        }}
                                    >
                                        Adicionar Fornecedor
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setShowModalBanco(true);
                                            setDropdownAdicionarAberto(false);
                                        }}
                                    >
                                        Adicionar Banco
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
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
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setDropdownAcoesAberto(!dropdownAcoesAberto);
                                    setDropdownAdicionarAberto(false);
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-100 transition flex items-center gap-2"
                            >
                                Ações <FaChevronDown size={14} />
                            </button>

                            {dropdownAcoesAberto && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-64 z-50">
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                                        onClick={() => {
                                            handleSelecionarTodos();
                                            setDropdownAcoesAberto(false);
                                        }}
                                    >
                                        {selecionados.length === dadosTabela.length ? "Desmarcar Todos" : "Selecionar Todos"}
                                    </button>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                                        Deletar Selecionados
                                    </button>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                                        Editar Todas as Linhas
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {metodoInsercao === "importar" && (
                    <div className="flex flex-col gap-4 mt-4">

                        {/* Botão de Download */}
                        <a
                            href="/template.xlsx"
                            download
                            className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
                        >
                            <FaDownload className="text-gray-500 text-lg" />
                            <span className="text-gray-700 font-medium">Baixar Template</span>
                        </a>


                        {/* Botão de Upload de Arquivo */}
                        <label
                            htmlFor="upload-arquivo"
                            className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-blue-50 border border-blue-300 text-blue-800 rounded-lg shadow-sm hover:bg-blue-100 transition-all cursor-pointer"
                        >
                            <FaUpload className="text-blue-600 text-lg" />
                            <span className="font-medium">Selecionar Arquivo</span>
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
                )}


                {metodoInsercao === "manual" && (
                    <div className="p-6 border rounded shadow-md mt-6">
                        <h2 className="text-xl font-bold mb-4">Inserção Manual</h2>
                        <InsercaoManual
                            idCliente={idCliente}
                            bancoSelecionado={bancoSelecionado}
                        />

                    </div>
                )}


                <div className="mt-5 flex flex-col items-center space-y-4 px-4">
                    <Calendario onSelectMonth={handleSelectMonth} />
                </div>

                <div className=" w-full px-10 overflow-auto max-h-[80vh]">

                    <TabelaExtrato
                        dados={dadosTabela}
                        saldoInicial={saldoInicial}
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
                    />

                </div>

                {showModalBanco && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[800px]">
                            <h2 className="text-xl font-bold mb-4">Adicionar Banco</h2>
                            <iframe src="/banco" className="w-full h-[600px] border-none"></iframe>
                            <button
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => setShowModalBanco(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}

                {showModalRubrica && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[800px]">
                            <h2 className="text-xl font-bold mb-4">Adicionar Rubrica</h2>
                            <iframe src="/categoria" className="w-full h-[600px] border-none"></iframe>
                            <button
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => setShowModalRubrica(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}

                {showModalFornecedor && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[800px]">
                            <h2 className="text-xl font-bold mb-4">Adicionar Rubrica</h2>
                            <iframe src="/fornecedor" className="w-full h-[600px] border-none"></iframe>
                            <button
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => setShowModalFornecedor(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
                {showModalSaldoInicial && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[800px]">
                            <h2 className="text-xl font-bold mb-4">Adicionar Saldo Inicial</h2>
                            <iframe
                                src={`/saldoInicial?idBanco=${bancoSelecionado}&idCliente=${idCliente}`}
                                className="w-full h-[600px] border-none"
                            />


                            <button
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => setShowModalSaldoInicial(false)}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                )}

            </div>
            {mostrarPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-5xl h-[90%] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Pré-visualização do Extrato</h2>
                            <button
                                onClick={() => setMostrarPreview(false)}
                                className="text-gray-600 hover:text-red-600 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Passa props obrigatórios: idCliente, idBanco e função de fechamento */}
                        <PreviewExtrato
                            dados={dados}
                            idCliente={idCliente!}
                            idBanco={bancoSelecionado!}
                            onImportarFinalizado={() => setMostrarPreview(false)}
                        />
                    </div>
                </div>
            )}

        </>
    );
};

export default Extrato;
