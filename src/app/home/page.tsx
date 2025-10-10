'use client';

import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import styles from './page.module.css';
import { useClienteContext } from "@/context/ClienteContext";
import { useDashboardResumo } from "@/lib/hooks/useDashboardResumo";
import { usePermissions } from "@/lib/hooks/usePermissions";
import React, { useEffect, useMemo, useState } from "react";
import ExternalDashboard from '@/components/home/ExternalDashboard';
import { useSession } from "next-auth/react";
import { useCliente } from "@/lib/hooks/useCliente";
import { useMeusClientes } from "@/lib/hooks/useMeusClientes";
import ClienteSelectorPanel, { ClienteItem as ClienteItemPanel } from "@/components/ClienteSelectorPanel";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

// Ícones SVG inline para melhor performance - Mesmos da subnavbar
const Icons = {
  tasks: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  studies: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  bank: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  client: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  user: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  bug: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  asaas: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  contract: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  category: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  supplier: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  balance: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
};

// Mapeamento de ícones por ID do módulo
const iconMap: { [key: string]: () => JSX.Element } = {
  tasks: Icons.tasks,
  studies: Icons.studies,
  extrato: Icons.bank,
  configuracaoCliente: Icons.client,
  configuracaoUsuario: Icons.user,
  chamados: Icons.bug,
  gestaoAssas: Icons.asaas,
  contrato: Icons.contract,
  banco: Icons.bank,
  categoria: Icons.category,
  fornecedor: Icons.supplier,
  saldoInicial: Icons.balance,
};

