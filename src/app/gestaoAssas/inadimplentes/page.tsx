'use client';

import { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

interface OverdueCustomer {
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cpfCnpj: string;
    personType: 'FISICA' | 'JURIDICA';
  };
  payment: {
    id: string;
    value: number;
    description: string;
    dueDate: string;
    status: string;
  };
  daysOverdue: number;
}

// Serviço mock para clientes inadimplentes
class OverdueService {
  private getMockOverdueCustomers(): OverdueCustomer[] {
    return [
      {
        customer: {
          id: 'cus_003',
          name: 'Empresa ABC Ltda',
          email: 'contato@empresaabc.com',
          phone: '(11) 77777-7777',
          cpfCnpj: '12.345.678/0001-90',
          personType: 'JURIDICA'
        },
        payment: {
          id: 'pay_003',
          value: 500.00,
          description: 'Serviços Março',
          dueDate: '2024-03-10',
          status: 'OVERDUE'
        },
        daysOverdue: 45
      },
      {
        customer: {
          id: 'cus_006',
          name: 'João Pereira',
          email: 'joao.pereira@email.com',
          phone: '(11) 44444-4444',
          cpfCnpj: '555.666.777-88',
          personType: 'FISICA'
        },
        payment: {
          id: 'pay_006',
          value: 250.00,
          description: 'Consultoria Abril',
          dueDate: '2024-04-05',
          status: 'OVERDUE'
        },
        daysOverdue: 30
      },
      {
        customer: {
          id: 'cus_007',
          name: 'Maria Costa',
          email: 'maria.costa@email.com',
          phone: '(11) 33333-3333',
          cpfCnpj: '999.888.777-66',
          personType: 'FISICA'
        },
        payment: {
          id: 'pay_007',
          value: 180.00,
          description: 'Mensalidade Maio',
          dueDate: '2024-05-15',
          status: 'OVERDUE'
        },
        daysOverdue: 15
      },
      {
        customer: {
          id: 'cus_008',
          name: 'Consultoria Delta',
          email: 'contato@consultoriadelta.com',
          phone: '(11) 22222-2222',
          cpfCnpj: '11.222.333/0001-44',
          personType: 'JURIDICA'
        },
        payment: {
          id: 'pay_008',
          value: 800.00,
          description: 'Projeto Especial',
          dueDate: '2024-04-20',
          status: 'OVERDUE'
        },
        daysOverdue: 25
      }
    ];
  }

  async getOverdueCustomers(): Promise<OverdueCustomer[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return this.getMockOverdueCustomers();
  }

  async generateNewBoleto(customerId: string, value: number, dueDate: string, description: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Gerando novo boleto:', { customerId, value, dueDate, description });
    return true;
  }

  async sendReminder(customerId: string, message: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Enviando lembrete:', { customerId, message });
    return true;
  }
}

const overdueService = new OverdueService();

export default function InadimplentesPage() {
  const [overdueCustomers, setOverdueCustomers] = useState<OverdueCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<OverdueCustomer | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'boleto' | 'reminder' | null>(null);

  useEffect(() => {
    loadOverdueCustomers();
  }, []);

  const loadOverdueCustomers = async () => {
    try {
      setLoading(true);
      const data = await overdueService.getOverdueCustomers();
      setOverdueCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes inadimplentes:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCpfCnpj = (cpfCnpj: string) => {
    if (cpfCnpj.length === 11) {
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const getOverdueLevel = (days: number) => {
    if (days <= 15) return { level: 'Baixo', color: 'bg-yellow-100 text-yellow-800' };
    if (days <= 30) return { level: 'Médio', color: 'bg-orange-100 text-orange-800' };
    return { level: 'Alto', color: 'bg-red-100 text-red-800' };
  };

  const getTotalOverdueAmount = () => {
    return overdueCustomers.reduce((sum, customer) => sum + customer.payment.value, 0);
  };

  const handleAction = (customer: OverdueCustomer, type: 'boleto' | 'reminder') => {
    setSelectedCustomer(customer);
    setActionType(type);
    setShowActionModal(true);
  };

  const handleGenerateBoleto = async () => {
    if (!selectedCustomer) return;
    
    try {
      const success = await overdueService.generateNewBoleto(
        selectedCustomer.customer.id,
        selectedCustomer.payment.value,
        new Date().toISOString().split('T')[0],
        `Nova cobrança - ${selectedCustomer.payment.description}`
      );
      
      if (success) {
        alert('Novo boleto gerado com sucesso!');
        setShowActionModal(false);
      }
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      alert('Erro ao gerar boleto. Tente novamente.');
    }
  };

  const handleSendReminder = async () => {
    if (!selectedCustomer) return;
    
    try {
      const success = await overdueService.sendReminder(
        selectedCustomer.customer.id,
        `Olá ${selectedCustomer.customer.name}, você possui uma cobrança vencida há ${selectedCustomer.daysOverdue} dias. Entre em contato conosco para regularizar sua situação.`
      );
      
      if (success) {
        alert('Lembrete enviado com sucesso!');
        setShowActionModal(false);
      }
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      alert('Erro ao enviar lembrete. Tente novamente.');
    }
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
            Clientes Inadimplentes
          </h1>
          <p className="text-gray-600">
            Gerencie clientes com cobranças em atraso e tome ações para recuperar pagamentos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-500">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Inadimplentes</p>
                <p className="text-2xl font-bold text-gray-900">{overdueCustomers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-500">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total em Atraso</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(getTotalOverdueAmount())}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Média de Dias em Atraso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(overdueCustomers.reduce((sum, c) => sum + c.daysOverdue, 0) / overdueCustomers.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inadimplentes List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(4)].map((_, index) => (
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
          ) : overdueCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobrança
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dias em Atraso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nível
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overdueCustomers.map((customer) => {
                    const overdueLevel = getOverdueLevel(customer.daysOverdue);
                    
                    return (
                      <tr key={customer.payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-red-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatCpfCnpj(customer.customer.cpfCnpj)}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <EnvelopeIcon className="h-3 w-3 mr-1" />
                                {customer.customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.payment.description}</div>
                          <div className="text-sm text-gray-500">#{customer.payment.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(customer.payment.value)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.payment.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-red-600">
                            {customer.daysOverdue} dias
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${overdueLevel.color}`}>
                            {overdueLevel.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAction(customer, 'reminder')}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Enviar Lembrete"
                            >
                              <EnvelopeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction(customer, 'boleto')}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Gerar Novo Boleto"
                            >
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => console.log('Ligar para:', customer.customer.phone)}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="Ligar"
                            >
                              <PhoneIcon className="h-4 w-4" />
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
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum cliente inadimplente encontrado
              </h3>
              <p className="text-gray-500">
                Todos os seus clientes estão em dia com os pagamentos!
              </p>
            </div>
          )}
        </div>

        {/* Action Modal */}
        {showActionModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {actionType === 'boleto' ? 'Gerar Novo Boleto' : 'Enviar Lembrete'}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Cliente: <span className="font-medium">{selectedCustomer.customer.name}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Valor: <span className="font-medium">{formatCurrency(selectedCustomer.payment.value)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Dias em atraso: <span className="font-medium text-red-600">{selectedCustomer.daysOverdue} dias</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={actionType === 'boleto' ? handleGenerateBoleto : handleSendReminder}
                  className={`flex-1 px-4 py-2 rounded-lg text-white ${
                    actionType === 'boleto' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {actionType === 'boleto' ? 'Gerar Boleto' : 'Enviar Lembrete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  );
} 