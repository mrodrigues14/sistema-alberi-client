'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

interface ReportData {
  totalRevenue: number;
  totalCustomers: number;
  totalPayments: number;
  pendingPayments: number;
  receivedPayments: number;
  overduePayments: number;
  monthlyGrowth: {
    revenue: number;
    customers: number;
    payments: number;
  };
  topCustomers: Array<{
    name: string;
    totalPaid: number;
    paymentsCount: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    total: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    payments: number;
  }>;
}

// Serviço mock para relatórios
class ReportService {
  private getMockReportData(): ReportData {
    return {
      totalRevenue: 1850.00,
      totalCustomers: 5,
      totalPayments: 8,
      pendingPayments: 2,
      receivedPayments: 5,
      overduePayments: 1,
      monthlyGrowth: {
        revenue: 25,
        customers: 15,
        payments: 30
      },
      topCustomers: [
        { name: 'Empresa ABC Ltda', totalPaid: 500.00, paymentsCount: 1 },
        { name: 'João Silva', totalPaid: 300.00, paymentsCount: 2 },
        { name: 'Maria Santos', totalPaid: 200.00, paymentsCount: 1 },
        { name: 'Pedro Oliveira', totalPaid: 300.00, paymentsCount: 1 },
        { name: 'Consultoria XYZ', totalPaid: 550.00, paymentsCount: 1 }
      ],
      paymentMethods: [
        { method: 'Boleto', count: 3, total: 750.00 },
        { method: 'PIX', count: 2, total: 950.00 },
        { method: 'Cartão de Crédito', count: 1, total: 500.00 },
        { method: 'Transferência', count: 2, total: 650.00 }
      ],
      monthlyRevenue: [
        { month: 'Jan', revenue: 150.00, payments: 1 },
        { month: 'Fev', revenue: 200.00, payments: 1 },
        { month: 'Mar', revenue: 500.00, payments: 1 },
        { month: 'Abr', revenue: 300.00, payments: 1 },
        { month: 'Mai', revenue: 700.00, payments: 2 }
      ]
    };
  }

  async getReportData(): Promise<ReportData> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return this.getMockReportData();
  }
}

const reportService = new ReportService();

export default function RelatoriosPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReportData();
      setReportData(data);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar relatórios</h1>
            <p className="text-gray-600">Tente novamente mais tarde.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Relatórios e Estatísticas
          </h1>
          <p className="text-gray-600">
            Visualize métricas importantes sobre seus clientes e cobranças.
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Período de Análise</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalRevenue)}</p>
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{formatPercentage(reportData.monthlyGrowth.revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalCustomers}</p>
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{formatPercentage(reportData.monthlyGrowth.customers)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500">
                <DocumentDuplicateIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cobranças Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.pendingPayments}</p>
                <div className="flex items-center text-sm">
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">-10%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-emerald-500">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cobranças Pagas</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.receivedPayments}</p>
                <div className="flex items-center text-sm">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{formatPercentage(reportData.monthlyGrowth.payments)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Clientes</h3>
            <div className="space-y-4">
              {reportData.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.paymentsCount} pagamento(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(customer.totalPaid)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formas de Pagamento</h3>
            <div className="space-y-4">
              {reportData.paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.method}</p>
                      <p className="text-sm text-gray-500">{method.count} transação(ões)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(method.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faturamento Mensal</h3>
          <div className="grid grid-cols-5 gap-4">
            {reportData.monthlyRevenue.map((month, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 mb-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(month.revenue)}
                  </div>
                  <div className="text-sm text-gray-600">{month.month}</div>
                </div>
                <div className="text-xs text-gray-500">{month.payments} pagamento(s)</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3" />
              <div>
                <h4 className="text-lg font-semibold">Taxa de Conversão</h4>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm opacity-90">Cobranças pagas vs. criadas</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 mr-3" />
              <div>
                <h4 className="text-lg font-semibold">Crescimento</h4>
                <p className="text-2xl font-bold">+25%</p>
                <p className="text-sm opacity-90">Comparado ao mês anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 mr-3" />
              <div>
                <h4 className="text-lg font-semibold">Ticket Médio</h4>
                <p className="text-2xl font-bold">{formatCurrency(reportData.totalRevenue / reportData.receivedPayments)}</p>
                <p className="text-sm opacity-90">Por cobrança paga</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
} 