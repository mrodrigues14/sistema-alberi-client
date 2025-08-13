'use client';

import { useState } from 'react';
import { 
  CreditCardIcon, 
  ChartBarIcon, 
  UsersIcon, 
  DocumentDuplicateIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useAsaasDashboard } from '@/lib/hooks/useAsaas';
import ConfigStatus from '@/components/ConfigStatus';
import Navbar from '@/components/Navbar';
import ClientesModal from '@/components/gestaoAssas/ClientesModal';
import CobrancasModal from '@/components/gestaoAssas/CobrancasModal';

export default function GestaoAssasPage() {
  const { dashboardStats, recentActivities, apiStatus, loading, refreshData } = useAsaasDashboard();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getActivityMessage = (payment: any) => {
    switch (payment.status) {
      case 'RECEIVED':
        return `Pagamento recebido - ${payment.description || 'Cobrança'}`;
      case 'PENDING':
        return `Cobrança pendente - ${payment.description || 'Cobrança'}`;
      case 'OVERDUE':
        return `Cobrança vencida - ${payment.description || 'Cobrança'}`;
      default:
        return `${payment.description || 'Cobrança'} - ${payment.status}`;
    }
  };

  const getActivityStatus = (payment: any): 'success' | 'warning' | 'info' => {
    switch (payment.status) {
      case 'RECEIVED':
        return 'success';
      case 'OVERDUE':
        return 'warning';
      default:
        return 'info';
    }
  };

  const stats = dashboardStats ? [
    {
      label: 'Clientes Ativos',
      value: dashboardStats.totalCustomers.toLocaleString('pt-BR'),
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: `+${dashboardStats.monthlyGrowth.customers}%`
    },
    {
      label: 'Faturamento do Mês',
      value: formatCurrency(dashboardStats.totalRevenue),
      icon: BanknotesIcon,
      color: 'bg-green-500',
      change: `+${dashboardStats.monthlyGrowth.revenue}%`
    },
    {
      label: 'Cobranças Pendentes',
      value: dashboardStats.pendingPayments.toLocaleString('pt-BR'),
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: `${dashboardStats.monthlyGrowth.pendingPayments >= 0 ? '+' : ''}${dashboardStats.monthlyGrowth.pendingPayments}%`
    },
    {
      label: 'Cobranças Pagas',
      value: dashboardStats.receivedPayments.toLocaleString('pt-BR'),
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      change: `+${dashboardStats.monthlyGrowth.receivedPayments}%`
    }
  ] : [
    {
      label: 'Clientes Ativos',
      value: loading ? '...' : '0',
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+0%'
    },
    {
      label: 'Faturamento do Mês',  
      value: loading ? '...' : 'R$ 0,00',
      icon: BanknotesIcon,
      color: 'bg-green-500',
      change: '+0%'
    },
    {
      label: 'Cobranças Pendentes',
      value: loading ? '...' : '0',
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '+0%'
    },
    {
      label: 'Cobranças Pagas',
      value: loading ? '...' : '0',
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
      change: '+0%'
    }
  ];

  const quickActions = [
    {
      title: 'Gerenciar Cobranças',
      description: 'Criar e gerenciar cobranças',
      icon: CreditCardIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: 'openPaymentModal'
    },
    {
      title: 'Gerenciar Clientes',
      description: 'Ver e editar informações dos clientes',
      icon: UsersIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: 'openClientModal'
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios e estatísticas',
      icon: ChartBarIcon,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      href: '/gestaoAssas/relatorios'
    },
    {
      title: 'Clientes Inadimplentes',
      description: 'Gerenciar clientes em atraso',
      icon: ExclamationTriangleIcon,
      color: 'bg-red-600 hover:bg-red-700',
      href: '/gestaoAssas/inadimplentes'
    }
  ];

  const handleQuickAction = (action: string) => {
    if (action === 'openClientModal') {
      setShowClientModal(true);
    } else if (action === 'openPaymentModal') {
      setShowPaymentModal(true);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      
      <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestão Asaas - Painel de Controle
          </h1>
          <p className="text-gray-600">
            Gerencie suas cobranças, clientes e finances de forma simples e eficiente.
          </p>
        </div>

        {/* Config Status */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-6 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg`}
                onClick={() => {
                  if (action.action) {
                    handleQuickAction(action.action);
                  } else if (action.href) {
                    console.log(`Navegando para ${action.href}`);
                  }
                }}
              >
                <action.icon className="h-8 w-8 mb-3" />
                <h4 className="text-lg font-semibold mb-2">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Atividades Recentes</h3>
              <button
                onClick={refreshData}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Atualizar
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full mr-3 ${
                      getActivityStatus(activity) === 'success' ? 'bg-green-100' :
                      getActivityStatus(activity) === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {getActivityStatus(activity) === 'success' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : getActivityStatus(activity) === 'warning' ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <DocumentDuplicateIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {getActivityMessage(activity)}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.dateCreated)}
                        </p>
                        <p className="text-sm font-semibold text-gray-700">
                          {formatCurrency(activity.value)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma atividade recente encontrada</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {apiStatus?.status === false ? 'Verifique sua chave da API' : 'Dados serão exibidos quando houver atividades'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Status do Sistema</h3>
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                apiStatus?.status === true ? 'bg-green-50' : 
                apiStatus?.status === false ? 'bg-red-50' : 'bg-yellow-50'
              }`}>
                <span className="text-sm font-medium text-gray-900">API Asaas</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  apiStatus?.status === true ? 'bg-green-100 text-green-800' :
                  apiStatus?.status === false ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    apiStatus?.status === true ? 'bg-green-400' :
                    apiStatus?.status === false ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  {apiStatus?.status === true ? 'Online' : 
                   apiStatus?.status === false ? 'Offline' : 'Verificando...'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Banco de Dados</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                  Conectado
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Última Sincronização</span>
                <span className="text-sm text-gray-600">
                  {loading ? 'Carregando...' : 'Agora mesmo'}
                </span>
              </div>
              
              <div className="mt-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                <h4 className="font-semibold mb-2 text-blue-800">
                  ℹ️ Dados em Tempo Real
                </h4>
                <p className="text-sm text-blue-700">
                  Esta página está conectada diretamente com a API do Asaas. Os dados são atualizados em tempo real.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
              <h4 className="font-semibold mb-2">💡 Dica do Dia</h4>
              <p className="text-sm opacity-90">
                Use cobranças recorrentes para automatizar pagamentos mensais e aumentar sua eficiência!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>

      {/* Modais Modulares */}
      <ClientesModal 
        isOpen={showClientModal} 
        onClose={() => setShowClientModal(false)} 
      />
      
      <CobrancasModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
} 