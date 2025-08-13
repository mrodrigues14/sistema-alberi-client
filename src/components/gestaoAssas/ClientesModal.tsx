'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAsaas } from '@/lib/hooks/useAsaas';

interface ClientesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientesModal({ isOpen, onClose }: ClientesModalProps) {
  const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = useAsaas();
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
    postalCode: '',
    address: '',
    addressNumber: '',
    complement: '',
    province: '',
    city: '',
    state: ''
  });

  // Carregar clientes quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      loadAsaasClients();
    }
  }, [isOpen]);

  const loadAsaasClients = async () => {
    try {
      setClientsLoading(true);
      const response = await getCustomers(1000, 0);
      if (response && response.data) {
        // Mapear dados do Asaas para o formato local
        const mappedClients = response.data.map((client: any) => ({
          id: client.id,
          name: client.name || 'Sem nome',
          email: client.email || 'Sem email',
          phone: client.phone || client.mobilePhone || 'Sem telefone',
          cpfCnpj: client.cpfCnpj || 'Sem CPF/CNPJ',
          postalCode: client.postalCode || 'Sem CEP',
          address: client.address || 'Sem endereço',
          addressNumber: client.addressNumber || 'S/N',
          complement: client.complement || 'Sem complemento',
          province: client.province || 'Sem bairro',
          city: client.cityName || client.city || 'Sem cidade',
          state: client.state || 'Sem estado',
          status: client.deleted ? 'inactive' : 'active',
          personType: client.personType || 'FISICA',
          dateCreated: client.dateCreated,
          canDelete: client.canDelete,
          canEdit: client.canEdit,
          country: client.country,
          // Dados adicionais do Asaas
          asaasData: client
        }));
        setClients(mappedClients);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  const handleClientAction = (action: string, client?: any) => {
    if (action === 'new') {
      setSelectedClient(null);
      setIsEditing(false);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        cpfCnpj: '',
        postalCode: '',
        address: '',
        addressNumber: '',
        complement: '',
        province: '',
        city: '',
        state: ''
      });
    } else if (action === 'edit' && client) {
      setSelectedClient(client);
      setIsEditing(true);
      setNewClient({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        cpfCnpj: client.cpfCnpj || '',
        postalCode: client.postalCode || '',
        address: client.address || '',
        addressNumber: client.addressNumber || '',
        complement: client.complement || '',
        province: client.province || '',
        city: client.city || '',
        state: client.state || ''
      });
    } else if (action === 'delete' && client) {
      if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
        handleDeleteClient(client.id);
      }
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteCustomer(clientId);
      // Recarregar lista de clientes
      await loadAsaasClients();
      alert('Cliente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente.');
    }
  };

  const handleSaveClient = async () => {
    try {
      // Preparar dados no formato do Asaas
      const asaasCustomerData = {
        name: newClient.name,
        email: newClient.email || null,
        phone: newClient.phone || null,
        mobilePhone: newClient.phone || null, // Asaas usa mobilePhone para celular
        cpfCnpj: newClient.cpfCnpj,
        postalCode: newClient.postalCode || null,
        address: newClient.address || null,
        addressNumber: newClient.addressNumber || null,
        complement: newClient.complement || null,
        province: newClient.province || null,
        city: newClient.city || null,
        state: newClient.state || null,
        personType: newClient.cpfCnpj.length > 14 ? 'JURIDICA' : 'FISICA',
        country: 'Brasil'
      };

      if (isEditing && selectedClient) {
        // Atualizar cliente existente
        await updateCustomer(selectedClient.id, asaasCustomerData);
        alert('Cliente atualizado com sucesso!');
      } else {
        // Adicionar novo cliente
        await createCustomer(asaasCustomerData);
        alert('Cliente criado com sucesso!');
      }
      
      // Recarregar lista de clientes
      await loadAsaasClients();
      
      // Reset form
      setNewClient({
        name: '',
        email: '',
        phone: '',
        cpfCnpj: '',
        postalCode: '',
        address: '',
        addressNumber: '',
        complement: '',
        province: '',
        city: '',
        state: ''
      });
      setIsEditing(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Tente novamente.');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cpfCnpj.includes(searchTerm)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h2>
            <p className="text-gray-600">Gerencie seus clientes do Asaas</p>
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
          {/* Lista de Clientes */}
          <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
              <button
                onClick={() => handleClientAction('new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Novo Cliente
              </button>
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lista de Clientes */}
            <div className="space-y-2">
              {clientsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="p-3 rounded-lg border border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedClient?.id === client.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{client.name}</h4>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {client.city}, {client.state}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            client.personType === 'JURIDICA' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {client.personType === 'JURIDICA' ? 'PJ' : 'PF'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Criado em: {client.dateCreated ? new Date(client.dateCreated).toLocaleDateString('pt-BR') : 'Data não informada'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {client.canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClientAction('edit', client);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Editar cliente"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        {client.canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClientAction('delete', client);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Excluir cliente"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                  </p>
                  {!searchTerm && (
                    <p className="text-sm text-gray-400 mt-1">
                      Clique em &quot;Novo Cliente&quot; para começar
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Formulário de Cliente */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              {isEditing && (
                <button
                  onClick={() => handleClientAction('new')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Novo Cliente
                </button>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveClient(); }} className="space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome/Razão Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone/Celular
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF/CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.cpfCnpj}
                    onChange={(e) => setNewClient({...newClient, cpfCnpj: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123.456.789-00 ou 12.345.678/0001-90"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Endereço</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={newClient.postalCode}
                      onChange={(e) => setNewClient({...newClient, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={newClient.city}
                      onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={newClient.state}
                      onChange={(e) => setNewClient({...newClient, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SP, RJ, MG..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={newClient.province}
                      onChange={(e) => setNewClient({...newClient, province: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logradouro
                    </label>
                    <input
                      type="text"
                      value={newClient.address}
                      onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={newClient.addressNumber}
                      onChange={(e) => setNewClient({...newClient, addressNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={newClient.complement}
                    onChange={(e) => setNewClient({...newClient, complement: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  {isEditing ? 'Atualizar' : 'Salvar'} Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