export default function Home() {
  const { userModules, userRole, getRoleDescription, getPermissionStats } = usePermissions();
  const { idCliente, setIdCliente } = useClienteContext();
  // Seleção global de empresa: quando não há empresa selecionada, mostramos o seletor
  // Tipagem mínima de Cliente para este arquivo
  type ClienteItem = { idcliente: number; apelido?: string | null; nome: string };
  const rolesLimitados = ['usuario interno (restrito)', 'usuario externo (consulta)', 'usuario externo (financeiro)'];
  const { clientes: clientesAll = [], isLoading: loadingClientes } = useCliente();
  const { meusClientes = [], isLoading: loadingMeus } = useMeusClientes();
  const [viewMode, setViewMode] = useState<'todos' | 'meus'>(() => {
    if (rolesLimitados.includes(userRole || '')) return 'meus';
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('viewMode') as 'todos' | 'meus' | null;
      if (saved) return saved;
    }
    return 'todos';
  });
  useEffect(() => {
    // Se o role mudar para um limitado, força modo 'meus'
    if (rolesLimitados.includes(userRole || '')) {
      setViewMode('meus');
      if (typeof window !== 'undefined') sessionStorage.setItem('viewMode', 'meus');
    }
  }, [userRole]);

  const [searchQuery, setSearchQuery] = useState('');
  const [mes, setMes] = useState<string>(() => String(new Date().getMonth() + 1).padStart(2, '0'));
  const [ano, setAno] = useState<string>(() => String(new Date().getFullYear()));
  const { resumo, isLoading } = useDashboardResumo(idCliente ?? undefined, mes, ano);
  console.log(resumo)
  const roleLc = (userRole || '').toLowerCase();
  const isUsuarioExterno = roleLc.includes('usuario externo');
  const isAdminOrInterno = roleLc === 'administrador' || roleLc === 'usuario interno';
  // Somente passa ID válido (evita -1 "Meus" e 68 "Todos")
  const idClienteValido = typeof idCliente === 'number' && idCliente > 0 && idCliente !== 68 ? idCliente : undefined;
  // Deriva nomeEmpresa sem disparar fetch de cliente quando não houver ID (evita pegar o primeiro cliente por engano)
  let nomeEmpresa = '';
  if (idClienteValido) {
    const found = (clientesAll as any[])?.find((c) => c.idcliente === idClienteValido);
    nomeEmpresa = found?.apelido || found?.nome || '';
  }
  if (!nomeEmpresa && typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('selectedCliente');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.nome) nomeEmpresa = parsed.nome;
      }
    } catch {}
  }
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] || '';

  const handleClienteSelect = (clienteSel: ClienteItem) => {
    const nome = clienteSel.apelido || clienteSel.nome;
    sessionStorage.setItem('selectedCliente', JSON.stringify({ id: clienteSel.idcliente, nome }));
    // Como o Navbar, grava viewMode atual
    sessionStorage.setItem('viewMode', viewMode);
    // Atualiza contexto global imediatamente
    setIdCliente(clienteSel.idcliente);
  };

  const handleTodosClientes = () => {
    sessionStorage.setItem('selectedCliente', JSON.stringify({ id: 68, nome: 'Todos Clientes' }));
    sessionStorage.setItem('viewMode', 'todos');
    setIdCliente(68);
  };
  const handleMeusClientes = () => {
    const label = userRole === 'usuario' ? 'Minhas Empresas' : 'Meus Clientes';
    sessionStorage.setItem('selectedCliente', JSON.stringify({ id: -1, nome: label }));
    sessionStorage.setItem('viewMode', 'meus');
    setIdCliente(-1);
  };

  // Utils
  const formatCurrency = (val?: number | null) =>
    val == null
      ? '—'
      : val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const palette = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];

  // Converte os módulos do usuário para o formato esperado pela interface
  const quickActions = userModules.map(module => ({
    title: module.title,
    icon: iconMap[module.id] || Icons.tasks,
    href: module.href,
    description: module.description,
    colorClass: styles[module.colorClass as keyof typeof styles] || styles.greenModule
  }));

  const stats = getPermissionStats();

  return (
    <>
      <div className="top-0 left-0 w-full z-10">
        <Navbar />
      </div>

  <div className={`${font.className} ${styles.container} bg-slate-50`}>
        {/* Header Section - versão normal para roles internos e compacta para usuário externo */}
        <div className={styles.header}>
          <div className={isUsuarioExterno ? styles.headerContentCompact : styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.logoContainer}>
                <Image
                  src="/icone_alberi.png"
                  alt="Alberi Consult Logo"
                  width={isUsuarioExterno ? 96 : 200}
                  height={isUsuarioExterno ? 96 : 200}
                  className={isUsuarioExterno ? styles.logoCompact : styles.logo}
                  priority
                />
              </div>
              <h1 className={isUsuarioExterno ? styles.titleCompact : styles.title}>
                Alberi Consult
              </h1>
              <p className={isUsuarioExterno ? styles.subtitleCompact : styles.subtitle}>
                Sistema de gestão financeira e administrativa
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Greeting banner */}
          <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">{`Bem-vindo(a)${firstName ? ", " + firstName : ''}`}</h2>
              <p className="text-sm text-slate-600 mt-1">
                {nomeEmpresa ? `Você está visualizando os dados de ${nomeEmpresa}.` : 'Selecione uma empresa para começar.'}
              </p>
            </div>
            {nomeEmpresa && (
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-300 bg-slate-100 text-slate-700 text-sm">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {nomeEmpresa}
              </span>
            )}
          </div>

          {/* Seletor de empresa posicionado abaixo do "Bem-vindo" e acima das Ações Rápidas */}
          {!nomeEmpresa && (
            <div className="mb-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-800">Selecione uma empresa para começar</h2>
                <p className="text-sm text-slate-600 mt-1">Sua escolha ficará salva e valerá para todo o sistema.</p>
              </div>
              <div className="p-5 pt-0">
                <ClienteSelectorPanel
                  userRole={userRole}
                  viewMode={viewMode}
                  setViewMode={(m) => { setViewMode(m); sessionStorage.setItem('viewMode', m); }}
                  clientesAll={clientesAll as ClienteItemPanel[]}
                  meusClientes={meusClientes as ClienteItemPanel[]}
                  onSelectCliente={(c) => handleClienteSelect(c as unknown as ClienteItem)}
                  onSelectTodos={handleTodosClientes}
                  onSelectMeus={handleMeusClientes}
                  compact={false}
                />
              </div>
            </div>
          )}
          {idClienteValido && (
            <ExternalDashboard
              idCliente={idCliente}
              nomeEmpresa={nomeEmpresa}
              mes={mes}
              ano={ano}
              setMes={setMes}
              setAno={setAno}
              resumo={resumo}
              formatCurrency={formatCurrency}
              palette={palette}
              Icons={Icons as any}
            />
          )}

          {/* Quick Actions */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Ações Rápidas
            </h2>
            {quickActions.length > 0 ? (
              <div className={`${styles.grid} ${quickActions.length > 6 ? styles.compactRow : ''}`}>
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className={styles.moduleCard}
                  >
                    <div className={styles.cardHeader}>
                      <div className={`${styles.moduleIcon} ${action.colorClass}`}>
                        <action.icon />
                      </div>
                      <h3 className={styles.moduleTitle}>
                        {action.title}
                      </h3>
                    </div>
                    <p className={styles.moduleDescription}>
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum módulo disponível
                </h3>
                <p className="text-gray-500">
                  Seu usuário não tem permissão para acessar nenhum módulo do sistema.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Entre em contato com o administrador para solicitar acesso.
                </p>
              </div>
            )}
          </div>

          {/* Stats Section - apenas para administrador e usuário interno */}
          {isAdminOrInterno && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                Resumo do Sistema
              </h2>
              <div className={styles.statsGrid}>
                <div className={styles.statsCard}>
                  <div className={styles.statsContent}>
                    <div className={`${styles.statsIcon} ${styles.blueIcon}`}>
                      <Icons.client />
                    </div>
                    <div>
                      <p className={styles.statsLabel}>Clientes Ativos</p>
                      <p className={styles.statsValue}>68</p>
                    </div>
                  </div>
                </div>

                <div className={styles.statsCard}>
                  <div className={styles.statsContent}>
                    <div className={`${styles.statsIcon} ${styles.greenIcon}`}>
                      <Icons.bank />
                    </div>
                    <div>
                      <p className={styles.statsLabel}>Extratos Mapeados</p>
                      <p className={styles.statsValue}>1.2k</p>
                    </div>
                  </div>
                </div>

                <div className={styles.statsCard}>
                  <div className={styles.statsContent}>
                    <div className={`${styles.statsIcon} ${styles.purpleIcon}`}>
                      <Icons.studies />
                    </div>
                    <div>
                      <p className={styles.statsLabel}>Estudos Realizados</p>
                      <p className={styles.statsValue}>156</p>
                    </div>
                  </div>
                </div>

                {/* Card adicional mostrando permissões do usuário */}
                <div className={styles.statsCard}>
                  <div className={styles.statsContent}>
                    <div className={`${styles.statsIcon} ${styles.orangeIcon}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className={styles.statsLabel}>Seu Acesso</p>
                      <p className={styles.statsValue}>{stats.accessibleModules}</p>
                      <p className="text-xs text-gray-500 mt-1">módulos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News Card */}
          <div className={styles.newsCard}>
            <div className={styles.newsContent}>
              <div className={styles.newsHeader}>
                <div className={styles.newsLogo}>
                  <Image
                    src="/logo.png"
                    alt="Notícias"
                    width={80}
                    height={80}
                  />
                </div>
                <h2 className={styles.newsTitle}>NOTÍCIAS</h2>
                <p className={styles.newsDescription}>
                  Fique por dentro das últimas atualizações e novidades do sistema Alberi Consult
                </p>
                <button className={styles.newsButton}>
                  Ver Notícias
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
