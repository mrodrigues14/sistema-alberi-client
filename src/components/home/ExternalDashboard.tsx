"use client";
import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart as MUIBarChart } from '@mui/x-charts/BarChart';
import styles from '@/app/home/page.module.css';
import { ResumoMes } from '@/lib/hooks/useDashboardResumo';

interface ExternalDashboardProps {
	idCliente?: number | null;
	nomeEmpresa: string;
	mes: string;
	ano: string;
	setMes: (v: string) => void;
	setAno: (v: string) => void;
	resumo: ResumoMes | null;
	formatCurrency: (v?: number | null) => string;
	palette: string[];
	Icons: { [k: string]: React.FC<any> } & { bank: React.FC<any>; category: React.FC<any>; balance: React.FC<any>; };
}

export const ExternalDashboard: React.FC<ExternalDashboardProps> = ({
	idCliente,
	nomeEmpresa,
	mes,
	ano,
	setMes,
	setAno,
	resumo,
	formatCurrency,
	palette,
	Icons,
}) => {
	// Cálculo local do saldo previsto
	const entradasPrevistas = Number(resumo?.totalEntradasPrevistas || 0);
	const saidasPrevistas = Number(resumo?.totalSaidasPrevistas || 0);
	const saldoMes = Number(resumo?.saldoMes || 0);
	const saldoPrevisto = saldoMes + entradasPrevistas - saidasPrevistas;

	// Função para converter número do mês em nome completo
	const getNomeMes = (mesNumero: string) => {
		const meses = [
			'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		];
		const indice = parseInt(mesNumero) - 1;
		return meses[indice] || 'Mês';
	};

	const mesAnoCompleto = `${getNomeMes(mes)}/${ano}`;

	return (
		<div className={styles.section}>
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
				<h2 className={styles.sectionTitle}>{mesAnoCompleto}{nomeEmpresa ? ` - ${nomeEmpresa}` : ''}</h2>
				<div className="flex flex-wrap items-end gap-3">
					<div>
						<label className="block text-sm text-gray-600">Mês</label>
						<select className="border rounded px-2 py-1" value={mes} onChange={e => setMes(e.target.value)}>
							{Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
								<option key={m} value={m}>{m}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm text-gray-600">Ano</label>
						<input className="border rounded px-2 py-1 w-24" value={ano} onChange={e => setAno(e.target.value)} />
					</div>
				</div>
			</div>

			{!idCliente && (
				<div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 mb-6">
					Selecione uma empresa para visualizar os dados do mês.
				</div>
			)}

			{idCliente && (
				<div className={`${styles.statsGrid} mb-2`}>
					<div className={styles.statsCard}>
						<div className={styles.statsContent}>
							<div className={`${styles.statsIcon} ${styles.greenIcon}`}><Icons.bank /></div>
							<div>
								<p className={styles.statsLabel}>Total Entradas</p>
								<p className={styles.statsValue}>{formatCurrency(resumo?.totalEntradas)}</p>
							</div>
						</div>
					</div>
					<div className={styles.statsCard}>
						<div className={styles.statsContent}>
							<div className={`${styles.statsIcon} ${styles.orangeIcon}`}><Icons.category /></div>
							<div>
								<p className={styles.statsLabel}>Total Saídas</p>
								<p className={styles.statsValue}>{formatCurrency(resumo?.totalSaidas)}</p>
							</div>
						</div>
					</div>
					<div className={styles.statsCard}>
						<div className={styles.statsContent}>
							<div className={`${styles.statsIcon} ${styles.blueIcon}`}><Icons.balance /></div>
							<div>
								<p className={styles.statsLabel}>Saldo do Mês</p>
								<p className={`${styles.statsValue} ${Number(resumo?.saldoMes) < 0 ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(resumo?.saldoMes)}</p>
							</div>
						</div>
					</div>
					<div className={styles.statsCard}>
						<div className={styles.statsContent}>
							<div className={`${styles.statsIcon} ${styles.blueIcon}`}><Icons.balance /></div>
							<div>
								<p className={styles.statsLabel}>Saldo da Conta</p>
								<p className={`${styles.statsValue} ${Number(resumo?.saldoConta) < 0 ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(resumo?.saldoConta)}</p>
								<span className="text-[11px] mt-1 text-indigo-500 block">sem previstos</span>
							</div>
						</div>
					</div>
				</div>
			)}
			{idCliente && (
				<div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 flex flex-col">
						<span className="font-medium text-emerald-700">Entradas Previstas</span>
						<span className="text-emerald-900 text-lg font-semibold">{formatCurrency(resumo?.totalEntradasPrevistas)}</span>
					</div>
					<div className="rounded-xl border border-dashed border-rose-300 bg-rose-50 px-4 py-3 flex flex-col">
						<span className="font-medium text-rose-700">Saídas Previstas</span>
						<span className="text-rose-900 text-lg font-semibold">{formatCurrency(resumo?.totalSaidasPrevistas)}</span>
					</div>
					<div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50 px-4 py-3 flex flex-col">
						<span className="font-medium text-indigo-700">Saldo Previsto</span>
						<span className={`text-lg font-semibold ${saldoPrevisto < 0 ? 'text-red-600' : 'text-indigo-900'}`}>{formatCurrency(saldoPrevisto)}</span>
						<span className="text-[11px] mt-1 text-indigo-500">= Saldo do Mês + Entradas Previstas - Saídas Previstas</span>
					</div>
				</div>
			)}
			{idCliente && (
				<div className="-mt-4 mb-6 text-xs text-slate-500 flex flex-wrap gap-4">
					<span>Saldo Inicial (soma de bancos): <strong className="text-slate-700">{formatCurrency(resumo?.saldoInicialCliente)}</strong></span>
				</div>
			)}

			{idCliente && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-lg font-semibold">Entradas x Saídas</h3>
						</div>
						<div className="relative flex flex-col items-center">
							{Number(resumo?.totalEntradas || 0) === 0 && Number(resumo?.totalSaidas || 0) === 0 ? (
								<div className="text-sm text-gray-500 py-8">Sem dados para o período.</div>
							) : (
								<PieChart
									height={260}
									slotProps={{ legend: { hidden: false } }}
									series={[{
										innerRadius: 70,
										outerRadius: 120,
										paddingAngle: 2,
										cornerRadius: 4,
										data: [
											{ id: 0, value: Number(resumo?.totalEntradas || 0), label: 'Entradas', color: '#22c55e' },
											{ id: 1, value: Number(resumo?.totalSaidas || 0), label: 'Saídas', color: '#ef4444' },
										]
									}]} />
							)}
						</div>
					</div>
					<div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-lg font-semibold">Top 5 categorias por gasto</h3>
						</div>
						{(() => {
							const categorias = (resumo?.topCategorias || [])
								.filter((c: { categoria?: string }) => !!c?.categoria && !/^sem\s*categoria/i.test(c.categoria.trim()))
								.slice(0, 5)
								.map((c: { categoria: string; total: number }, i: number) => ({
									label: c.categoria,
									value: c.total,
									color: palette[(i + 3) % palette.length]
								}));
							if (!categorias.length) return <div className="text-sm text-gray-500">Sem dados para o período.</div>;
							return (
								<div className="w-full overflow-x-auto">
									<MUIBarChart
										height={300}
										xAxis={[{ scaleType: 'band', data: categorias.map(c => c.label) }]}
										series={[{
											data: categorias.map(c => c.value),
											label: 'Gasto',
											color: palette[3],
										}]}
										margin={{ left: 40, right: 10, top: 10, bottom: 40 }}
									/>
								</div>
							);
						})()}
					</div>
				</div>
			)}
		</div>
	);
};

export default ExternalDashboard;
