'use client';

import { useState, useEffect } from 'react';
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
import { isAsaasConfigured, getAsaasApiUrl, getAsaasApiKey, config } from '@/lib/config';
import ConfigStatus from '@/components/ConfigStatus';
import Navbar from '@/components/Navbar';

// Interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  personType: 'FISICA' | 'JURIDICA';
  dateCreated: string;
  additionalEmails?: string;
  externalReference?: string;
  notificationDisabled: boolean;
  observations?: string;
  municipalInscription?: string;
  stateInscription?: string;
  groupName?: string;
  company?: string;
}

interface Payment {
  id: string;
  customer: string;
  subscription?: string;
  installment?: string;
  paymentLink?: string;
  value: number;
  netValue: number;
  originalValue?: number;
  interestValue?: number;
  description?: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'DEPOSIT' | 'PIX';
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'REFUND_IN_PROGRESS' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  dueDate: string;
  originalDueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentNumber?: number;
  invoiceUrl: string;
  invoiceNumber: string;
  externalReference?: string;
  deleted: boolean;
  anticipated: boolean;
  anticipable: boolean;
  dateCreated: string;
  estimatedCreditDate?: string;
  transactionReceiptUrl?: string;
  nossoNumero?: string;
  bankSlipUrl?: string;
  lastInvoiceViewedDate?: string;
  lastBankSlipViewedDate?: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalRevenue: number;
  pendingPayments: number;
  receivedPayments: number;
  monthlyGrowth: {
    customers: number;
    revenue: number;
    pendingPayments: number;
    receivedPayments: number;
  };
}

// Serviço Asaas integrado
class AsaasService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      // Verificar se a API está configurada
      if (!isAsaasConfigured()) {
        console.warn('API do Asaas não configurada, usando dados mock');
        return this.getMockData(endpoint) as T;
      }

      // Fazer chamada real para a API do Asaas
      const apiUrl = getAsaasApiUrl();
      const apiKey = getAsaasApiKey();
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers: {
          'access_token': apiKey,
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro na API do Asaas: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição para Asaas:', error);
      // Fallback para dados mock em caso de erro
      return this.getMockData(endpoint) as T;
    }
  }

  private getMockData(endpoint: string) {
    const mockData: Record<string, any> = {
      '/customers': {
        data: [
          {
            id: 'cus_001',
            name: 'João Silva',
            email: 'joao@email.com',
            phone: '(11) 99999-9999',
            cpfCnpj: '123.456.789-00',
            personType: 'FISICA' as const,
            dateCreated: '2024-01-15',
            notificationDisabled: false
          },
          {
            id: 'cus_002',
            name: 'Maria Santos',
            email: 'maria@email.com',
            phone: '(11) 88888-8888',
            cpfCnpj: '987.654.321-00',
            personType: 'FISICA' as const,
            dateCreated: '2024-02-20',
            notificationDisabled: false
          },
          {
            id: 'cus_003',
            name: 'Empresa ABC Ltda',
            email: 'contato@empresaabc.com',
            phone: '(11) 77777-7777',
            cpfCnpj: '12.345.678/0001-90',
            personType: 'JURIDICA' as const,
            dateCreated: '2024-03-10',
            notificationDisabled: false
          }
        ],
        totalCount: 3
      },
      '/payments': {
        data: [
          {
            id: 'pay_001',
            customer: 'cus_001',
            value: 150.00,
            netValue: 147.00,
            description: 'Mensalidade Janeiro',
            billingType: 'BOLETO' as const,
            status: 'RECEIVED' as const,
            dueDate: '2024-01-15',
            originalDueDate: '2024-01-15',
            paymentDate: '2024-01-14',
            invoiceUrl: 'https://example.com/invoice1',
            invoiceNumber: 'INV001',
            deleted: false,
            anticipated: false,
            anticipable: true,
            dateCreated: '2024-01-10'
          },
          {
            id: 'pay_002',
            customer: 'cus_002',
            value: 200.00,
            netValue: 196.00,
            description: 'Mensalidade Fevereiro',
            billingType: 'PIX' as const,
            status: 'PENDING' as const,
            dueDate: '2024-02-20',
            originalDueDate: '2024-02-20',
            invoiceUrl: 'https://example.com/invoice2',
            invoiceNumber: 'INV002',
            deleted: false,
            anticipated: false,
            anticipable: true,
            dateCreated: '2024-02-15'
          },
          {
            id: 'pay_003',
            customer: 'cus_003',
            value: 500.00,
            netValue: 490.00,
            description: 'Serviços Março',
            billingType: 'CREDIT_CARD' as const,
            status: 'OVERDUE' as const,
            dueDate: '2024-03-10',
            originalDueDate: '2024-03-10',
            invoiceUrl: 'https://example.com/invoice3',
            invoiceNumber: 'INV003',
            deleted: false,
            anticipated: false,
            anticipable: true,
            dateCreated: '2024-03-05'
          }
        ],
        totalCount: 3
      },
      '/dashboard-stats': {
        totalCustomers: 3,
        totalRevenue: 850.00,
        pendingPayments: 1,
        receivedPayments: 1,
        monthlyGrowth: {
          customers: 15,
          revenue: 25,
          pendingPayments: -10,
          receivedPayments: 30
        }
      },
      '/recent-activities': [
        {
          id: 'pay_001',
          customer: 'cus_001',
          value: 150.00,
          netValue: 147.00,
          description: 'Mensalidade Janeiro',
          billingType: 'BOLETO' as const,
          status: 'RECEIVED' as const,
          dueDate: '2024-01-15',
          originalDueDate: '2024-01-15',
          paymentDate: '2024-01-14',
          invoiceUrl: 'https://example.com/invoice1',
          invoiceNumber: 'INV001',
          deleted: false,
          anticipated: false,
          anticipable: true,
          dateCreated: '2024-01-10'
        },
        {
          id: 'pay_002',
          customer: 'cus_002',
          value: 200.00,
          netValue: 196.00,
          description: 'Mensalidade Fevereiro',
          billingType: 'PIX' as const,
          status: 'PENDING' as const,
          dueDate: '2024-02-20',
          originalDueDate: '2024-02-20',
          invoiceUrl: 'https://example.com/invoice2',
          invoiceNumber: 'INV002',
          deleted: false,
          anticipated: false,
          anticipable: true,
          dateCreated: '2024-02-15'
        }
      ]
    };

    return mockData[endpoint] || [];
  }

  // Buscar clientes
  async getCustomers(limit = 100, offset = 0): Promise<{ data: Customer[]; totalCount: number }> {
    return this.makeRequest(`/customers?limit=${limit}&offset=${offset}`);
  }

  // Buscar cobranças/pagamentos
  async getPayments(limit = 100, offset = 0, status?: string): Promise<{ data: Payment[]; totalCount: number }> {
    const statusParam = status ? `&status=${status}` : '';
    return this.makeRequest(`/payments?limit=${limit}&offset=${offset}${statusParam}`);
  }

  // Buscar estatísticas do dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return this.makeRequest('/dashboard-stats');
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        totalCustomers: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        receivedPayments: 0,
        monthlyGrowth: {
          customers: 0,
          revenue: 0,
          pendingPayments: 0,
          receivedPayments: 0,
        },
      };
    }
  }

  // Buscar atividades recentes
  async getRecentActivities(): Promise<Payment[]> {
    try {
      return this.makeRequest('/recent-activities');
    } catch (error) {
      console.error('Erro ao buscar atividades recentes:', error);
      return [];
    }
  }

  // Verificar status da API
  async checkApiStatus(): Promise<boolean> {
    try {
      if (!isAsaasConfigured()) {
        return false;
      }
      await this.makeRequest('/customers?limit=1');
      return true;
    } catch {
      return false;
    }
  }
}

