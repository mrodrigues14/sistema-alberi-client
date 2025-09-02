'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  DocumentTextIcon, 
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAsaas } from '@/lib/hooks/useAsaas';

interface NotasFiscaisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotasFiscaisModal({ isOpen, onClose }: NotasFiscaisModalProps) {
  const { 
    getCustomers, 
    getInvoices, 
    createInvoice, 
    issueInvoice, 
    cancelInvoice, 
    getCustomerInvoices
  } = useAsaas();
  const [clients, setClients] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'AUTHORIZED' | 'SCHEDULED' | 'CANCELLED' | 'PENDING'>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    payment: '',
    value: '',
    serviceDescription: '',
    effectiveDate: '',
    municipalServiceId: '',
    municipalServiceCode: '',
    municipalServiceName: '',
    observations: '',
    externalReference: ''
  });

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

  const loadCustomerInvoices = useCallback(async (customerId: string) => {
    try {
      setInvoicesLoading(true);
      const response = await getCustomerInvoices(customerId, 100, 0);
      if (response && response.data) {
        // Ordenar por data decrescente (usando effectiveDate que é a data real da nota)
        const sortedInvoices = response.data.sort((a: any, b: any) => 
          new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
        );
        setInvoices(sortedInvoices);
      }
    } catch (error) {
      console.error('Erro ao carregar notas fiscais do cliente:', error);
      setInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  }, [getCustomerInvoices]);

  useEffect(() => {
    if (isOpen) {
      loadAsaasClients();
    }
  }, [isOpen, loadAsaasClients]);

  useEffect(() => {
    if (selectedCustomer) {
      loadCustomerInvoices(selectedCustomer);
    } else {
      setInvoices([]);
    }
  }, [selectedCustomer, loadCustomerInvoices]);

  const handleInvoiceAction = (action: string, invoice?: any) => {
    if (action === 'new') {
      setActiveTab('create');
      setNewInvoice({
        customer: selectedCustomer,
        payment: '',
        value: '',
        serviceDescription: '',
        effectiveDate: '',
        municipalServiceId: '',
        municipalServiceCode: '',
        municipalServiceName: '',
        observations: '',
        externalReference: ''
      });
    } else if (action === 'issue' && invoice) {
      if (confirm(`Tem certeza que deseja emitir a nota fiscal ${invoice.description || invoice.id}?`)) {
        handleIssueInvoice(invoice.id);
      }
    } else if (action === 'cancel' && invoice) {
      if (confirm(`Tem certeza que deseja cancelar a nota fiscal ${invoice.description || invoice.id}?`)) {
        handleCancelInvoice(invoice.id);
      }
    } else if (action === 'list') {
      setActiveTab('list');
    }
  };

  const handleIssueInvoice = async (invoiceId: string) => {
    try {
      await issueInvoice(invoiceId);
      if (selectedCustomer) {
        await loadCustomerInvoices(selectedCustomer);
      }
      alert('Nota fiscal emitida com sucesso!');
    } catch (error) {
      console.error('Erro ao emitir nota fiscal:', error);
      alert('Erro ao emitir nota fiscal. Tente novamente.');
    }
  };

  const handleCancelInvoice = async (invoiceId: string) => {
    try {
      await cancelInvoice(invoiceId);
      if (selectedCustomer) {
        await loadCustomerInvoices(selectedCustomer);
      }
      alert('Nota fiscal cancelada com sucesso!');
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal:', error);
      alert('Erro ao cancelar nota fiscal. Tente novamente.');
    }
  };

  const handleSaveInvoice = async () => {
    try {
      if (!newInvoice.customer || !newInvoice.value || !newInvoice.effectiveDate) {
        alert('Preencha os campos obrigatórios: Cliente, Valor e Data');
        return;
      }

      const invoiceData = {
        customer: newInvoice.customer,
        payment: newInvoice.payment || undefined,
        value: parseFloat(newInvoice.value),
        serviceDescription: newInvoice.serviceDescription || 'Prestação de serviço',
        effectiveDate: newInvoice.effectiveDate,
        municipalServiceId: newInvoice.municipalServiceId || undefined,
        municipalServiceCode: newInvoice.municipalServiceCode || undefined,
        municipalServiceName: newInvoice.municipalServiceName || undefined,
        observations: newInvoice.observations || undefined,
        externalReference: newInvoice.externalReference || undefined
      };
      
      await createInvoice(invoiceData);
      alert('Nota fiscal criada com sucesso!');
      
      // Reset form e voltar para lista
      setActiveTab('list');
      setNewInvoice({
        customer: selectedCustomer,
        payment: '',
        value: '',
        serviceDescription: '',
        effectiveDate: '',
        municipalServiceId: '',
        municipalServiceCode: '',
        municipalServiceName: '',
        observations: '',
        externalReference: ''
      });
      
      if (selectedCustomer) {
        await loadCustomerInvoices(selectedCustomer);
      }
    } catch (error) {
      console.error('Erro ao salvar nota fiscal:', error);
      alert('Erro ao salvar nota fiscal. Tente novamente.');
    }
  };

  const handleDownloadPdf = async (pdfUrl: string, invoiceNumber: string, customerId: string) => {
    try {
      // Buscar informações do cliente para o nome do arquivo
      const customer = clients.find(c => c.id === customerId);
      console.log('Cliente encontrado:', customer);
      console.log('Customer ID:', customerId);
      console.log('Lista de clientes:', clients);
      
      let fileName = `nota_fiscal_${invoiceNumber}`;
      
      if (customer && customer.name) {
        // Limpar o nome do cliente (remover caracteres especiais e espaços)
        const cleanName = customer.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove acentos
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais
          .replace(/\s+/g, '_') // Substitui espaços por underscore
          .toLowerCase();
        
        fileName = `nota_fiscal_${cleanName}_${invoiceNumber}`;
        console.log('Nome do arquivo gerado:', fileName);
      } else {
        console.log('Cliente não encontrado ou sem nome');
      }
      
      // Criar um link temporário para download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${fileName}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      alert('Erro ao baixar PDF. Tente novamente.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'AUTHORIZED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusText = (status: string) => {
    switch (status) {
      case 'AUTHORIZED': return 'Autorizada';
      case 'SCHEDULED': return 'Agendada';
      case 'CANCELLED': return 'Cancelada';
      case 'PENDING': return 'Pendente';
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (invoiceFilter !== 'all' && invoice.status !== invoiceFilter) {
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
            <h2 className="text-2xl font-bold text-gray-900">Gestão de Notas Fiscais</h2>
            <p className="text-gray-600">Gerencie as notas fiscais dos seus clientes</p>
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
            onClick={() => handleInvoiceAction('list')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lista de Notas Fiscais
          </button>
          <button
            onClick={() => handleInvoiceAction('new')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'create'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nova Nota Fiscal
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="flex h-[calc(90vh-180px)]">
          {activeTab === 'list' && (
            <div className="w-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notas Fiscais</h3>
                <button
                  onClick={() => handleInvoiceAction('new')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nova Nota Fiscal
                </button>
              </div>

              {/* Seleção de Cliente */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o Cliente
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.cpfCnpj}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomer && (
                <>
                  {/* Filtros */}
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setInvoiceFilter('all')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        invoiceFilter === 'all' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setInvoiceFilter('AUTHORIZED')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        invoiceFilter === 'AUTHORIZED' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Autorizadas
                    </button>
                    <button
                      onClick={() => setInvoiceFilter('SCHEDULED')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        invoiceFilter === 'SCHEDULED' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Agendadas
                    </button>
                    <button
                      onClick={() => setInvoiceFilter('PENDING')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        invoiceFilter === 'PENDING' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Pendentes
                    </button>
                    <button
                      onClick={() => setInvoiceFilter('CANCELLED')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        invoiceFilter === 'CANCELLED' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Canceladas
                    </button>
                  </div>

                  {/* Lista de Notas Fiscais */}
                  <div className="space-y-3">
                    {invoicesLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[...Array(5)].map((_, index) => (
                          <div key={index} className="p-4 rounded-lg border border-gray-200">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {invoice.serviceDescription || 'Nota Fiscal'}
                                </h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                                  {getInvoiceStatusText(invoice.status)}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {formatCurrency(invoice.value)}
                                </span>
                                {invoice.number && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Nº {invoice.number}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">ID:</span> {invoice.id}
                                </div>
                                <div>
                                  <span className="font-medium">Data:</span> {formatDate(invoice.effectiveDate)}
                                </div>
                                <div>
                                  <span className="font-medium">RPS:</span> {invoice.rpsSerie}-{invoice.rpsNumber}
                                </div>
                                {invoice.validationCode && (
                                  <div>
                                    <span className="font-medium">Código:</span> {invoice.validationCode}
                                  </div>
                                )}
                              </div>
                              {invoice.observations && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <span className="font-medium">Observações:</span> {invoice.observations}
                                </div>
                              )}
                              {invoice.municipalServiceName && (
                                <div className="mt-2 text-sm text-gray-600">
                                  <span className="font-medium">Serviço:</span> {invoice.municipalServiceName}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {/* Botão de Download PDF */}
                              {invoice.pdfUrl && (
                                <button
                                  onClick={() => handleDownloadPdf(invoice.pdfUrl, invoice.number || invoice.id, selectedCustomer)}
                                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="Baixar PDF"
                                >
                                  <DocumentTextIcon className="h-5 w-5" />
                                </button>
                              )}
                              
                              {/* Botões de ação baseados no status */}
                              {invoice.status === 'SCHEDULED' && (
                                <>
                                  <button
                                    onClick={() => handleInvoiceAction('issue', invoice)}
                                    className="text-green-600 hover:text-green-800 p-1"
                                    title="Emitir nota fiscal"
                                  >
                                    <CheckCircleIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleInvoiceAction('cancel', invoice)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Cancelar nota fiscal"
                                  >
                                    <XCircleIcon className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              {invoice.status === 'AUTHORIZED' && (
                                <button
                                  onClick={() => handleInvoiceAction('cancel', invoice)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Cancelar nota fiscal"
                                >
                                  <XCircleIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {invoiceFilter !== 'all' ? 'Nenhuma nota fiscal encontrada com este filtro' : 'Nenhuma nota fiscal encontrada para este cliente'}
                        </p>
                        {invoiceFilter === 'all' && (
                          <p className="text-sm text-gray-400 mt-1">
                            Clique em &quot;Nova Nota Fiscal&quot; para começar
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {!selectedCustomer && (
                <div className="text-center py-8">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Selecione um cliente para visualizar suas notas fiscais</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="w-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nova Nota Fiscal</h3>
                <button
                  onClick={() => handleInvoiceAction('list')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Voltar para Lista
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveInvoice(); }} className="space-y-4 max-w-2xl">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    required
                    value={newInvoice.customer}
                    onChange={(e) => setNewInvoice({...newInvoice, customer: e.target.value})}
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
                    value={newInvoice.value}
                    onChange={(e) => setNewInvoice({...newInvoice, value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoice.effectiveDate}
                    onChange={(e) => setNewInvoice({...newInvoice, effectiveDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição do Serviço
                  </label>
                  <input
                    type="text"
                    value={newInvoice.serviceDescription}
                    onChange={(e) => setNewInvoice({...newInvoice, serviceDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descrição do serviço prestado"
                  />
                </div>

                {/* Código do Serviço Municipal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código do Serviço Municipal
                  </label>
                  <input
                    type="text"
                    value={newInvoice.municipalServiceCode}
                    onChange={(e) => setNewInvoice({...newInvoice, municipalServiceCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Código do serviço"
                  />
                </div>

                {/* Nome do Serviço Municipal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Serviço Municipal
                  </label>
                  <input
                    type="text"
                    value={newInvoice.municipalServiceName}
                    onChange={(e) => setNewInvoice({...newInvoice, municipalServiceName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do serviço"
                  />
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={newInvoice.observations}
                    onChange={(e) => setNewInvoice({...newInvoice, observations: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais"
                    rows={3}
                  />
                </div>

                {/* Referência Externa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referência Externa
                  </label>
                  <input
                    type="text"
                    value={newInvoice.externalReference}
                    onChange={(e) => setNewInvoice({...newInvoice, externalReference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Referência externa"
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => handleInvoiceAction('list')}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Criar Nota Fiscal
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
