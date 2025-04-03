"use client";

import Navbar from '@/components/Navbar';
import React, { useEffect, useMemo, useState } from 'react';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; // Ícones de PDF e Excel
import InsercaoManual from './components/insercaoManual/insercaoManual';
import Calendario from './components/calendario/calendario';
import TabelaExtrato from './components/tabelaExtrato/tabelaExtrato';
import { useBanco, Banco } from '@/lib/hooks/userBanco';
import { useExtratos } from '@/lib/hooks/useExtrato';
import { useClienteContext } from '@/context/ClienteContext';
import { useSaldoInicial } from '@/lib/hooks/useSaldoInicial';
import { Categoria, useCategoriasPorCliente } from '@/lib/hooks/useCategoria';
import { useFornecedoresPorCliente } from '@/lib/hooks/useFornecedor';

const Extrato: React.FC = () => {
    const { idCliente } = useClienteContext();
    const [showModalRubrica, setShowModalRubrica] = useState(false);
    const [showModalBanco, setShowModalBanco] = useState(false);
    const [showModalFornecedor, setShowModalFornecedor] = useState(false);

    const { bancos, isLoading: loadingBancos, isError: errorBancos, mutate: mutateBancos } = useBanco(
        idCliente ? idCliente : undefined
    );
    const [bancoSelecionado, setBancoSelecionado] = useState<number | null>(null);
    const [metodoInsercao, setMetodoInsercao] = useState<string>("");
    const [mesSelecionado, setMesSelecionado] = useState<string>("");
    const [anoSelecionado, setAnoSelecionado] = useState<string>("");
    const [dadosTabela, setDadosTabela] = useState<any[]>([]);

    const shouldFetchData = !!idCliente && !!bancoSelecionado && !!mesSelecionado && !!anoSelecionado;

    const { extratos, isLoading, isError, mutate } = useExtratos(
        shouldFetchData ? idCliente : undefined,
        shouldFetchData ? bancoSelecionado : undefined,
        shouldFetchData ? mesSelecionado : undefined,
        shouldFetchData ? anoSelecionado : undefined
    );

    const { saldoInicial, isLoading: loadingSaldo } = useSaldoInicial(
        shouldFetchData ? idCliente : undefined,
        shouldFetchData ? bancoSelecionado : undefined,
        shouldFetchData ? mesSelecionado : undefined,
        shouldFetchData ? anoSelecionado : undefined
    );

    const { categoriasCliente } = useCategoriasPorCliente(idCliente || undefined);
    const { fornecedores } = useFornecedoresPorCliente();
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
        const selectedBanco = Number(event.target.value);
        if (bancoSelecionado !== selectedBanco) {
            setBancoSelecionado(selectedBanco);
            if (typeof window !== "undefined") {
                sessionStorage.setItem("bancoSelecionado", String(selectedBanco));
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
        console.log(extratos)
        if (extratos) {
            const novosDados = extratos.map((extrato: any) => ({
                id: extrato.idextrato,
                data: formatarData(extrato.data),
                rubricaSelecionada: extrato.categoria || "Sem categoria",
                fornecedorSelecionado: extrato.fornecedor || "Não informado",
                observacao: extrato.descricao || "Sem descrição",
                nomeNoExtrato: extrato.nomeNoExtrato || "Sem nome",
                rubricaContabil: extrato.rubricaContabil || "Não definida",
                entrada: extrato.tipoDeTransacao === "ENTRADA" ? extrato.valor.toFixed(2) : "",
                saida: extrato.tipoDeTransacao === "SAIDA" ? extrato.valor.toFixed(2) : "",
            }));

            // Só atualiza se os dados realmente mudaram
            if (JSON.stringify(novosDados) !== JSON.stringify(dadosTabela)) {
                setDadosTabela(novosDados);
            }
        }
    }, [extratos]);


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
            </div>
            <div className="mt-20 flex flex-col items-center space-y-4 px-4">
                <div className="flex space-x-4 mt-8">
                    <select
                        className="px-4 py-2 border rounded shadow-md"
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


                    <select
                        className="px-4 py-2 border rounded shadow-md"
                        value={metodoInsercao}
                        onChange={handleInsercaoChange}
                    >
                        <option value="">Selecione o Método de Inserção</option>
                        <option value="manual">Inserção Manual</option>
                        <option value="importar">Importar Arquivo</option>
                    </select>

                    {metodoInsercao === 'importar' && (
                        <button className="px-4 py-2 border rounded shadow-md hover:bg-gray-100 transition">
                            Download Template
                        </button>
                    )}
                </div>

                <div className="flex space-x-4 mt-8">
                    <button className="flex items-center justify-center w-12 h-12 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md" title="Gerar PDF">
                        <FaFilePdf size={24} />
                    </button>
                    <button className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-md" title="Gerar Excel">
                        <FaFileExcel size={24} />
                    </button>
                </div>

                {/* Inserção Manual será exibida aqui se selecionado */}
                {metodoInsercao === "manual" && (
                    <div className="p-6 border rounded shadow-md mt-6">
                        <h2 className="text-xl font-bold mb-4">Inserção Manual</h2>
                        <InsercaoManual
                            idCliente={idCliente}
                            bancoSelecionado={bancoSelecionado}
                        />

                    </div>
                )}
            </div>


            <div className="mt-16 w-full flex justify-between items-center px-10">
                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        onClick={() => setShowModalRubrica(true)}
                    >
                        Adicionar Rubricas
                    </button>

                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        onClick={() => setShowModalFornecedor(true)}
                    >
                        Adicionar Fornecedor
                    </button>
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        onClick={() => setShowModalBanco(true)}
                    >
                        Adicionar Banco
                    </button>

                </div>

                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        onClick={handleSelecionarTodos}
                    >
                        {selecionados.length === dadosTabela.length ? "Desmarcar Todos" : "Selecionar Todos"}
                    </button>

                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Deletar Selecionados
                    </button>
                    <button className="px-4 py-2 border rounded hover:bg-gray-100 transition">
                        Editar Todas as Linhas
                    </button>
                </div>
            </div>
            <div className="mt-20 flex flex-col items-center space-y-4 px-4">
                <Calendario onSelectMonth={handleSelectMonth} />
            </div>

            <div className="mt-8 w-full px-10">
                <TabelaExtrato
                    dados={dadosTabela}
                    saldoInicial={saldoInicial}
                    selecionados={selecionados}
                    onToggleSelecionado={handleToggleSelecionado}
                    onSelecionarTodos={handleSelecionarTodos}
                    categoriasFormatadas={categoriasFormatadas}
                    fornecedoresFormatados={fornecedoresFormatados}
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


        </>
    );
};

export default Extrato;
