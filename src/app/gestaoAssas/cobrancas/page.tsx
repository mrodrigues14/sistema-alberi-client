'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

interface Payment {
  id: string;
  customer: string;
  customerName: string;
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

// Serviço mock para cobranças
class PaymentService {
  private getMockPayments(): Payment[] {
    return [
      {
        id: 'pay_001',
        customer: 'cus_001',
        customerName: 'João Silva',
        value: 150.00,
        netValue: 147.00,
        description: 'Mensalidade Janeiro',
        billingType: 'BOLETO',
        status: 'RECEIVED',
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
        customerName: 'Maria Santos',
        value: 200.00,
        netValue: 196.00,
        description: 'Mensalidade Fevereiro',
        billingType: 'PIX',
        status: 'PENDING',
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
        customerName: 'Empresa ABC Ltda',
        value: 500.00,
        netValue: 490.00,
        description: 'Serviços Março',
        billingType: 'CREDIT_CARD',
        status: 'OVERDUE',
        dueDate: '2024-03-10',
        originalDueDate: '2024-03-10',
        invoiceUrl: 'https://example.com/invoice3',
        invoiceNumber: 'INV003',
        deleted: false,
        anticipated: false,
        anticipable: true,
        dateCreated: '2024-03-05'
      },
      {
        id: 'pay_004',
        customer: 'cus_004',
        customerName: 'Pedro Oliveira',
        value: 300.00,
        netValue: 294.00,
        description: 'Consultoria Abril',
        billingType: 'BOLETO',
        status: 'RECEIVED',
        dueDate: '2024-04-15',
        originalDueDate: '2024-04-15',
        paymentDate: '2024-04-14',
        invoiceUrl: 'https://example.com/invoice4',
        invoiceNumber: 'INV004',
        deleted: false,
        anticipated: false,
        anticipable: true,
        dateCreated: '2024-04-10'
      },
      {
        id: 'pay_005',
        customer: 'cus_005',
        customerName: 'Consultoria XYZ',
        value: 750.00,
        netValue: 735.00,
        description: 'Projeto Maio',
        billingType: 'PIX',
        status: 'PENDING',
        dueDate: '2024-05-20',
        originalDueDate: '2024-05-20',
        invoiceUrl: 'https://example.com/invoice5',
        invoiceNumber: 'INV005',
        deleted: false,
        anticipated: false,
        anticipable: true,
        dateCreated: '2024-05-15'
      }
    ];
  }

  async getPayments(): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getMockPayments();
  }

  async createPayment(paymentData: Omit<Payment, 'id' | 'dateCreated'>): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...paymentData,
      id: `pay_${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
  }
}

const paymentService = new PaymentService();

export default function CobrancasPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Erro ao carregar cobranças:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusInfo = (status: Payment['status']) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: 'Pago',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircleIcon
        };
      case 'PENDING':
        return {
          label: 'Pendente',
          color: 'bg-yellow-100 text-yellow-800',
          icon: ClockIcon
        };
      case 'OVERDUE':
        return {
          label: 'Vencido',
          color: 'bg-red-100 text-red-800',
          icon: ExclamationTriangleIcon
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: DocumentDuplicateIcon
        };
    }
  };

  const getBillingTypeLabel = (type: Payment['billingType']) => {
    const labels = {
      'BOLETO': 'Boleto',
      'CREDIT_CARD': 'Cartão de Crédito',
      'DEBIT_CARD': 'Cartão de Débito',
      'TRANSFER': 'Transferência',
      'DEPOSIT': 'Depósito',
      'PIX': 'PIX'
    };
    return labels[type] || type;
  };

  const getTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'RECEIVED')
      .reduce((sum, p) => sum + p.value, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.value, 0);
  };

  const getOverdueAmount = () => {
    return payments
      .filter(p => p.status === 'OVERDUE')
      .reduce((sum, p) => sum + p.value, 0);
  };

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
            Gerenciar Cobranças
          </h1>
          <p className="text-gray-600">
            Visualize, crie e gerencie todas as suas cobranças e pagamentos.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500">
                <DocumentDuplicateIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Cobranças</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recebido</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalRevenue())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getPendingAmount())}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vencido</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getOverdueAmount())}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cobranças..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="PENDING">Pendente</option>
              <option value="RECEIVED">Pago</option>
              <option value="OVERDUE">Vencido</option>
            </select>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Nova Cobrança
            </button>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center p-4 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobrança
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forma
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => {
                    const statusInfo = getStatusInfo(payment.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {payment.description}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{payment.invoiceNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(payment.value)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Líquido: {formatCurrency(payment.netValue)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getBillingTypeLabel(payment.billingType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => console.log('Visualizar cobrança:', payment.id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Visualizar"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => console.log('Duplicar cobrança:', payment.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Duplicar"
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma cobrança encontrada' : 'Nenhuma cobrança cadastrada'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca.' 
                  : 'Comece criando sua primeira cobrança.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                >
                  <PlusIcon className="h-5 w-5" />
                  Criar Cobrança
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
} 