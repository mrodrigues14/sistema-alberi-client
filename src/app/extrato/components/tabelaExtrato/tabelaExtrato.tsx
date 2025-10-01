"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaDivide, FaEdit, FaHandPointer, FaPaperclip, FaSave, FaTrash, FaTimes, FaSort, FaSortUp, FaSortDown, FaFilter, FaCheck, FaGripVertical, FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CustomDropdown from "../dropdown/CustomDropdown";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Subextrato } from "../../../../../types/Subextrato";
import { criarSubextrato } from "@/lib/hooks/useSubextrato";
import { deleteExtrato, updateExtrato, reorderExtratos } from "@/lib/hooks/useExtrato";
import { Extrato } from "../../../../../types/Extrato";
import Anexos from "../anexos/Anexos";
import { useExtratoAnexos, getExtratoAnexo, ExtratoAnexo } from "@/lib/hooks/useExtratoAnexos";
import { useSaldoInicial, upsertSaldoInicial } from "@/lib/hooks/useSaldoInicial";
import { useClienteContext } from "@/context/ClienteContext";
import { useBancoContext } from "@/context/BancoContext";

interface Props {
  dados: any[];
  subextratos?: Subextrato[];
  saldoInicial: number;
  definidoManualmente?: boolean;
  mesAno?: string;
  banco?: string;
  selecionados: number[];
  onToggleSelecionado: (id: number) => void;
  onSelecionarTodos: () => void;
  onAtualizarSubextratos?: () => void;
  categoriasFormatadas: any[];
  fornecedoresFormatados: any[];
  mesSelecionado: string;
  anoSelecionado: string;
  editandoLote: boolean;
  setEditandoLote: (value: boolean) => void;
  onAtualizarExtratos: () => void;
}