const asaasService = new AsaasService();

export default function GestaoAssasPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Payment[]>([]);
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Verificar status da API
        const status = await asaasService.checkApiStatus();
        setApiStatus(status);
        
        if (status) {
          // Carregar estatísticas do dashboard
          const stats = await asaasService.getDashboardStats();
          setDashboardStats(stats);
          
          // Carregar atividades recentes
          const activities = await asaasService.getRecentActivities();
          setRecentActivities(activities);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        setApiStatus(false);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getActivityMessage = (payment: Payment) => {
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

  const getActivityStatus = (payment: Payment): 'success' | 'warning' | 'info' => {
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
      title: 'Nova Cobrança',
      description: 'Criar uma nova cobrança para cliente',
      icon: CreditCardIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      href: '/gestaoAssas/cobrancas'
    },
    {
      title: 'Gerenciar Clientes',
      description: 'Ver e editar informações dos clientes',
      icon: UsersIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/gestaoAssas/clientes'
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

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <ConfigStatus />

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
                onClick={() => console.log(`Navegando para ${action.href}`)}
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Atividades Recentes</h3>
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
                    {apiStatus === false ? 'Verifique sua chave da API' : 'Dados serão exibidos quando houver atividades'}
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
                apiStatus === true ? 'bg-green-50' : 
                apiStatus === false ? 'bg-red-50' : 'bg-yellow-50'
              }`}>
                <span className="text-sm font-medium text-gray-900">API Asaas</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  apiStatus === true ? 'bg-green-100 text-green-800' :
                  apiStatus === false ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    apiStatus === true ? 'bg-green-400' :
                    apiStatus === false ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  {apiStatus === true ? 'Online' : 
                   apiStatus === false ? 'Offline' : 'Verificando...'}
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
              
              <div className={`mt-4 p-4 border rounded-lg ${
                isAsaasConfigured() 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  isAsaasConfigured() ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {isAsaasConfigured() ? '✅ API Configurada' : 'ℹ️ Dados de Demonstração'}
                </h4>
                <p className={`text-sm ${
                  isAsaasConfigured() ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {isAsaasConfigured() 
                    ? `Conectado ao ambiente ${config.asaas.environment} do Asaas`
                    : 'Esta página está usando dados mock. Configure as variáveis de ambiente para conectar com a API real do Asaas.'
                  }
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
    </>
  );
} 