"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { useClienteContext } from "@/context/ClienteContext";
import { Categoria, useCategoriasPorCliente } from "@/lib/hooks/useCategoria";
import { BarChart, PieChart } from "@mui/x-charts";

type MetaRow = {
  id: number;
  nome: string;
  idPai: number | null;
  nomePai?: string | null;
  tipo: "pai" | "filha";
  meta: number;
  gasto: number;
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatCurrency(n: number) {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Pequeno PRNG determinístico baseado na string s
function seededRand(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift-like
  h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
  return (h >>> 0) / 0xffffffff;
}

export default function MetasPage() {
  const { idCliente } = useClienteContext();
  const { categoriasCliente } = useCategoriasPorCliente(idCliente || undefined);
  const categoriasArr = useMemo(() => (categoriasCliente || []) as Categoria[], [categoriasCliente]);

  const now = new Date();
  const [mes, setMes] = useState(monthNames[now.getMonth()]);
  const [ano, setAno] = useState(String(now.getFullYear()));

  const mesAnoKey = useMemo(() => {
    const idx = monthNames.indexOf(mes);
    const m = String(idx + 1).padStart(2, "0");
    return `${ano}-${m}`;
  }, [mes, ano]);

  const estrutura = useMemo(() => {
    if (!categoriasArr.length) return { pais: [] as Categoria[], filhas: [] as Categoria[] };
    const pais = categoriasArr.filter((c: Categoria) => !c.idCategoriaPai);
    const filhas = categoriasArr.filter((c: Categoria) => c.idCategoriaPai);
    return { pais, filhas };
  }, [categoriasArr]);

  // Carrega metas do localStorage (escopo por cliente e mes/ano)
  const [metas, setMetas] = useState<Record<number, number>>({}); // idCategoria -> meta

  useEffect(() => {
    const key = `metas:${idCliente || "anon"}:${mesAnoKey}`;
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (raw) {
      try { setMetas(JSON.parse(raw)); } catch {}
    } else {
      // inicializa metas fictícias
      const initial: Record<number, number> = {};
      for (const c of categoriasCliente || []) {
        const base = 500 + Math.round(seededRand(`${c.idcategoria}:${mesAnoKey}:m`) * 4500);
        initial[c.idcategoria] = base;
      }
      setMetas(initial);
    }
  }, [idCliente, mesAnoKey, categoriasCliente]);

  const saveMetas = () => {
    const key = `metas:${idCliente || "anon"}:${mesAnoKey}`;
    window.localStorage.setItem(key, JSON.stringify(metas));
    alert("Metas salvas para " + mes + "/" + ano);
  };

  // Monta linhas com metas + gastos fictícios do mês
  const linhas: MetaRow[] = useMemo(() => {
    const rows: MetaRow[] = [];
    const nomePorId = new Map<number, string>();
    for (const p of estrutura.pais) nomePorId.set(p.idcategoria, p.nome);
    for (const f of estrutura.filhas) nomePorId.set(f.idcategoria, f.nome);

    const addRow = (c: Categoria) => {
      const isFilha = Boolean(c.idCategoriaPai);
      const meta = metas[c.idcategoria] ?? 0;
      const seed = `${idCliente || "anon"}:${mesAnoKey}:${c.idcategoria}`;
      const r = seededRand(seed);
      const gasto = Math.round(meta * (0.4 + r * 0.9)); // 40% a 130% da meta
      rows.push({
        id: c.idcategoria,
        nome: c.nome,
        idPai: c.idCategoriaPai || null,
        nomePai: c.idCategoriaPai ? nomePorId.get(c.idCategoriaPai) || null : c.nome,
        tipo: isFilha ? "filha" : "pai",
        meta,
        gasto,
      });
    };

    for (const p of estrutura.pais) addRow(p);
    for (const f of estrutura.filhas) addRow(f);
    return rows;
  }, [estrutura, metas, idCliente, mesAnoKey]);

  const totalMeta = useMemo(() => linhas.reduce((acc, l) => acc + l.meta, 0), [linhas]);
  const totalGasto = useMemo(() => linhas.reduce((acc, l) => acc + l.gasto, 0), [linhas]);
  const atingimento = totalMeta > 0 ? (totalGasto / totalMeta) * 100 : 0;

  // Dados para gráficos
  const porPai = useMemo(() => {
    const map = new Map<string, { meta: number; gasto: number }>();
    for (const l of linhas) {
      const key = l.nomePai || l.nome;
      const agg = map.get(key) || { meta: 0, gasto: 0 };
      agg.meta += l.meta;
      agg.gasto += l.gasto;
      map.set(key, agg);
    }
    const labels = Array.from(map.keys());
    const metasArr = labels.map((k) => map.get(k)!.meta);
    const gastosArr = labels.map((k) => map.get(k)!.gasto);
    return { labels, metasArr, gastosArr };
  }, [linhas]);

  const pieMeta = porPai.labels.map((label, i) => ({ id: label, value: porPai.metasArr[i], label }));
  const pieGasto = porPai.labels.map((label, i) => ({ id: label, value: porPai.gastosArr[i], label }));

  const onChangeMeta = (id: number, value: string) => {
    const clean = Number(value.replace(/\./g, "").replace(",", "."));
    setMetas((prev) => ({ ...prev, [id]: isNaN(clean) ? 0 : Math.round(clean) }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Metas por Categoria</h1>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1 bg-white" value={mes} onChange={(e) => setMes(e.target.value)}>
                {monthNames.map((m) => (<option key={m} value={m}>{m}</option>))}
              </select>
              <input className="border rounded px-2 py-1 w-24" value={ano} onChange={(e) => setAno(e.target.value)} />
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={saveMetas}>Salvar metas</button>
            </div>
          </div>

          {!idCliente && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4">
              Selecione uma empresa no topo para salvar metas por cliente.
            </div>
          )}

          {/* Resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-slate-500">Meta total</div>
              <div className="text-2xl font-bold">{formatCurrency(totalMeta)}</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-slate-500">Gasto do mês (fictício)</div>
              <div className="text-2xl font-bold text-rose-600">{formatCurrency(totalGasto)}</div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-slate-500">Variação</div>
              <div className={`text-2xl font-bold ${totalGasto > totalMeta ? "text-rose-600" : "text-emerald-600"}`}>
                {formatCurrency(totalGasto - totalMeta)}
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-slate-500">Atingimento</div>
              <div className="text-2xl font-bold">{atingimento.toFixed(1)}%</div>
            </div>
          </div>

          {/* Edição de metas */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h2 className="font-semibold text-slate-800 mb-3">Definir metas</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border px-2 py-2 text-left">Categoria</th>
                    <th className="border px-2 py-2 text-right">Meta (R$)</th>
                    <th className="border px-2 py-2 text-right">Gasto (R$)</th>
                    <th className="border px-2 py-2 text-right">Diferença</th>
                    <th className="border px-2 py-2 text-right">Atingimento</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas
                    .sort((a, b) => (a.nomePai || a.nome).localeCompare(b.nomePai || b.nome) || (a.tipo === "pai" ? -1 : 1))
                    .map((l) => {
                      const diff = l.gasto - l.meta;
                      const perc = l.meta > 0 ? (l.gasto / l.meta) * 100 : 0;
                      return (
                        <tr key={l.id} className={l.tipo === "pai" ? "bg-white" : "bg-slate-50"}>
                          <td className="border px-2 py-2">
                            {l.tipo === "filha" ? <span className="text-slate-400 mr-1">└</span> : null}
                            {l.tipo === "filha" && l.nomePai ? <span className="text-slate-500 mr-1">{l.nomePai} -</span> : null}
                            <span className="font-medium">{l.nome}</span>
                          </td>
                          <td className="border px-2 py-1 text-right">
                            <input
                              type="text"
                              inputMode="numeric"
                              className="border rounded px-2 py-1 text-right w-36"
                              value={formatCurrency(l.meta)}
                              onChange={(e) => onChangeMeta(l.id, e.target.value)}
                            />
                          </td>
                          <td className="border px-2 py-2 text-right">{formatCurrency(l.gasto)}</td>
                          <td className={`border px-2 py-2 text-right ${diff > 0 ? "text-rose-600" : "text-emerald-600"}`}>{formatCurrency(diff)}</td>
                          <td className="border px-2 py-2 text-right">{perc.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Meta x Gasto por rubrica (agrupado)</h3>
              <BarChart
                height={320}
                xAxis={[{ scaleType: "band", data: porPai.labels }]}
                series={[
                  { data: porPai.metasArr, label: "Meta (R$)", color: "#2563eb" },
                  { data: porPai.gastosArr, label: "Gasto (R$)", color: "#ef4444" },
                ]}
              />
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Distribuição de metas</h3>
              <PieChart height={320} series={[{ data: pieMeta }]} slotProps={{ legend: { hidden: false } }} />
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold text-slate-800 mb-2">Distribuição de gastos</h3>
              <PieChart height={320} series={[{ data: pieGasto }]} slotProps={{ legend: { hidden: false } }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
