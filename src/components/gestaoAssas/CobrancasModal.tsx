'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  CreditCardIcon, 
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAsaas } from '@/lib/hooks/useAsaas';

interface CobrancasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CobrancasModal({ isOpen, onClose }: CobrancasModalProps) {
  const { getCustomers, getPayments, createPayment, deletePayment } = useAsaas();
  const [clients, setClients] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'RECEIVED' | 'PENDING' | 'OVERDUE'>('all');
  const [newPayment, setNewPayment] = useState({
    customer: '',
    billingType: 'BOLETO',
    value: '',
    dueDate: '',
    description: '',
    discount: {
      value: '',
      dueDateLimitDays: ''
    },
    fine: {
      value: ''
    },
    interest: {
      value: ''
    }
  });

  // Carregar dados quando o modal abrir

  const loadAsaasPayments = useCallback(async () => {
    try {
      setPaymentsLoading(true);
      const response = await getPayments(1000, 0);
      if (response && response.data) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cobranças:', error);
      setPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, [getPayments]);

  const loadAsaasClients = useCallback(async () => {
    try {
      setClientsLoading(true);
      const response = await getCustomers(1000, 0);
      if (response && response.data) {
        setClients(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  }, [getCustomers]);

  useEffect(() => {
    if (isOpen) {
      loadAsaasPayments();
      loadAsaasClients();
    }
  }, [isOpen, loadAsaasPayments, loadAsaasClients]);

  const handlePaymentAction = (action: string, payment?: any) => {
    if (action === 'new') {
      setNewPayment({
        customer: '',
        billingType: 'BOLETO',
        value: '',
        dueDate: '',
        description: '',
        discount: { value: '', dueDateLimitDays: '' },
        fine: { value: '' },
        interest: { value: '' }
      });
    } else if (action === 'delete' && payment) {
      if (confirm(`Tem certeza que deseja excluir a cobrança ${payment.description || payment.id}?`)) {
        handleDeletePayment(payment.id);
      }
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId);
      await loadAsaasPayments();
      alert('Cobrança excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cobrança:', error);
      alert('Erro ao excluir cobrança. Tente novamente.');
    }
  };

  const handleSavePayment = async () => {
    try {
      if (!newPayment.customer || !newPayment.value || !newPayment.dueDate) {
        alert('Preencha os campos obrigatórios: Cliente, Valor e Data de Vencimento');
        return;
      }

      const paymentData = {
        customer: newPayment.customer,
        billingType: newPayment.billingType,
        value: parseFloat(newPayment.value),
        dueDate: newPayment.dueDate,
        description: newPayment.description || 'Cobrança',
        discount: newPayment.discount.value ? {
          value: parseFloat(newPayment.discount.value),
          dueDateLimitDays: parseInt(newPayment.discount.dueDateLimitDays) || 0
        } : undefined,
        fine: newPayment.fine.value ? {
          value: parseFloat(newPayment.fine.value)
        } : undefined,
        interest: newPayment.interest.value ? {
          value: parseFloat(newPayment.interest.value)
        } : undefined
      };
      
      console.log('🔍 [Frontend] Dados preparados:', paymentData);
      console.log('🔍 [Frontend] Tipo dos dados:', typeof paymentData);
      console.log('🔍 [Frontend] Dados são objeto?', typeof paymentData === 'object');
      
      await createPayment(paymentData);
      alert('Cobrança criada com sucesso!');
      
      // Reset form e recarregar
      setNewPayment({
        customer: '',
        billingType: 'BOLETO',
        value: '',
        dueDate: '',
        description: '',
        discount: { value: '', dueDateLimitDays: '' },
        fine: { value: '' },
        interest: { value: '' }
      });
      
      await loadAsaasPayments();
    } catch (error) {
      console.error('❌ [Frontend] Erro ao criar cobrança:', error);
      alert('Erro ao criar cobrança. Tente novamente.');
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'Pago';
      case 'PENDING': return 'Em Dia';
      case 'OVERDUE': return 'Atrasado';
      default: return status;
    }
  };

  const getBillingTypeText = (billingType: string) => {
    switch (billingType) {
      case 'BOLETO': return 'Boleto';
      case 'PIX': return 'PIX';
      default: return billingType;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (paymentFilter !== 'all' && payment.status !== paymentFilter) {
        return false;
      }
      return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestão de Cobranças</h2>
            <p className="text-gray-600">Gerencie suas cobranças do Asaas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Lista de Cobranças */}
          <div className="w-2/3 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cobranças</h3>
              <button
                onClick={() => handlePaymentAction('new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Nova Cobrança
              </button>
            </div>

            {/* Filtros */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setPaymentFilter('RECEIVED')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'RECEIVED' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pagas
              </button>
              <button
                onClick={() => setPaymentFilter('PENDING')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'PENDING' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Em Dia
              </button>
              <button
                onClick={() => setPaymentFilter('OVERDUE')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  paymentFilter === 'OVERDUE' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Atrasadas
              </button>
            </div>

            {/* Lista de Cobranças */}
            <div className="space-y-3">
              {paymentsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {payment.description || 'Cobrança'}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {getPaymentStatusText(payment.status)}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getBillingTypeText(payment.billingType)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Cliente:</span> {payment.customer}
                          </div>
                          <div>
                            <span className="font-medium">Valor:</span> {formatCurrency(payment.value)}
                          </div>
                          <div>
                            <span className="font-medium">Vencimento:</span> {formatDate(payment.dueDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handlePaymentAction('delete', payment)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Excluir cobrança"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {paymentFilter !== 'all' ? 'Nenhuma cobrança encontrada com este filtro' : 'Nenhuma cobrança cadastrada'}
                  </p>
                  {paymentFilter === 'all' && (
                    <p className="text-sm text-gray-400 mt-1">
                      Clique em &quot;Nova Cobrança&quot; para começar
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Formulário de Nova Cobrança */}
          <div className="w-1/3 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nova Cobrança</h3>
              <button
                onClick={() => handlePaymentAction('new')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Limpar
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSavePayment(); }} className="space-y-4">
              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  required
                  value={newPayment.customer}
                  onChange={(e) => setNewPayment({...newPayment, customer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.cpfCnpj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento *
                </label>
                <select
                  required
                  value={newPayment.billingType}
                  onChange={(e) => setNewPayment({...newPayment, billingType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="BOLETO">Boleto</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={newPayment.value}
                  onChange={(e) => setNewPayment({...newPayment, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0,00"
                />
              </div>

              {/* Data de Vencimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  required
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição da cobrança"
                />
              </div>

              {/* Desconto */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Desconto</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPayment.discount.value}
                      onChange={(e) => setNewPayment({
                        ...newPayment, 
                        discount: {...newPayment.discount, value: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dias Antes
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newPayment.discount.dueDateLimitDays}
                      onChange={(e) => setNewPayment({
                        ...newPayment, 
                        discount: {...newPayment.discount, dueDateLimitDays: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Multa e Juros */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Multa (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPayment.fine.value}
                    onChange={(e) => setNewPayment({
                      ...newPayment, 
                      fine: {value: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Juros (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newPayment.interest.value}
                    onChange={(e) => setNewPayment({
                      ...newPayment, 
                      interest: {value: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar Cobrança
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