const TabelaExtrato: React.FC<Props> = ({
  dados,
  subextratos,
  saldoInicial,
  definidoManualmente,
  banco,
  selecionados,
  onToggleSelecionado,
  onSelecionarTodos,
  onAtualizarSubextratos,
  categoriasFormatadas,
  fornecedoresFormatados,
  mesSelecionado,
  anoSelecionado,
  editandoLote,
  setEditandoLote,
  onAtualizarExtratos,
}) => {
  const [saldoFinal, setSaldoFinal] = useState(saldoInicial);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  // Indices (na lista renderizada) das linhas que formam o bloco sendo arrastado em modo multi-seleção
  const dragBlockIndices = useRef<number[] | null>(null);
  const [ordem, setOrdem] = useState<{ coluna: string; direcao: "asc" | "desc" } | null>(null);
  const [dadosOrdenados, setDadosOrdenados] = useState<any[]>([]);
  const [filtroRubricas, setFiltroRubricas] = useState<string[]>([]);
  const [filtroFornecedores, setFiltroFornecedores] = useState<string[]>([]);
  const [filtroSubrubricas, setFiltroSubrubricas] = useState<string[]>([]);
  const [filtroRubricasContabeis, setFiltroRubricasContabeis] = useState<string[]>([]);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [subdividindoIndex, setSubdividindoIndex] = useState<number | null>(null);
  const [novoSubextrato, setNovoSubextrato] = useState<any>({});
  const [anexosVisiveis, setAnexosVisiveis] = useState(false);
  const [extratoSelecionado, setExtratoSelecionado] = useState<number | null>(null);
  const [dadosEditadosLote, setDadosEditadosLote] = useState<Record<number, any>>({});
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
  const { anexos, mutate } = useExtratoAnexos();
  const { idCliente } = useClienteContext();
  const { bancoSelecionado, nomeBancoSelecionado, setBancoSelecionado, setNomeBancoSelecionado } = useBancoContext();
  const [paginaCarregada, setPaginaCarregada] = useState(false);
  const [isLoadingSetSaldo, setIsLoadingSetSaldo] = useState(false);
  const [baixandoAnexoId, setBaixandoAnexoId] = useState<number | null>(null);

  const downloadBuffer = (bufferData: number[], filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    const mimeType = mimeTypes[ext || ""] || "application/octet-stream";
    const blob = new Blob([new Uint8Array(bufferData)], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAnexo = async (anexo: ExtratoAnexo) => {
    try {
      setBaixandoAnexoId(anexo.idAnexo);
      let buffer = anexo.arquivo?.data;
      let nome = anexo.nomeArquivo;
      if (!buffer) {
        const full = await getExtratoAnexo(anexo.idAnexo);
        buffer = full.arquivo?.data;
        nome = full.nomeArquivo || nome;
      }
      if (!buffer) {
        alert("Arquivo indisponível para download.");
        return;
      }
      downloadBuffer(buffer, nome);
    } catch (e) {
      console.error("Erro ao baixar anexo:", e);
      alert("Erro ao baixar anexo.");
    } finally {
      setBaixandoAnexoId(null);
    }
  };

  let saldoAcumulado = saldoInicial ?? 0;

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData(dados[index]);
  };

  function formatarDataParaISO(data: string): string {
    const partes = data.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) return data;

    return '';
  }

  const handleSave = async (index: number) => {
    try {
      const row = dados[index];
      const normalizeLabel = (s: string | undefined) => (s || '')
        .replace(/^\s*└\s*/, '') // remove prefixo visual
        .normalize('NFD') // remove acentos
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^\p{L}\p{N}]+/gu, '')
        .toLowerCase()
        .trim();
      const categoriaSelecionada = categoriasFormatadas.find(
        (opt) => normalizeLabel(opt.label) === normalizeLabel(editData.rubricaSelecionada)
      );
      const fornecedorSelecionado = fornecedoresFormatados.find(
        (opt) => opt.label === editData.fornecedorSelecionado
      );

      const payload: Partial<Extrato> = {
        data: formatarDataParaISO(editData.data),
        nomeNoExtrato: editData.nomeNoExtrato,
        rubricaContabil: editData.rubricaContabil,
        descricao: editData.observacao,
        idCategoria: categoriaSelecionada?.value ?? null,
        idFornecedor: fornecedorSelecionado?.value ?? null,
        tipoDeTransacao: editData.entrada ? "ENTRADA" : "SAIDA",
        valor: parseFloat(editData.entrada || editData.saida || "0"),
      };

      await updateExtrato(row.id, payload);

      // Força atualização da tabela para refletir as mudanças
      onAtualizarExtratos();

      setEditIndex(null);
      alert("Extrato atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar extrato:", err);
      alert("Erro ao atualizar extrato: " + (err as Error).message);
    }
  };

  const handleDeletarLinha = async (id: number) => {
    setDeletandoId(id);
    try {
      await deleteExtrato(id);
      onAtualizarExtratos();
    } catch (error) {
      console.error("Erro ao deletar extrato:", error);
      alert("Erro ao deletar extrato.");
    } finally {
      setDeletandoId(null);
    }
  };

  const handleConfirmarLancamento = async (id: number) => {
    setConfirmandoId(id);
    try {
      await updateExtrato(id, { lancamentoFuturo: false });
      onAtualizarExtratos();
    } catch (error) {
      console.error("Erro ao confirmar lançamento:", error);
      alert("Erro ao confirmar lançamento.");
    } finally {
      setConfirmandoId(null);
    }
  };


  const handleCancel = () => {
    setEditIndex(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const formatarMoeda = (valor: string | number) => {
    let numero: number;

    if (typeof valor === "number") {
      numero = valor;
    } else if (typeof valor === "string") {
      const semEspacos = valor.trim();
      const somenteNumeros = parseFloat(semEspacos);

      if (!isNaN(somenteNumeros)) {
        numero = somenteNumeros;
      } else {
        const convertido = parseFloat(valor.replace(/\./g, "").replace(",", "."));
        if (isNaN(convertido)) return "-";
        numero = convertido;
      }
    } else {
      return "-";
    }

    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatarMoedaDigitar = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    const numero = Number(numeros) / 100;

    if (isNaN(numero)) return "";

    return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const extrairNumero = (valor: string) => {
    const numero = valor.replace(/\D/g, "");
    const numeroDividido = Number(numero) / 100
    return numeroDividido;
  };

  const toggleOrdem = (coluna: string) => {
    if (ordem?.coluna === coluna) {
      setOrdem({
        coluna,
        direcao: ordem.direcao === "asc" ? "desc" : "asc",
      });
    } else {
      setOrdem({ coluna, direcao: "asc" });
    }
  };

  const renderTh = (coluna: string, titulo: string) => {
    const isActive = ordem?.coluna === coluna;
    const icone = isActive
      ? ordem.direcao === "asc"
        ? <FaSortUp className="inline ml-1" />
        : <FaSortDown className="inline ml-1" />
      : <FaSort className="inline ml-1 text-gray-300" />;

    return (
      <th
        key={coluna}
        className="border px-2 py-2 cursor-pointer select-none"
        onClick={() => toggleOrdem(coluna)}
      >
        <span className="flex items-center justify-center gap-1">
          {titulo} {icone}
        </span>
      </th>
    );
  };

  function getMesAnoSeguinte(mes: string, ano: string) {
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const idx = meses.indexOf(mes);
    if (idx === -1) return { mes: "Janeiro", ano: String(Number(ano) + 1) };

    const proximoIdx = (idx + 1) % 12;
    const novoAno = proximoIdx === 0 ? String(Number(ano) + 1) : ano;

    return { mes: meses[proximoIdx], ano: novoAno };
  }

  const proximo = getMesAnoSeguinte(mesSelecionado, anoSelecionado);

  const {
    saldoInicial: saldoMesSeguinte,
    definidoManualmente: saldoDefinidoManualmenteMesSeguinte,
    mutate: mutateSaldoMesSeguinte,
  } = useSaldoInicial(
    idCliente ?? undefined,
    bancoSelecionado ?? undefined,
    proximo.mes,
    proximo.ano
  );


  const ultimoSaldoRef = useRef<number | null>(null);

  const parsePtBrToFloat = (valor: string): number => {
    const numero = valor.replace(/\./g, "").replace(",", ".");
    return parseFloat(numero);
  };

  useEffect(() => {
    // Calcula o saldo final do mês ignorando lançamentos futuros
    let saldoCalculado = saldoInicial ?? 0;

    dados.forEach((row) => {
      if (row?.lancamentoFuturo) return; // ignora lançamentos futuros no cálculo
      const entrada = row.entrada ? parseFloat(String(row.entrada).replace(/\D/g, "")) / 100 : 0;
      const saida = row.saida ? parseFloat(String(row.saida).replace(/\D/g, "")) / 100 : 0;
      saldoCalculado += entrada - saida;
    });

    setSaldoFinal(saldoCalculado);
    setPaginaCarregada(true);

  }, [dados, saldoInicial]);

  useEffect(() => {
    const atualizarSaldoMesSeguinte = async () => {
      if (
        paginaCarregada &&
        saldoFinal !== undefined &&
        saldoDefinidoManualmenteMesSeguinte === false &&
        idCliente && idCliente > 0 &&
        bancoSelecionado && bancoSelecionado > 0
      ) {
        setIsLoadingSetSaldo(true); // ✅ só ativa se for executar
        try {
          const proximo = getMesAnoSeguinte(mesSelecionado, anoSelecionado);
          const mesNumero = String(
            [
              "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
              "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
            ].indexOf(proximo.mes) + 1
          ).padStart(2, "0");

          const mesAno = `${proximo.ano}-${mesNumero}`;

          await upsertSaldoInicial({
            idCliente,
            idBanco: bancoSelecionado,
            mesAno,
            saldo: saldoFinal,
            definidoManualmente: false,
          });

          ultimoSaldoRef.current = saldoFinal;
          mutateSaldoMesSeguinte();
        } catch (err) {
          console.error("Erro ao atualizar saldo:", err);
        } finally {
          setIsLoadingSetSaldo(false); // ✅ garante que sempre será desativado
        }
      }
    };

    atualizarSaldoMesSeguinte();
  }, [
    saldoFinal,
    saldoDefinidoManualmenteMesSeguinte,
    dados.length,
    mesSelecionado,
    anoSelecionado,
    idCliente,
    bancoSelecionado,
    paginaCarregada,
    mutateSaldoMesSeguinte,
  ]);



  useEffect(() => {
    const dadosFiltrados = dados.filter(row => {
      // Rubrica (pai): se houver rubricaPaiNome usa ela, senão usa rubricaSelecionada (que já é pai quando não há filha)
      const nomePai = row.rubricaPaiNome || row.rubricaSelecionada;
      const rubricaOk = filtroRubricas.length === 0 || filtroRubricas.includes(nomePai);

      // Subrubrica (filha): filtra pelo nome da filha, se existir no row
      const nomeFilha = row.subrubricaNome || null;
      const subrubricaOk = filtroSubrubricas.length === 0 || (nomeFilha ? filtroSubrubricas.includes(nomeFilha) : false === false && filtroSubrubricas.length === 0);

      const fornecedorOk = filtroFornecedores.length === 0 || filtroFornecedores.includes(row.fornecedorSelecionado);
      const rubricaContabilOk = filtroRubricasContabeis.length === 0 || filtroRubricasContabeis.includes(row.rubricaContabil);

      return rubricaOk && subrubricaOk && fornecedorOk && rubricaContabilOk;
    });

    if (!ordem) {
      // Mesmo sem ordenação específica, garantir que lançamentos futuros fiquem no final
      const dadosOrdenadosPorTipo = dadosFiltrados.sort((a, b) => {
        const aFuturo = a.lancamentoFuturo || false;
        const bFuturo = b.lancamentoFuturo || false;
        
        // Se um é futuro e outro não, o futuro vai para o final
        if (aFuturo && !bFuturo) return 1;
        if (!aFuturo && bFuturo) return -1;
        
        // Se ambos são do mesmo tipo, mantém a ordem original
        return 0;
      });
      
      setDadosOrdenados(dadosOrdenadosPorTipo);
      return;
    }


    const { coluna, direcao } = ordem;

    const ordenado = [...dadosFiltrados].sort((a, b) => {
      // Primeiro, separar lançamentos futuros (previsões) para ficarem sempre no final
      const aFuturo = a.lancamentoFuturo || false;
      const bFuturo = b.lancamentoFuturo || false;
      
      // Se um é futuro e outro não, o futuro vai para o final
      if (aFuturo && !bFuturo) return 1;
      if (!aFuturo && bFuturo) return -1;
      
      // Se ambos são do mesmo tipo (futuros ou não), aplica a ordenação normal
      const valA = a[coluna] || "";
      const valB = b[coluna] || "";

      const numA = parseFloat(valA.toString().replace(/\./g, "").replace(",", "."));
      const numB = parseFloat(valB.toString().replace(/\./g, "").replace(",", "."));
      const isNumeric = !isNaN(numA) && !isNaN(numB);

      if (isNumeric) {
        return direcao === "asc" ? numA - numB : numB - numA;
      }

      return direcao === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

    setDadosOrdenados(ordenado);
  }, [ordem, dados, filtroFornecedores, filtroRubricas, filtroSubrubricas, filtroRubricasContabeis]);



  console.log(dadosOrdenados);
  return (
    <div className="flex justify-center items-center mt-8">
      <div className="w-[5000px] bg-white rounded-lg shadow-lg p-4">

        {editandoLote && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={async () => {
                try {
                  const promises = selecionados.map(async (id) => {
                    const edit = dadosEditadosLote[id];
                    if (!edit) return;
                    const normalizeLabel = (s: string | undefined) => (s || '')
                      .replace(/^\s*└\s*/, '')
                      .normalize('NFD')
                      .replace(/\p{Diacritic}/gu, '')
                      .replace(/[^\p{L}\p{N}]+/gu, '')
                      .toLowerCase()
                      .trim();
                    const categoriaSelecionada = categoriasFormatadas.find(opt => normalizeLabel(opt.label) === normalizeLabel(edit.rubricaSelecionada));
                    const fornecedorSelecionado = fornecedoresFormatados.find(opt => opt.label === edit.fornecedorSelecionado);

                    await updateExtrato(id, {
                      data: formatarDataParaISO(edit.data),
                      nomeNoExtrato: edit.nomeNoExtrato,
                      rubricaContabil: edit.rubricaContabil,
                      descricao: edit.observacao,
                      idCategoria: categoriaSelecionada?.value ?? null,
                      idFornecedor: fornecedorSelecionado?.value ?? null,
                      tipoDeTransacao: edit.entrada ? "ENTRADA" : "SAIDA",
                      valor: parseFloat(edit.entrada || edit.saida || "0"),
                    });
                  });

                  await Promise.all(promises);
                  setEditandoLote(false);
                  setDadosEditadosLote({});
                } catch (err) {
                  console.error("Erro ao salvar em lote:", err);
                }
              }}
            >
              Salvar Alterações
            </button>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => {
                setEditandoLote(false);
                setDadosEditadosLote({});
              }}
            >
              Cancelar
            </button>
          </div>
        )}

        <div className="flex justify-center items-center mt-4">
          <div className="text-center flex-1">
            <h2 className="text-lg font-bold">  Extrato de {mesSelecionado} / {anoSelecionado} - Banco: {banco || "Não informado"}
            </h2>
          </div>
          {/* <div className="flex space-x-4">
            <div className="text-center mb-4">
              <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Inicial
              </div>
              <div className="border px-4 py-2 rounded-b">
                {saldoInicial?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-blue-700 text-white px-4 py-2 rounded-t">
                Saldo Final
              </div>
              <div className="border px-4 py-2 rounded-b">
                {saldoFinal?.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div> */}
        </div>
        <div className="relative inline-block">
          <button
            onClick={() => setFiltrosVisiveis(prev => !prev)}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded shadow hover:bg-blue-800 transition"
          >
            <FaFilter />
            Filtro
          </button>

          {filtrosVisiveis && (
            <div className="absolute left-0 z-50 bg-white text-black mt-2 p-4 rounded shadow-lg w-max max-w-[90vw]">
              <div className="flex justify-between items-center mb-2">
                <strong>Filtros</strong>
                <FaTimes className="cursor-pointer" onClick={() => setFiltrosVisiveis(false)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm max-h-[60vh] overflow-auto">
                {/* Rubrica (apenas pai) */}
                <div>
                  <h4 className="font-semibold mb-1">Rubrica</h4>
                  {[...new Set(dados.map(d => d.rubricaPaiNome || d.rubricaSelecionada))].map((r, i) => (
                    <label key={i} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        value={r}
                        checked={filtroRubricas.includes(r)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFiltroRubricas(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      {r}
                    </label>
                  ))}
                </div>

                {/* Fornecedor */}
                <div>
                  <h4 className="font-semibold mb-1">Fornecedor</h4>
                  {[...new Set(dados.map(d => d.fornecedorSelecionado))].map((f, i) => (
                    <label key={i} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        value={f}
                        checked={filtroFornecedores.includes(f)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFiltroFornecedores(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      {f}
                    </label>
                  ))}
                </div>

                {/* Rubrica Contábil */}
                <div>
                  <h4 className="font-semibold mb-1">Rubrica Contábil</h4>
                  {[...new Set(dados.map(d => d.rubricaContabil))].map((rc, i) => (
                    <label key={i} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        value={rc}
                        checked={filtroRubricasContabeis.includes(rc)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFiltroRubricasContabeis(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      {rc}
                    </label>
                  ))}
                </div>

                {/* Subrubrica (apenas filha da categoria) */}
                <div>
                  <h4 className="font-semibold mb-1">Subrubrica</h4>
                  {[...new Set(dados.map(d => d.subrubricaNome).filter(Boolean))].map((sr: string, i: number) => (
                    <label key={i} className="flex items-center gap-2 mb-1">
                      <input
                        type="checkbox"
                        value={sr}
                        checked={filtroSubrubricas.includes(sr)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFiltroSubrubricas(prev =>
                            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
                          );
                        }}
                      />
                      {sr}
                    </label>
                  ))}
                </div>

              </div>
            </div>
          )}
        </div>



        {/* Tabela */}
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border px-2 py-2 w-8"></th>
              {renderTh("data", "Data")}
              {renderTh("rubricaSelecionada", "Rubrica Financeira")}
              {renderTh("fornecedorSelecionado", "Fornecedor")}
              {renderTh("observacao", "Observação")}
              {renderTh("nomeNoExtrato", "Nome no Extrato")}
              {renderTh("rubricaContabil", "Rubrica Contábil")}
              {renderTh("entrada", "Entrada")}
              {renderTh("saida", "Saída")}
              <th className="border px-2 py-2">Saldo</th>
              <th className="border px-2 py-2">Anexos</th>
              <th className="border px-2 py-2">Ferramentas</th>
            </tr>
          </thead>


          <tbody>
            {dadosOrdenados.map((row, index) => {
              const entrada = parseFloat(row.entrada || "0");
              const saida = parseFloat(row.saida || "0");
              const subextratosDoExtrato = subextratos?.filter(
                (s) => s.idExtratoPrincipal === row.id
              );
              saldoAcumulado = saldoAcumulado + entrada - saida;
              const isEditando = editandoLote
                ? selecionados.includes(row.id)
                : editIndex === index;

              return (

                <React.Fragment key={index}>

                  {insertIndex === index && (
                    <tr>
                      <td className="p-0" colSpan={13}>
                        <div className="h-2 bg-blue-300/50 rounded" />
                      </td>
                    </tr>
                  )}

                  <tr
                    className={`transition-all duration-200 ease-out ${selecionados.includes(row.id)
                        ? "bg-green-200 border-2 border-green-600 shadow-md"
                        : row.lancamentoFuturo
                          ? "bg-red-100 border border-red-300 ring-2 ring-red-300"
                          : "odd:bg-white even:bg-gray-100 hover:bg-gray-50"
                      } ${dragIndex === index ? "opacity-70 bg-blue-50 scale-[0.995] shadow-md" : (dragOverIndex.current === index ? "ring-2 ring-blue-400" : "")}`}
                    draggable
                    onDragStart={() => {
                      if (selecionados.includes(row.id)) {
                        const indicesBloco = dadosOrdenados
                          .map((r, i) => ({ id: r.id, i }))
                          .filter(({ id }) => selecionados.includes(id))
                          .map(o => o.i)
                          .sort((a, b) => a - b);
                        dragBlockIndices.current = indicesBloco;
                        setDragIndex(index);
                      } else {
                        dragBlockIndices.current = null;
                        setDragIndex(index);
                      }
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragBlockIndices.current && dragBlockIndices.current.includes(index)) {
                        return;
                      }
                      dragOverIndex.current = index;
                      try { if (e.dataTransfer) e.dataTransfer.dropEffect = "move"; } catch { }
                      const rect = (e.currentTarget as HTMLTableRowElement).getBoundingClientRect();
                      const offsetY = e.clientY - rect.top;
                      const insertPos = offsetY < rect.height / 2 ? index : index + 1;
                      if (insertIndex !== insertPos) setInsertIndex(insertPos);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      dragOverIndex.current = null;
                      setInsertIndex(null);
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      if (dragIndex === null || insertIndex === null) return;

                      const list = [...dadosOrdenados];
                      let novaLista: any[] = [];

                      if (dragBlockIndices.current && dragBlockIndices.current.length > 1) {
                        const indices = [...dragBlockIndices.current].sort((a, b) => b - a);
                        const bloco: any[] = [];
                        for (const iRem of indices) {
                          const [rem] = list.splice(iRem, 1);
                          bloco.unshift(rem); 
                        }
                        let targetIndex = insertIndex;
                        const removedBefore = indices.filter(i => i < insertIndex).length;
                        targetIndex -= removedBefore;
                        if (targetIndex < 0) targetIndex = 0;
                        if (targetIndex > list.length) targetIndex = list.length;
                        list.splice(targetIndex, 0, ...bloco);
                        novaLista = list;
                      } else {
                        const [moved] = list.splice(dragIndex, 1);
                        const targetIndex = insertIndex > dragIndex ? insertIndex - 1 : insertIndex;
                        list.splice(targetIndex, 0, moved);
                        novaLista = list;
                      }

                      setDadosOrdenados(novaLista);

                      try {
                        setIsSavingOrder(true);
                        const ordens = novaLista.map((item, i) => ({ idextrato: item.id, ordem: i + 1 }));
                        await reorderExtratos(ordens);
                        onAtualizarExtratos();
                      } catch (err) {
                        console.error("Erro ao salvar ordem:", err);
                        alert("Erro ao salvar nova ordem");
                      } finally {
                        setIsSavingOrder(false);
                      }

                      setDragIndex(null);
                      dragOverIndex.current = null;
                      dragBlockIndices.current = null;
                      setInsertIndex(null);
                    }}
                  >
                    <td className="border px-2 py-2 text-center select-none" title="Arraste para reordenar">
                      <span className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing">
                        <FaGripVertical size={16} />
                      </span>
                    </td>
                    <td className="border px-2 py-2 whitespace-nowrap">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editData.data}
                          onChange={(e) => handleChange(e, "data")}
                          className="w-28 border px-2 py-1" 
                        />
                      ) : (
                        row.data
                      )}
                    </td>

                    <td className={`border px-2 py-2 whitespace-nowrap relative group ${editIndex === index ? "min-w-[250px]" : ""}`}>
                      {editIndex === index ? (
                        <CustomDropdown
                          label="Selecione uma rubrica"
                          options={categoriasFormatadas}
                          selectedValue={(() => {
                            if (editData?.idCategoriaSelecionada) {
                              const byId = categoriasFormatadas.find(opt => opt.value === editData.idCategoriaSelecionada);
                              if (byId) return byId;
                            }
                            const norm = (s: string) => s
                              .replace(/^\s*└\s*/, '')
                              .normalize('NFD')
                              .replace(/\p{Diacritic}/gu, '')
                              .replace(/[^\p{L}\p{N}]+/gu, '')
                              .toLowerCase()
                              .trim();
                            const alvo = norm(editData.rubricaSelecionada || '');
                            let found = categoriasFormatadas.find(opt => norm(opt.label) === alvo);
                            if (!found && alvo) found = categoriasFormatadas.find(opt => norm(opt.label).includes(alvo));
                            return found || { label: '', value: '' };
                          })()}
                          onSelect={(value) => {
                            handleChange({ target: { value: value.label } } as any, 'rubricaSelecionada');
                            setEditData((prev: any) => ({ ...prev, idCategoriaSelecionada: value.value }));
                          }}
                          type="rubrica"
                        />

                      ) : (
                        <span className="group relative cursor-pointer">
                          {row.rubricaSelecionada.length > 30 ? row.rubricaSelecionada.slice(0, 30) + "..." : row.rubricaSelecionada}
                          {row.rubricaSelecionada.length > 30 && (
                            <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {row.rubricaSelecionada}
                            </span>
                          )}
                        </span>
                      )}
                    </td>

                    <td className={`border px-2 py-2 whitespace-nowrap relative group ${editIndex === index ? "min-w-[250px]" : ""}`}>
                      {editIndex === index ? (
                        <CustomDropdown
                          label="Fornecedor"
                          options={fornecedoresFormatados}
                          selectedValue={fornecedoresFormatados.find(opt => opt.label === editData.fornecedorSelecionado) || { label: "", value: "" }}
                          onSelect={(value) => handleChange({ target: { value: value.label } } as any, "fornecedorSelecionado")}
                          type="fornecedor"
                        />

                      ) : (
                        <span className="group relative cursor-pointer">
                          {row.fornecedorSelecionado.length > 30 ? row.fornecedorSelecionado.slice(0, 30) + "..." : row.fornecedorSelecionado}
                          {row.fornecedorSelecionado.length > 30 && (
                            <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {row.fornecedorSelecionado}
                            </span>
                          )}
                        </span>
                      )}
                    </td>

                    <td className="border px-2 py-2 whitespace-nowrap relative group">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editData.observacao}
                          onChange={(e) => handleChange(e, "observacao")}
                          className="w-full border px-2 py-1"
                        />
                      ) : (
                        <span className="group relative cursor-pointer">
                          {row.observacao.length > 30 ? row.observacao.slice(0, 30) + "..." : row.observacao}
                          {row.observacao.length > 30 && (
                            <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {row.observacao}
                            </span>
                          )}
                        </span>
                      )}
                    </td>

                    <td className="border px-2 py-2 whitespace-nowrap relative group">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editData.nomeNoExtrato}
                          onChange={(e) => handleChange(e, "nomeNoExtrato")}
                          className="w-full border px-2 py-1"
                        />
                      ) : (
                        <span className="group relative cursor-pointer">
                          {row.nomeNoExtrato.length > 30 ? row.nomeNoExtrato.slice(0, 30) + "..." : row.nomeNoExtrato}
                          {row.nomeNoExtrato.length > 30 && (
                            <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {row.nomeNoExtrato}
                            </span>
                          )}
                        </span>
                      )}
                    </td>

                    <td className="border px-2 py-2 whitespace-nowrap relative group">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editData.rubricaContabil}
                          onChange={(e) => handleChange(e, "rubricaContabil")}
                          className="w-full border px-2 py-1"
                        />
                      ) : (
                        <span className="group relative cursor-pointer">
                          {row.rubricaContabil.length > 30 ? row.rubricaContabil.slice(0, 30) + "..." : row.rubricaContabil}
                          {row.rubricaContabil.length > 30 && (
                            <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {row.rubricaContabil}
                            </span>
                          )}
                        </span>
                      )}
                    </td>

                    <td className="border px-2 py-2 text-right whitespace-nowrap">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={formatarMoedaDigitar(editData.entrada)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
                            setEditData({ ...editData, entrada: rawValue });
                          }}
                          className="w-full border px-2 py-1 text-right"
                        />
                      ) : (
                        formatarMoeda(row.entrada) || '-'
                      )}
                    </td>
                    <td className="border px-2 py-2 text-right whitespace-nowrap">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={formatarMoedaDigitar(editData.saida)} // Formata na exibição
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
                            setEditData({ ...editData, saida: rawValue });
                          }}
                          className="w-full border px-2 py-1 text-right"
                        />
                      ) : (
                        formatarMoeda(row.saida) || '-'
                      )}
                    </td>
                    <td className="border px-2 py-2 text-right whitespace-nowrap">
                      {saldoAcumulado.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="border px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <button
                          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                          onClick={() => {
                            setExtratoSelecionado(row.id);
                            setAnexosVisiveis(true);
                          }}
                          title="Gerenciar anexos"
                        >
                          <FaPaperclip size={16} className="text-gray-700" />
                        </button>
                        {anexos
                          .filter((a) => a.idExtrato === row.id)
                          .map((an) => (
                            <button
                              key={an.idAnexo}
                              className={`px-2 py-1 rounded text-xs border ${baixandoAnexoId === an.idAnexo ? "bg-blue-200 text-blue-800" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                              onClick={() => handleDownloadAnexo(an)}
                              title={an.nomeArquivo}
                              disabled={baixandoAnexoId === an.idAnexo}
                            >
                              {an.tipoExtratoAnexo?.toUpperCase() || "ARQ"}
                            </button>
                          ))}
                      </div>
                    </td>

                    <td className="border px-2 py-2 text-center">
                      <div className="flex justify-center items-center space-x-4 h-full">
                        {editIndex === index ? (
                          <>
                            <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(index)}>
                              <FaSave size={20} />
                            </button>
                            <button className="text-red-500 hover:text-red-700" onClick={handleCancel}>
                              <FaTimes size={20} />
                            </button>

                          </>
                        ) : (
                          <>
                            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(index)}>
                              <FaEdit size={20} />
                            </button>

                            {row.lancamentoFuturo && (
                              <button
                                className="text-green-600 hover:text-green-700"
                                title="Confirmar lançamento (remove o status de futuro)"
                                onClick={() => handleConfirmarLancamento(row.id)}
                                disabled={confirmandoId === row.id}
                              >
                                {confirmandoId === row.id ? (
                                  <span className="animate-spin inline-block w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"></span>
                                ) : (
                                  <FaCheck size={20} />
                                )}
                              </button>
                            )}

                            <button
                              className={`hover:text-green-700 transition-colors duration-200 ${selecionados.includes(row.id) ? "text-green-700 bg-green-100 rounded-full p-1" : "text-gray-400"}`}
                              title={selecionados.includes(row.id) ? "Desmarcar linha" : "Selecionar linha"}
                              onClick={() => onToggleSelecionado(row.id)}
                            >
                              <FaHandPointer size={20} />
                            </button>

                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeletarLinha(row.id)}
                              disabled={deletandoId === row.id}
                            >
                              {deletandoId === row.id ? (
                                <span className="animate-spin inline-block w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"></span>
                              ) : (
                                <FaTrash size={20} />
                              )}
                            </button>


                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {subdividindoIndex === index && (
                    <tr className="bg-blue-50 text-xs">
                      <td className="border px-2 py-2 text-center">—</td>
                      <td className="border px-2 py-2 whitespace-nowrap">
                        <input
                          type="date"
                          className="w-full px-2 py-1 border"
                          value={novoSubextrato.data || ""}
                          onChange={(e) => setNovoSubextrato({ ...novoSubextrato, data: e.target.value.split("/").reverse().join("-") })}
                          required
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <CustomDropdown
                          label="Rubrica"
                          options={categoriasFormatadas}
                          selectedValue={categoriasFormatadas.find(opt => opt.value === novoSubextrato.categoria) || { label: "", value: "" }}
                          onSelect={(rubricaSelecionada) => setNovoSubextrato({ ...novoSubextrato, categoria: rubricaSelecionada.value })}
                          type="rubrica"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <CustomDropdown
                          label="Fornecedor"
                          options={fornecedoresFormatados}
                          selectedValue={fornecedoresFormatados.find(opt => opt.value === novoSubextrato.fornecedor) || { label: "", value: "" }}
                          onSelect={(fornecedorSelecionado) => setNovoSubextrato({ ...novoSubextrato, fornecedor: fornecedorSelecionado.value })}
                          type="fornecedor"
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border"
                          placeholder="Descrição"
                          value={novoSubextrato.observacao || ""}
                          onChange={(e) => setNovoSubextrato({ ...novoSubextrato, observacao: e.target.value })}
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border"
                          placeholder="Nome no Extrato"
                          value={novoSubextrato.nomeNoExtrato || ""}
                          onChange={(e) => setNovoSubextrato({ ...novoSubextrato, nomeNoExtrato: e.target.value })}
                        />
                      </td>
                      <td className="border px-2 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border"
                          placeholder="Rubrica Contábil"
                          value={novoSubextrato.rubricaContabil || ""}
                          onChange={(e) => setNovoSubextrato({ ...novoSubextrato, rubricaContabil: e.target.value })}
                        />
                      </td>

                      <td className="border px-2 py-2 text-right">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border text-right"
                          placeholder="Entrada"
                          value={novoSubextrato.tipoDeTransacao === "ENTRADA" ? novoSubextrato.valor : ""}
                          onChange={(e) => {
                            const formatarMoeda = (valor: string) => {
                              const numeroLimpo = valor.replace(/\D/g, "");
                              if (!numeroLimpo) return "";

                              const numero = parseFloat(numeroLimpo) / 100;
                              return numero.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              });
                            };

                            setNovoSubextrato({
                              ...novoSubextrato,
                              tipoDeTransacao: "ENTRADA",
                              valor: formatarMoeda(e.target.value),
                            });
                          }}
                        />
                      </td>
                      <td className="border px-2 py-2 text-right">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border text-right"
                          placeholder="Saída"
                          value={novoSubextrato.tipoDeTransacao === "SAIDA" ? novoSubextrato.valor : ""}
                          onChange={(e) => {
                            const formatarMoeda = (valor: string) => {
                              const numeroLimpo = valor.replace(/\D/g, "");
                              if (!numeroLimpo) return "";

                              const numero = parseFloat(numeroLimpo) / 100;
                              return numero.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              });
                            };

                            setNovoSubextrato({
                              ...novoSubextrato,
                              tipoDeTransacao: "SAIDA",
                              valor: formatarMoeda(e.target.value),
                            });
                          }}
                        />
                      </td>
                      <td className="border px-2 py-2 text-center">—</td>
                      <td className="border px-2 py-2 text-right">—</td>
                      <td className="border px-2 py-2 text-center">—</td>
                      <td className="border px-2 py-2 text-center">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          onClick={async () => {
                            try {
                              const payload = {
                                ...novoSubextrato,
                                idExtratoPrincipal: row.id,
                                valor: parsePtBrToFloat(novoSubextrato.valor || "0"),
                              };
                              await criarSubextrato(payload);
                              setSubdividindoIndex(null);
                              setNovoSubextrato({});
                              if (typeof onAtualizarSubextratos === "function") {
                                onAtualizarSubextratos();
                              }
                            } catch (error) {
                              console.error("Erro ao criar subextrato:", error);
                            }
                          }}
                        >
                          Salvar
                        </button>
                      </td>
                    </tr>
                  )}

                  {subextratosDoExtrato && subextratosDoExtrato.length > 0 && (
                    subextratosDoExtrato.map((sub) => (
                      <tr key={`subextrato-${sub.idSubextrato}`} className="bg-yellow-100 text-xs">
                        <td className="border px-2 py-2 text-center">—</td>
                        <td className="border px-2 py-2 whitespace-nowrap">{sub.data}</td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {sub.categoria?.nome || "—"}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {sub.fornecedor?.nome || "—"}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {sub.observacao || "—"}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {sub.nomeNoExtrato || "—"}

                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {sub.rubricaContabil || "—"}
                        </td>

                        <td className="border px-2 py-2 text-right whitespace-nowrap">
                          {sub.tipoDeTransacao === "ENTRADA"
                            ? Number(sub.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                            : ""}
                        </td>

                        <td className="border px-2 py-2 text-right whitespace-nowrap">
                          {sub.tipoDeTransacao === "SAIDA"
                            ? Number(sub.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                            : ""}
                        </td>

                        <td className="border px-2 py-2 text-center whitespace-nowrap">—</td>
                        <td className="border px-2 py-2 text-right whitespace-nowrap">—</td>
                        <td className="border px-2 py-2 text-center">—</td>
                        <td className="border px-2 py-2 text-center">—</td>
                      </tr>
                    ))
                  )}

                  {index === dadosOrdenados.length - 1 && insertIndex === dadosOrdenados.length && (
                    <tr>
                      <td className="p-0" colSpan={13}>
                        <div className="h-2 bg-blue-300/50 rounded" />
                      </td>
                    </tr>
                  )}

                </React.Fragment>

              );
            })}

          </tbody>
        </table>
        {anexosVisiveis && extratoSelecionado !== null && (
          <Anexos
            idExtrato={extratoSelecionado} // ← ESSENCIAL
            anexos={anexos.filter(a => a.idExtrato === extratoSelecionado)}
            onFechar={() => setAnexosVisiveis(false)}
            onAtualizar={() => mutate()}
          />
        )}
        {isSavingOrder && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded px-3 py-2 text-sm border">
            Salvando nova ordem...
          </div>
        )}
        {isLoadingSetSaldo && (
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-gray-800 font-medium">Processando...</p>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default TabelaExtrato;