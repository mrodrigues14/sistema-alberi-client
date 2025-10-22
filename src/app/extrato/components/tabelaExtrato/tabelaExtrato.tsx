"use client";

import React, { useState, useEffect, useRef } from "react";
import { useExtratoAnexosPorExtrato } from "@/lib/hooks/useExtratoAnexosPorExtrato";
import { createPortal } from "react-dom";
import { FaDivide, FaEdit, FaHandPointer, FaPaperclip, FaSave, FaTrash, FaTimes, FaSort, FaSortUp, FaSortDown, FaFilter, FaCheck, FaGripVertical, FaFileExcel, FaFilePdf, FaClock } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CustomDropdown from "../dropdown/CustomDropdown";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Subextrato } from "../../../../../types/Subextrato";
import { criarSubextrato, atualizarSubextrato, deletarSubextrato } from "@/lib/hooks/useSubextrato";
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



// Full-screen overlay rendered via portal to cover the entire viewport
const FullScreenOverlay: React.FC<{ open: boolean; children: React.ReactNode }> = ({ open, children }) => {
  if (!open) return null;
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
      {children}
    </div>,
    document.body
  );
};

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
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  // Indices (na lista renderizada) das linhas que formam o bloco sendo arrastado em modo multi-seleção
  const dragBlockIndices = useRef<number[] | null>(null);
  const [ordem, setOrdem] = useState<{ coluna: string; direcao: "asc" | "desc" } | null>(null);
  const [dadosOrdenados, setDadosOrdenados] = useState<any[]>([]);

  // Sincroniza dadosOrdenados com dados sempre que os dados mudam
  useEffect(() => {
    setDadosOrdenados(dados);
  }, [dados]);
  const [filtroRubricas, setFiltroRubricas] = useState<string[]>([]);
  const [filtroFornecedores, setFiltroFornecedores] = useState<string[]>([]);
  const [filtroSubrubricas, setFiltroSubrubricas] = useState<string[]>([]);
  const [filtroRubricasContabeis, setFiltroRubricasContabeis] = useState<string[]>([]);
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [subdividindoIndex, setSubdividindoIndex] = useState<number | null>(null);
  const [novoSubextrato, setNovoSubextrato] = useState<any>({});
  const [editandoSubId, setEditandoSubId] = useState<number | null>(null);
  const [subEdit, setSubEdit] = useState<any>({});
  const [anexosVisiveis, setAnexosVisiveis] = useState(false);
  const [extratoSelecionado, setExtratoSelecionado] = useState<number | null>(null);
  const [dadosEditadosLote, setDadosEditadosLote] = useState<Record<number, any>>({});
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
  const [marcandoPrevisaoId, setMarcandoPrevisaoId] = useState<number | null>(null);
  // Paginação para reduzir DOM e re-render durante drag
  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Opções de filtro pesadas (memoizadas para não recalcular a cada render)
  const uniqueRubricas = React.useMemo(
    () => [...new Set(dados.map(d => d.rubricaPaiNome || d.rubricaSelecionada))],
    [dados]
  );
  const uniqueFornecedores = React.useMemo(
    () => [...new Set(dados.map(d => d.fornecedorSelecionado))],
    [dados]
  );
  const uniqueRubricasContabeis = React.useMemo(
    () => [...new Set(dados.map(d => d.rubricaContabil))],
    [dados]
  );
  const uniqueSubrubricas = React.useMemo(
    () => [...new Set(dados.map(d => d.subrubricaNome).filter(Boolean))],
    [dados]
  );

  // Derivados de paginação
  const totalPages = React.useMemo(() => Math.max(1, Math.ceil((dadosOrdenados?.length || 0) / pageSize)), [dadosOrdenados, pageSize]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [totalPages]);
  const startIndex = React.useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);
  const endIndex = React.useMemo(() => Math.min(startIndex + pageSize, dadosOrdenados.length), [startIndex, pageSize, dadosOrdenados.length]);

  // Primeira página que contém lançamentos futuros (para pular direto)
  const futurePage = React.useMemo(() => {
    const idx = dadosOrdenados.findIndex((r) => !!r.lancamentoFuturo);
    if (idx === -1) return null;
    return Math.floor(idx / pageSize) + 1;
  }, [dadosOrdenados, pageSize]);

  // Saldo acumulado até o início da página atual
  const pageSaldoInicialAcumulado = React.useMemo(() => {
    let acc = saldoInicial ?? 0;
    for (let i = 0; i < startIndex; i++) {
      const row = dadosOrdenados[i];
      if (!row) continue;
      const entrada = parseFloat(row.entrada || "0");
      const saida = parseFloat(row.saida || "0");
      acc += entrada - saida;
    }
    return acc;
  }, [saldoInicial, dadosOrdenados, startIndex]);

  // Buscar anexos só para extratos visíveis na página
  const idsExtratoPagina = React.useMemo(() => {
    const slice = dadosOrdenados.slice(startIndex, endIndex);
    return Array.from(new Set(slice.map(r => r.id))).sort((a: number, b: number) => a - b);
  }, [dadosOrdenados, startIndex, endIndex]);
  const { anexosPorExtrato, isLoading, isError, mutate } = useExtratoAnexosPorExtrato(idsExtratoPagina);
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

  const handleEdit = (id: number) => {
    const row = dadosOrdenados.find(r => r.id === id) || dados.find(r => r.id === id);
    if (!row) return;
    setEditId(id);
    // Garante que temos o idCategoriaSelecionada disponível durante a edição
    setEditData({
      ...row,
      idCategoriaSelecionada: row.idCategoria ?? row.idCategoriaSelecionada ?? undefined,
    });
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

  const handleSave = async (id: number) => {
    try {
      const row = dadosOrdenados.find(r => r.id === id) || dados.find(r => r.id === id);
      if (!row) return;
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

        // Converte entrada/saída digitadas (dígitos -> centavos) para número com precisão
        const valorCampo = (() => {
          if (editData.entrada != null && editData.entrada !== '') return parseMoedaInput(editData.entrada as any);
          if (editData.saida != null && editData.saida !== '') return parseMoedaInput(editData.saida as any);
          // fallback para valor original já numérico, senão tenta derivar de strings pré-existentes
          if (typeof row.valor === 'number') return row.valor;
          return extrairNumero(String(row.entrada || row.saida || '0'));
        })();

      // Monta payload preservando campos quando não alterados
      const payload: Partial<Extrato> = {
        data: formatarDataParaISO(editData.data || row.data),
        nomeNoExtrato: editData.nomeNoExtrato ?? row.nomeNoExtrato,
        rubricaContabil: editData.rubricaContabil ?? row.rubricaContabil,
        descricao: editData.observacao ?? row.observacao,
        tipoDeTransacao: editData.entrada ? "ENTRADA" : (editData.saida ? "SAIDA" : row.tipoDeTransacao),
          valor: valorCampo,
  juros: editData.juros != null ? parseMoedaInput(editData.juros as any) : (row.juros ?? null),
        mesReferencia: editData.mesReferencia != null
          ? (normalizarMesReferencia(String(editData.mesReferencia)) || null)
          : (row.mesReferencia ?? null),
      };

      const idCategoriaFinal = (editData.idCategoriaSelecionada ?? categoriaSelecionada?.value ?? row.idCategoriaSelecionada) as number | undefined;
      if (typeof idCategoriaFinal === 'number') {
        payload.idCategoria = idCategoriaFinal;
      }
      if (fornecedorSelecionado && typeof fornecedorSelecionado.value === 'number') {
        payload.idFornecedor = fornecedorSelecionado.value as number;
      }
      console.log(payload);
      await updateExtrato(row.id, payload);

      // Força atualização da tabela para refletir as mudanças
      onAtualizarExtratos();

      setEditId(null);
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

  const handleMarcarComoPrevisao = async (id: number) => {
    setMarcandoPrevisaoId(id);
    try {
      await updateExtrato(id, { lancamentoFuturo: true });
      onAtualizarExtratos();
    } catch (error) {
      console.error("Erro ao marcar como previsão:", error);
      alert("Erro ao marcar lançamento como previsão.");
    } finally {
      setMarcandoPrevisaoId(null);
    }
  };


  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const iniciarEdicaoSub = (sub: Subextrato) => {
    setEditandoSubId(sub.idSubextrato);
    setSubEdit({
      data: formatarDataParaISO(sub.data),
      observacao: sub.observacao || "",
      nomeNoExtrato: sub.nomeNoExtrato || "",
      rubricaContabil: sub.rubricaContabil || "",
      tipoDeTransacao: sub.tipoDeTransacao,
      valor: Number(sub.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      mesReferencia: sub.mesReferencia || "",
      juros: sub.juros ?? "",
      idCategoriaSelecionada: sub.categoria?.idcategoria,
      idFornecedorSelecionado: sub.fornecedor?.idfornecedor,
    });
  };

  const salvarSub = async (sub: Subextrato) => {
    try {
      const valorNumero = parsePtBrToFloat(String(subEdit.valor || "0"));
      const payload: any = {
        data: subEdit.data,
        observacao: subEdit.observacao || null,
        nomeNoExtrato: subEdit.nomeNoExtrato || null,
        rubricaContabil: subEdit.rubricaContabil || null,
        tipoDeTransacao: subEdit.tipoDeTransacao,
        valor: String(valorNumero),
        mesReferencia: subEdit.mesReferencia != null ? normalizarMesReferencia(String(subEdit.mesReferencia)) || null : sub.mesReferencia ?? null,
        juros: subEdit.juros != null && subEdit.juros !== "" ? extrairNumero(String(subEdit.juros)) : (sub.juros ?? null),
      };

      if (subEdit.idCategoriaSelecionada) {
        payload.categoria = { idcategoria: subEdit.idCategoriaSelecionada };
      }
      if (subEdit.idFornecedorSelecionado) {
        payload.fornecedor = { idfornecedor: subEdit.idFornecedorSelecionado };
      }

      await atualizarSubextrato(sub.idSubextrato, payload);
      setEditandoSubId(null);
      setSubEdit({});
      onAtualizarSubextratos && onAtualizarSubextratos();
    } catch (e) {
      console.error("Erro ao atualizar subextrato", e);
      alert("Erro ao atualizar subextrato.");
    }
  };

  const cancelarSub = () => {
    setEditandoSubId(null);
    setSubEdit({});
  };

  const excluirSub = async (id: number) => {
    if (!confirm("Excluir este subextrato?")) return;
    try {
      await deletarSubextrato(id);
      onAtualizarSubextratos && onAtualizarSubextratos();
    } catch (e) {
      console.error("Erro ao excluir subextrato", e);
      alert("Erro ao excluir subextrato.");
    }
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

  const formatarMesReferencia = (valor?: string | null) => {
    if (!valor) return "-";
    // Expecting formats like YYYY-MM or YYYY-M
    const m = valor.match(/^(\d{4})-(\d{1,2})$/);
    if (m) {
      const ano = m[1];
      const mes = m[2].padStart(2, "0");
      return `${mes}/${ano}`;
    }
    return valor; // fallback raw
  };
  const normalizarMesReferencia = (valor: string): string => {
    if (!valor) return "";
    const v = valor.trim();
    // MM/YYYY -> YYYY-MM
    const mmYYYY = v.match(/^(\d{1,2})\/(\d{4})$/);
    if (mmYYYY) {
      const mm = mmYYYY[1].padStart(2, "0");
      const yyyy = mmYYYY[2];
      return `${yyyy}-${mm}`;
    }
    // YYYY-MM stays
    const yyyyMM = v.match(/^(\d{4})-(\d{1,2})$/);
    if (yyyyMM) {
      const yyyy = yyyyMM[1];
      const mm = yyyyMM[2].padStart(2, "0");
      return `${yyyy}-${mm}`;
    }
    return v;
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

  // Converte string de input de moeda (armazenada como apenas dígitos em centavos) para número
  const parseMoedaInput = (valor: string | number | undefined | null): number => {
    if (valor === undefined || valor === null) return 0;
    const s = String(valor);
    const numeros = s.replace(/\D/g, "");
    if (!numeros) return 0;
    return Number(numeros) / 100;
  };

  const extrairNumero = (valor: string) => {
    if (valor === undefined || valor === null) return 0;
    let s = String(valor).trim();
    if (s === "") return 0;
    // Remove spaces
    s = s.replace(/\s/g, "");
    // Caso comum pt-BR: '1.234,56' -> remove '.' (milhares) e troca ',' por '.' (decimal)
    if (s.indexOf(',') > -1 && s.indexOf('.') > -1) {
      s = s.replace(/\./g, '').replace(/,/g, '.');
    } else if (s.indexOf(',') > -1) {
      // '1000,50' -> '1000.50'
      s = s.replace(/,/g, '.');
    }
    // Remove any non-number (except dot and minus)
    s = s.replace(/[^0-9.-]/g, '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
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
      // Ordena sempre pelo campo 'ordem' (do banco) e garante lançamentos futuros no final
      const dadosOrdenadosPorOrdem = [...dadosFiltrados].sort((a, b) => {
        const aFuturo = a.lancamentoFuturo || false;
        const bFuturo = b.lancamentoFuturo || false;
        if (aFuturo && !bFuturo) return 1;
        if (!aFuturo && bFuturo) return -1;
        // Se ambos são do mesmo tipo, ordena pelo campo 'ordem'
        const ordemA = typeof a.ordem === 'number' ? a.ordem : 99999;
        const ordemB = typeof b.ordem === 'number' ? b.ordem : 99999;
        return ordemA - ordemB;
      });
      setDadosOrdenados(dadosOrdenadosPorOrdem);
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

                    const originalRow = dadosOrdenados.find((r) => r.id === id) || dados.find((r) => r.id === id);
                    const normalizeLabel = (s: string | undefined) => (s || '')
                      .replace(/^\s*└\s*/, '')
                      .normalize('NFD')
                      .replace(/\p{Diacritic}/gu, '')
                      .replace(/[^\p{L}\p{N}]+/gu, '')
                      .toLowerCase()
                      .trim();

                    let idCategoriaFinal: number | null | undefined = edit.idCategoriaSelecionada;
                    if (idCategoriaFinal == null) {
                      const catByLabel = categoriasFormatadas.find(
                        (opt) => normalizeLabel(opt.label) === normalizeLabel(edit.rubricaSelecionada)
                      );
                      idCategoriaFinal = (catByLabel?.value as number | undefined) ?? originalRow?.idCategoriaSelecionada ?? null;
                    }

                    const fornecedorSelecionado = fornecedoresFormatados.find(opt => opt.label === edit.fornecedorSelecionado);

                    // Calcula valor considerando inputs como dígitos (centavos)
                    const valorCampoLote = (() => {
                      if (edit.entrada != null && edit.entrada !== '') return parseMoedaInput(edit.entrada as any);
                      if (edit.saida != null && edit.saida !== '') return parseMoedaInput(edit.saida as any);
                      if (typeof originalRow?.valor === 'number') return originalRow.valor as number;
                      return extrairNumero(String(originalRow?.entrada || originalRow?.saida || '0'));
                    })();

                    const payload: Partial<Extrato> = {
                      data: formatarDataParaISO(edit.data ?? originalRow?.data),
                      nomeNoExtrato: edit.nomeNoExtrato ?? originalRow?.nomeNoExtrato,
                      rubricaContabil: edit.rubricaContabil ?? originalRow?.rubricaContabil,
                      descricao: edit.observacao ?? originalRow?.observacao,
                      idCategoria: idCategoriaFinal ?? null,
                      tipoDeTransacao: edit.entrada ? "ENTRADA" : (edit.saida ? "SAIDA" : originalRow?.tipoDeTransacao),
                      valor: valorCampoLote,
                      juros: edit.juros != null ? parseMoedaInput(edit.juros as any) : originalRow?.juros ?? null,
                      mesReferencia: edit.mesReferencia != null ? normalizarMesReferencia(String(edit.mesReferencia)) || null : originalRow?.mesReferencia ?? null,
                    };
                    if (edit.fornecedorSelecionado && fornecedorSelecionado && typeof fornecedorSelecionado.value === 'number') {
                      payload.idFornecedor = fornecedorSelecionado.value as number;
                    }

                    await updateExtrato(id, payload);
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
                  {uniqueRubricas.map((r, i) => (
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
                  {uniqueFornecedores.map((f, i) => (
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
                  {uniqueRubricasContabeis.map((rc, i) => (
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
                  {uniqueSubrubricas.map((sr: string, i: number) => (
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

        {/* Controles de paginação */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Itens por página:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            >
              {[25, 50, 100, 200, 500].map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {futurePage && (
              <button
                className="px-3 py-1 rounded border"
                onClick={() => setCurrentPage(futurePage)}
                title="Ir para lançamentos futuros"
              >
                Ir para previsões
              </button>
            )}
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Próxima
            </button>
          </div>
        </div>

        {/* Tabela */}
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="border px-2 py-2 w-8"></th>
              {renderTh("data", "Data")}
              {renderTh("mesReferencia", "Mês referência")}
              {renderTh("rubricaSelecionada", "Rubrica Financeira")}
              {renderTh("fornecedorSelecionado", "Fornecedor")}
              {renderTh("observacao", "Observação")}
              {renderTh("nomeNoExtrato", "Nome no Extrato")}
              {renderTh("rubricaContabil", "Rubrica Contábil")}
              {renderTh("juros", "Juros e multa")}
              {renderTh("entrada", "Entrada")}
              {renderTh("saida", "Saída")}
              <th className="border px-2 py-2">Saldo</th>
              <th className="border px-2 py-2">Anexos</th>
              <th className="border px-2 py-2">Ferramentas</th>
            </tr>
          </thead>

          <tbody>
            {(() => { saldoAcumulado = pageSaldoInicialAcumulado; return null; })()}
            {Array.from({ length: endIndex - startIndex }, (_, i) => i + startIndex).map((index) => {
              const row = dadosOrdenados[index];
              const entrada = parseFloat(row.entrada || "0");
              const saida = parseFloat(row.saida || "0");
              const subextratosDoExtrato = subextratos?.filter(
                (s) => s.idExtratoPrincipal === row.id
              );
              saldoAcumulado = saldoAcumulado + entrada - saida;
              const isEditando = editandoLote
                ? selecionados.includes(row.id)
                : editId === row.id;

              return (

                <React.Fragment key={index}>

                  {insertIndex === index && (
                    <tr>
                      <td className="p-0" colSpan={14}>
                        <div className="h-2 bg-blue-300/50 rounded" />
                      </td>
                    </tr>
                  )}


                  {/* Aviso de divergência de valor dos subextratos considerando entradas/saídas */}
                  {(() => {
                    const subextratosDaLinha = subextratos?.filter(s => s.idExtratoPrincipal === row.id) || [];
                    // Soma entradas e saídas dos subextratos
                    const somaEntradas = subextratosDaLinha.filter(s => s.tipoDeTransacao === "ENTRADA").reduce((acc, s) => acc + (parseFloat(s.valor) || 0), 0);
                    const somaSaidas = subextratosDaLinha.filter(s => s.tipoDeTransacao === "SAIDA").reduce((acc, s) => acc + (parseFloat(s.valor) || 0), 0);
                    const saldoSubextratos = somaEntradas - somaSaidas;
                    let valorOriginal = 0;
                    const tipoOriginal = row.tipoDeTransacao;
                    if (tipoOriginal === "ENTRADA") {
                      valorOriginal = parseFloat(row.entrada ?? row.valor ?? "0");
                    } else if (tipoOriginal === "SAIDA") {
                      valorOriginal = -Math.abs(parseFloat(row.saida ?? row.valor ?? "0"));
                    } else {
                      valorOriginal = parseFloat(row.valor ?? "0");
                    }
                    // Para ENTRADA, saldoSubextratos deve ser igual ao valorOriginal
                    // Para SAIDA, saldoSubextratos deve ser igual ao valorOriginal negativo
                    let diverge = false;
                    if (subextratosDaLinha.length > 0) {
                      if (tipoOriginal === "ENTRADA" && Math.abs(saldoSubextratos - valorOriginal) > 0.01) diverge = true;
                      if (tipoOriginal === "SAIDA" && Math.abs(saldoSubextratos + valorOriginal) > 0.01) diverge = true;
                    }
                    if (diverge) {
                      return (
                        <tr>
                          <td colSpan={100} className="bg-red-50 text-red-700 text-center py-1 animate-pulse border-t border-b border-red-400">
                            <span className="font-bold">Atenção:</span> Diferença entre rateio de pagamento, no valor de <b>{saldoSubextratos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b> e valor original de <b>{tipoOriginal === "ENTRADA" ? "ENTRADA" : tipoOriginal === "SAIDA" ? "SAÍDA" : ""}</b> (<b>{Math.abs(valorOriginal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>)<br />
                            <span className="font-bold">Diferença:</span> <b>{(saldoSubextratos - valorOriginal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })()}

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
                      let insertPos = offsetY < rect.height / 2 ? index : index + 1;
                      // Permite mover para antes da primeira linha e depois da última
                      if (insertPos < 0) insertPos = 0;
                      if (insertPos > dadosOrdenados.length) insertPos = dadosOrdenados.length;
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
                        // Validação: IDs únicos e ordens válidas
                        const ids = ordens.map(o => o.idextrato);
                        const ordensSet = new Set(ordens.map(o => o.ordem));
                        const idsSet = new Set(ids);
                        const hasNullId = ids.some(id => id == null);
                        const hasNullOrdem = ordens.some(o => o.ordem == null || o.ordem <= 0);
                        if (ids.length !== idsSet.size || ordensSet.size !== ordens.length || hasNullId || hasNullOrdem) {
                          alert("Erro: IDs duplicados, nulos ou ordens inválidas detectados. Não foi possível salvar a ordem.");
                          setIsSavingOrder(false);
                          return;
                        }
                        await reorderExtratos(ordens);
                        // Força o refetch dos extratos após reordenação
                        // mutate removido: anexos agora são buscados por extrato individual
                        if (typeof onAtualizarExtratos === "function") {
                          onAtualizarExtratos();
                        }
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
                      {isEditando ? (
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

                    <td className="border px-2 py-2 whitespace-nowrap">
                      {isEditando ? (
                        <input
                          type="text"
                          value={formatarMesReferencia(editData.mesReferencia)}
                          onChange={(e) => setEditData({ ...editData, mesReferencia: e.target.value })}
                          placeholder="MM/AAAA ou YYYY-MM"
                          className="w-28 border px-2 py-1"
                        />
                      ) : (
                        formatarMesReferencia(row.mesReferencia)
                      )}
                    </td>

                    <td className={`border px-2 py-2 whitespace-nowrap relative group ${isEditando ? "min-w-[250px]" : ""}`}>
                      {isEditando ? (
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

                    <td className={`border px-2 py-2 whitespace-nowrap relative group ${isEditando ? "min-w-[250px]" : ""}`}>
                      {isEditando ? (
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
                      {isEditando ? (
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
                      {isEditando ? (
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
                      {isEditando ? (
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
                      {isEditando ? (
                        <input
                          type="text"
                          value={formatarMoedaDigitar(editData.juros || '')}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            setEditData({ ...editData, juros: digits });
                          }}
                          className="w-full border px-2 py-1 text-right"
                        />
                      ) : (
                        row.juros != null && row.juros !== "" ? formatarMoeda(row.juros) : "-"
                      )}
                    </td>

                    <td className="border px-2 py-2 text-right whitespace-nowrap">
                      {isEditando ? (
                        <input
                          type="text"
                          value={formatarMoedaDigitar(editData.entrada)}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            setEditData({ ...editData, entrada: digits });
                          }}
                          className="w-full border px-2 py-1 text-right"
                        />
                      ) : (
                        formatarMoeda(row.entrada) || '-'
                      )}
                    </td>
                    <td className="border px-2 py-2 text-right whitespace-nowrap">
                      {isEditando ? (
                        <input
                          type="text"
                          value={formatarMoedaDigitar(editData.saida)} // Formata na exibição
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            setEditData({ ...editData, saida: digits });
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
                        {(anexosPorExtrato[row.id] || []).map((an: any) => (
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
                        {isEditando ? (
                          <>
                            <button className="text-green-500 hover:text-green-700" onClick={() => handleSave(row.id)}>
                              <FaSave size={20} />
                            </button>
                            <button className="text-red-500 hover:text-red-700" onClick={handleCancel}>
                              <FaTimes size={20} />
                            </button>

                          </>
                        ) : (
                          <>
                            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(row.id)}>
                              <FaEdit size={20} />
                            </button>

                            <button
                              className="text-purple-600 hover:text-purple-700"
                              title={subdividindoIndex === row.id ? "Fechar subdivisão" : "Subdividir (adicionar subextrato)"}
                              onClick={() => setSubdividindoIndex(prev => prev === row.id ? null : row.id)}
                            >
                              <FaDivide size={20} />
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

                            {!row.lancamentoFuturo && (
                              <button
                                className="text-amber-600 hover:text-amber-700"
                                title="Transformar em previsão"
                                onClick={() => handleMarcarComoPrevisao(row.id)}
                                disabled={marcandoPrevisaoId === row.id}
                              >
                                {marcandoPrevisaoId === row.id ? (
                                  <span className="animate-spin inline-block w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full"></span>
                                ) : (
                                  <FaClock size={20} />
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

            {subdividindoIndex === row.id && (
                    <tr className="bg-blue-50 text-xs">
                      <td className="border px-2 py-2 text-center">—</td>
                      <td className="border px-2 py-2 whitespace-nowrap">
                        <input
                          type="date"
                          className="w-full px-2 py-1 border"
                          value={novoSubextrato.data || ""}
                          onChange={(e) => setNovoSubextrato({ ...novoSubextrato, data: e.target.value })}
                          required
                        />
                      </td>
                      {/* Mês referência placeholder */}
                      <td className="border px-2 py-2 text-center">—</td>
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

                      {/* Juros e multa placeholder (apenas exibição) */}
                      <td className="border px-2 py-2 text-right">—</td>

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
                      {/* Saldo (subextrato não afeta) */}
                      <td className="border px-2 py-2 text-right">—</td>
                      {/* Anexos (não aplicável em subextrato inline) */}
                      <td className="border px-2 py-2 text-center">—</td>
                      {/* Ferramentas: Salvar/Cancelar */}
                      <td className="border px-2 py-2 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            className="text-green-600 hover:text-green-700 inline-flex items-center gap-1"
                            title="Salvar subextrato"
                            onClick={async () => {
                              try {
                                const payload: any = {
                                  idExtratoPrincipal: row.id,
                                  data: novoSubextrato.data,
                                  nomeNoExtrato: novoSubextrato.nomeNoExtrato || null,
                                  observacao: novoSubextrato.observacao || null,
                                  rubricaContabil: novoSubextrato.rubricaContabil || null,
                                  tipoDeTransacao: novoSubextrato.tipoDeTransacao,
                                  valor: parsePtBrToFloat(novoSubextrato.valor || "0"),
                                };
                                if (novoSubextrato.categoria) {
                                  payload.categoria = { idcategoria: novoSubextrato.categoria };
                                }
                                if (novoSubextrato.fornecedor) {
                                  payload.fornecedor = { idfornecedor: novoSubextrato.fornecedor };
                                }
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
                            <FaSave size={18} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                            title="Cancelar subdivisão"
                            onClick={() => {
                              setSubdividindoIndex(null);
                              setNovoSubextrato({});
                            }}
                          >
                            <FaTimes size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {subextratosDoExtrato && subextratosDoExtrato.length > 0 && (
                    subextratosDoExtrato.map((sub) => (
                      <tr key={`subextrato-${sub.idSubextrato}`} className="bg-yellow-100 text-xs">
                        <td className="border px-2 py-2 text-center">—</td>
                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="date"
                              className="w-full px-2 py-1 border"
                              value={subEdit.data || ""}
                              onChange={(e) => setSubEdit((p: any) => ({ ...p, data: e.target.value }))}
                            />
                          ) : (
                            sub.data
                          )}
                        </td>

                        {/* Mês referência */}
                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              value={formatarMesReferencia((subEdit as any).mesReferencia)}
                              onChange={(e) => setSubEdit((p: any) => ({ ...p, mesReferencia: e.target.value }))}
                              placeholder="MM/AAAA ou YYYY-MM"
                              className="w-28 border px-2 py-1"
                            />
                          ) : (
                            formatarMesReferencia(sub.mesReferencia)
                          )}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <CustomDropdown
                              label="Rubrica"
                              options={categoriasFormatadas}
                              selectedValue={(function(){
                                const idSel = (subEdit as any).idCategoriaSelecionada ?? sub.categoria?.idcategoria;
                                return categoriasFormatadas.find((opt: any) => opt.value === idSel) || { label: "", value: "" };
                              })()}
                              onSelect={(opt: any) => setSubEdit((p: any) => ({ ...p, idCategoriaSelecionada: opt.value }))}
                              type="rubrica"
                            />
                          ) : (
                            sub.categoria?.nome || "—"
                          )}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <CustomDropdown
                              label="Fornecedor"
                              options={fornecedoresFormatados}
                              selectedValue={(function(){
                                const idSel = (subEdit as any).idFornecedorSelecionado ?? sub.fornecedor?.idfornecedor;
                                return fornecedoresFormatados.find((opt: any) => opt.value === idSel) || { label: "", value: "" };
                              })()}
                              onSelect={(opt: any) => setSubEdit((p: any) => ({ ...p, idFornecedorSelecionado: opt.value }))}
                              type="fornecedor"
                            />
                          ) : (
                            sub.fornecedor?.nome || "—"
                          )}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border"
                              value={subEdit.observacao || ""}
                              onChange={(e) => setSubEdit((p: any) => ({ ...p, observacao: e.target.value }))}
                            />
                          ) : (
                            sub.observacao || "—"
                          )}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border"
                              value={subEdit.nomeNoExtrato || ""}
                              onChange={(e) => setSubEdit((p: any) => ({ ...p, nomeNoExtrato: e.target.value }))}
                            />
                          ) : (
                            sub.nomeNoExtrato || "—"
                          )}
                        </td>

                        <td className="border px-2 py-2 whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border"
                              value={subEdit.rubricaContabil || ""}
                              onChange={(e) => setSubEdit((p: any) => ({ ...p, rubricaContabil: e.target.value }))}
                            />
                          ) : (
                            sub.rubricaContabil || "—"
                          )}
                        </td>

                        {/* Juros e multa */}
                        <td className="border px-2 py-2 text-right whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              value={formatarMoedaDigitar((subEdit as any).juros || "")}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/[^\d,]/g, "").replace(",", ".");
                                setSubEdit((p: any) => ({ ...p, juros: rawValue }));
                              }}
                              className="w-full border px-2 py-1 text-right"
                            />
                          ) : (
                            sub.juros != null ? formatarMoeda(sub.juros) : "—"
                          )}
                        </td>

                        <td className="border px-2 py-2 text-right whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border text-right"
                              placeholder="Entrada"
                              value={subEdit.tipoDeTransacao === "ENTRADA" ? subEdit.valor || "" : ""}
                              onChange={(e) => {
                                const numeros = e.target.value.replace(/\D/g, "");
                                const numero = Number(numeros) / 100;
                                setSubEdit((p: any) => ({ ...p, tipoDeTransacao: "ENTRADA", valor: numero.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) }));
                              }}
                            />
                          ) : (
                            sub.tipoDeTransacao === "ENTRADA"
                              ? Number(sub.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                              : ""
                          )}
                        </td>

                        <td className="border px-2 py-2 text-right whitespace-nowrap">
                          {editandoSubId === sub.idSubextrato ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border text-right"
                              placeholder="Saída"
                              value={subEdit.tipoDeTransacao === "SAIDA" ? subEdit.valor || "" : ""}
                              onChange={(e) => {
                                const numeros = e.target.value.replace(/\D/g, "");
                                const numero = Number(numeros) / 100;
                                setSubEdit((p: any) => ({ ...p, tipoDeTransacao: "SAIDA", valor: numero.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) }));
                              }}
                            />
                          ) : (
                            sub.tipoDeTransacao === "SAIDA"
                              ? Number(sub.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                              : ""
                          )}
                        </td>

                        {/* Saldo */}
                        <td className="border px-2 py-2 text-center whitespace-nowrap">—</td>
                        {/* Anexos */}
                        <td className="border px-2 py-2 text-right whitespace-nowrap">—</td>
                        {/* Ferramentas */}
                        <td className="border px-2 py-2 text-center">
                          {editandoSubId === sub.idSubextrato ? (
                            <div className="flex items-center justify-center gap-3">
                              <button
                                className="text-green-600 hover:text-green-700"
                                title="Salvar subextrato"
                                onClick={() => salvarSub(sub)}
                              >
                                <FaSave size={16} />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-600"
                                title="Cancelar edição"
                                onClick={cancelarSub}
                              >
                                <FaTimes size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              <button
                                className="text-blue-600 hover:text-blue-700"
                                title="Editar subextrato"
                                onClick={() => iniciarEdicaoSub(sub)}
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-600"
                                title="Excluir subextrato"
                                onClick={() => excluirSub(sub.idSubextrato)}
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}

                  {index === dadosOrdenados.length - 1 && insertIndex === dadosOrdenados.length && (
                    <tr>
                      <td className="p-0" colSpan={14}>
                        <div className="h-2 bg-blue-300/50 rounded" />
                      </td>
                    </tr>
                  )}

                </React.Fragment>

              );
            })}

          </tbody>
        </table>
        {anexosVisiveis && extratoSelecionado !== null && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.5)' }}>
            <Anexos
              idExtrato={extratoSelecionado}
              anexos={anexosPorExtrato[extratoSelecionado] || []}
              onFechar={() => setAnexosVisiveis(false)}
              onAtualizar={() => { if (typeof mutate === 'function') mutate(); }}
            />
          </div>,
          document.body
        )}
        <FullScreenOverlay open={isLoadingSetSaldo || isLoading}>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-800 font-medium">Processando...</p>
          </div>
        </FullScreenOverlay>

      </div>


    </div>
  );
};

export default TabelaExtrato;