'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  CreditCardIcon, 
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useAsaas } from '@/lib/hooks/useAsaas';

interface AssinaturasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssinaturasModal({ isOpen, onClose }: AssinaturasModalProps) {
  const { 
    getCustomers, 
    getSubscriptions, 
    createSubscription, 
    deleteSubscription, 
    updateSubscription,
    createSubscriptionInvoiceSettings
  } = useAsaas();
  const [clients, setClients] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'ACTIVE' | 'INACTIVE' | 'OVERDUE' | 'CANCELLED'>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [newSubscription, setNewSubscription] = useState({
    customer: '',
    billingType: 'BOLETO',
    value: '',
    nextDueDate: '',
    cycle: 'MONTHLY',
    description: '',
    endDate: '',
    maxPayments: '',
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

  const loadAsaasSubscriptions = useCallback(async () => {
    try {
      setSubscriptionsLoading(true);
      const response = await getSubscriptions(1000, 0);
      if (response && response.data) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
      setSubscriptions([]);
    } finally {
      setSubscriptionsLoading(false);
    }
  }, [getSubscriptions]);

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
      loadAsaasSubscriptions();
      loadAsaasClients();
    }
  }, [isOpen, loadAsaasSubscriptions, loadAsaasClients]);

  const handleSubscriptionAction = (action: string, subscription?: any) => {
    if (action === 'new') {
      setActiveTab('create');
      setNewSubscription({
        customer: '',
        billingType: 'BOLETO',
        value: '',
        nextDueDate: '',
        cycle: 'MONTHLY',
        description: '',
        endDate: '',
        maxPayments: '',
        discount: { value: '', dueDateLimitDays: '' },
        fine: { value: '' },
        interest: { value: '' }
      });
    } else if (action === 'edit' && subscription) {
      setSelectedSubscription(subscription);
      setNewSubscription({
        customer: subscription.customer,
        billingType: subscription.billingType,
        value: subscription.value.toString(),
        nextDueDate: subscription.nextDueDate,
        cycle: subscription.cycle,
        description: subscription.description || '',
        endDate: subscription.endDate || '',
        maxPayments: subscription.maxPayments?.toString() || '',
        discount: { 
          value: subscription.discount?.value?.toString() || '', 
          dueDateLimitDays: subscription.discount?.dueDateLimitDays?.toString() || '' 
        },
        fine: { value: subscription.fine?.value?.toString() || '' },
        interest: { value: subscription.interest?.value?.toString() || '' }
      });
      setActiveTab('edit');
    } else if (action === 'delete' && subscription) {
      if (confirm(`Tem certeza que deseja excluir a assinatura ${subscription.description || subscription.id}?`)) {
        handleDeleteSubscription(subscription.id);
      }
    } else if (action === 'list') {
      setActiveTab('list');
      setSelectedSubscription(null);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      await deleteSubscription(subscriptionId);
      await loadAsaasSubscriptions();
      alert('Assinatura excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir assinatura:', error);
      alert('Erro ao excluir assinatura. Tente novamente.');
    }
  };

  const handleSaveSubscription = async () => {
    try {
      if (!newSubscription.customer || !newSubscription.value || !newSubscription.nextDueDate) {
        alert('Preencha os campos obrigatórios: Cliente, Valor e Próximo Vencimento');
        return;
      }

      const subscriptionData = {
        customer: newSubscription.customer,
        billingType: newSubscription.billingType,
        value: parseFloat(newSubscription.value),
        nextDueDate: newSubscription.nextDueDate,
        cycle: newSubscription.cycle,
        description: newSubscription.description || 'Assinatura',
        endDate: newSubscription.endDate || undefined,
        maxPayments: newSubscription.maxPayments ? parseInt(newSubscription.maxPayments) : undefined,
        discount: newSubscription.discount.value ? {
          value: parseFloat(newSubscription.discount.value),
          dueDateLimitDays: parseInt(newSubscription.discount.dueDateLimitDays) || 0
        } : undefined,
        fine: newSubscription.fine.value ? {
          value: parseFloat(newSubscription.fine.value)
        } : undefined,
        interest: newSubscription.interest.value ? {
          value: parseFloat(newSubscription.interest.value)
        } : undefined
      };
      
      if (activeTab === 'edit' && selectedSubscription) {
        await updateSubscription(selectedSubscription.id, subscriptionData);
        alert('Assinatura atualizada com sucesso!');
      } else {
        // Criar a assinatura
        console.log('🔧 [Frontend] Criando assinatura:', subscriptionData);
        const subscription = await createSubscription(subscriptionData);
        console.log('✅ [Frontend] Assinatura criada com ID:', subscription.id);
        
        // Configurar automaticamente a emissão de notas fiscais
        try {
          const nfSettings = {
            municipalServiceId: undefined,
            municipalServiceCode: undefined,
            municipalServiceName: undefined,
            serviceDescription: subscriptionData.description || 'Prestação de serviço',
            observations: undefined,
            deductions: 0,
            effectiveDateGracePeriod: 0,
            daysBeforeDueDate: 0,
            receivedOnly: false,
            email: null,
            phone: null,
            effectiveDatePeriod: 'ON_PAYMENT_CONFIRMATION' // Campo obrigatório da API Asaas
          };

          console.log('🔧 [Frontend] Configurando NF automaticamente:', nfSettings);
          
          // Usar a função do useAsaas para configurar NF
          const nfConfig = await createSubscriptionInvoiceSettings(subscription.id, nfSettings);
          console.log('✅ [Frontend] Configuração de NF criada:', nfConfig);
          
          alert('Assinatura criada com sucesso e configurada para emitir notas fiscais automaticamente!');
        } catch (nfError) {
          console.error('⚠️ [Frontend] Erro ao configurar NF (assinatura criada mesmo assim):', nfError);
          alert('Assinatura criada com sucesso! Nota: Erro ao configurar emissão automática de notas fiscais.');
        }
      }
      
      // Reset form e voltar para lista
      setActiveTab('list');
      setSelectedSubscription(null);
      setNewSubscription({
        customer: '',
        billingType: 'BOLETO',
        value: '',
        nextDueDate: '',
        cycle: 'MONTHLY',
        description: '',
        endDate: '',
        maxPayments: '',
        discount: { value: '', dueDateLimitDays: '' },
        fine: { value: '' },
        interest: { value: '' }
      });
      
      await loadAsaasSubscriptions();
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
      alert('Erro ao salvar assinatura. Tente novamente.');
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

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativa';
      case 'INACTIVE': return 'Inativa';
      case 'OVERDUE': return 'Atrasada';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  };

  const getBillingTypeText = (billingType: string) => {
    switch (billingType) {
      case 'BOLETO': return 'Boleto';
      case 'PIX': return 'PIX';
      case 'CREDIT_CARD': return 'Cartão de Crédito';
      default: return billingType;
    }
  };

  const getCycleText = (cycle: string) => {
    switch (cycle) {
      case 'WEEKLY': return 'Semanal';
      case 'BIWEEKLY': return 'Quinzenal';
      case 'MONTHLY': return 'Mensal';
      case 'QUARTERLY': return 'Trimestral';
      case 'SEMIANNUALLY': return 'Semestral';
      case 'YEARLY': return 'Anual';
      default: return cycle;
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (subscriptionFilter !== 'all' && subscription.status !== subscriptionFilter) {
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
            <h2 className="text-2xl font-bold text-gray-900">Gestão de Assinaturas</h2>
            <p className="text-gray-600">Gerencie suas assinaturas recorrentes do Asaas</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleSubscriptionAction('list')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Assinaturas
          </button>
          <button
            onClick={() => handleSubscriptionAction('new')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nova Assinatura
          </button>
          {activeTab === 'edit' && (
            <button
              className="px-6 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600"
            >
              Editar Assinatura
            </button>
          )}
        </div>

        {/* Conteúdo do Modal */}
        <div className="flex h-[calc(90vh-180px)]">
          {activeTab === 'list' && (
            <div className="w-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assinaturas</h3>
                <button
                  onClick={() => handleSubscriptionAction('new')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nova Assinatura
                </button>
              </div>

              {/* Filtros */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setSubscriptionFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    subscriptionFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setSubscriptionFilter('ACTIVE')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    subscriptionFilter === 'ACTIVE' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ativas
                </button>
                <button
                  onClick={() => setSubscriptionFilter('INACTIVE')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    subscriptionFilter === 'INACTIVE' 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inativas
                </button>
                <button
                  onClick={() => setSubscriptionFilter('OVERDUE')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    subscriptionFilter === 'OVERDUE' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Atrasadas
                </button>
                <button
                  onClick={() => setSubscriptionFilter('CANCELLED')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    subscriptionFilter === 'CANCELLED' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Canceladas
                </button>
              </div>

              {/* Lista de Assinaturas */}
              <div className="space-y-3">
                {subscriptionsLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="p-4 rounded-lg border border-gray-200">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {subscription.description || 'Assinatura'}
                            </h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionStatusColor(subscription.status)}`}>
                              {getSubscriptionStatusText(subscription.status)}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getBillingTypeText(subscription.billingType)}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {getCycleText(subscription.cycle)}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Cliente:</span> {subscription.customer}
                            </div>
                            <div>
                              <span className="font-medium">Valor:</span> {formatCurrency(subscription.value)}
                            </div>
                            <div>
                              <span className="font-medium">Próximo Vencimento:</span> {formatDate(subscription.nextDueDate)}
                            </div>
                            <div>
                              <span className="font-medium">Criada em:</span> {formatDate(subscription.dateCreated)}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleSubscriptionAction('edit', subscription)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Editar assinatura"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSubscriptionAction('delete', subscription)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Excluir assinatura"
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
                      {subscriptionFilter !== 'all' ? 'Nenhuma assinatura encontrada com este filtro' : 'Nenhuma assinatura cadastrada'}
                    </p>
                    {subscriptionFilter === 'all' && (
                      <p className="text-sm text-gray-400 mt-1">
                        Clique em &quot;Nova Assinatura&quot; para começar
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeTab === 'create' || activeTab === 'edit') && (
            <div className="w-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'create' ? 'Nova Assinatura' : 'Editar Assinatura'}
                </h3>
                <button
                  onClick={() => handleSubscriptionAction('list')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Voltar para Lista
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveSubscription(); }} className="space-y-4 max-w-2xl">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    required
                    value={newSubscription.customer}
                    onChange={(e) => setNewSubscription({...newSubscription, customer: e.target.value})}
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
                    value={newSubscription.billingType}
                    onChange={(e) => setNewSubscription({...newSubscription, billingType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="BOLETO">Boleto</option>
                    <option value="PIX">PIX</option>
                    <option value="CREDIT_CARD">Cartão de Crédito</option>
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
                    value={newSubscription.value}
                    onChange={(e) => setNewSubscription({...newSubscription, value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>

                {/* Ciclo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciclo de Cobrança *
                  </label>
                  <select
                    required
                    value={newSubscription.cycle}
                    onChange={(e) => setNewSubscription({...newSubscription, cycle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="WEEKLY">Semanal</option>
                    <option value="BIWEEKLY">Quinzenal</option>
                    <option value="MONTHLY">Mensal</option>
                    <option value="QUARTERLY">Trimestral</option>
                    <option value="SEMIANNUALLY">Semestral</option>
                    <option value="YEARLY">Anual</option>
                  </select>
                </div>

                {/* Próximo Vencimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Próximo Vencimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={newSubscription.nextDueDate}
                    onChange={(e) => setNewSubscription({...newSubscription, nextDueDate: e.target.value})}
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
                    value={newSubscription.description}
                    onChange={(e) => setNewSubscription({...newSubscription, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrição da assinatura"
                  />
                </div>

                {/* Data de Término */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Término (Opcional)
                  </label>
                  <input
                    type="date"
                    value={newSubscription.endDate}
                    onChange={(e) => setNewSubscription({...newSubscription, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Número Máximo de Pagamentos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número Máximo de Pagamentos (Opcional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newSubscription.maxPayments}
                    onChange={(e) => setNewSubscription({...newSubscription, maxPayments: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deixe em branco para ilimitado"
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
                        value={newSubscription.discount.value}
                        onChange={(e) => setNewSubscription({
                          ...newSubscription, 
                          discount: {...newSubscription.discount, value: e.target.value}
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
                        value={newSubscription.discount.dueDateLimitDays}
                        onChange={(e) => setNewSubscription({
                          ...newSubscription, 
                          discount: {...newSubscription.discount, dueDateLimitDays: e.target.value}
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
                      value={newSubscription.fine.value}
                      onChange={(e) => setNewSubscription({
                        ...newSubscription, 
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
                      value={newSubscription.interest.value}
                      onChange={(e) => setNewSubscription({
                        ...newSubscription, 
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
                    onClick={() => handleSubscriptionAction('list')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {activeTab === 'create' ? 'Criar Assinatura' : 'Atualizar Assinatura'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
