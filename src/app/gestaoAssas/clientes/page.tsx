'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Navbar from '@/components/Navbar';

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

// Serviço mock para clientes
class CustomerService {
  private getMockCustomers(): Customer[] {
    return [
      {
        id: 'cus_001',
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        mobilePhone: '(11) 99999-9999',
        cpfCnpj: '123.456.789-00',
        personType: 'FISICA',
        dateCreated: '2024-01-15',
        notificationDisabled: false,
        observations: 'Cliente preferencial'
      },
      {
        id: 'cus_002',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888',
        mobilePhone: '(11) 88888-8888',
        cpfCnpj: '987.654.321-00',
        personType: 'FISICA',
        dateCreated: '2024-02-20',
        notificationDisabled: false
      },
      {
        id: 'cus_003',
        name: 'Empresa ABC Ltda',
        email: 'contato@empresaabc.com',
        phone: '(11) 77777-7777',
        cpfCnpj: '12.345.678/0001-90',
        personType: 'JURIDICA',
        dateCreated: '2024-03-10',
        notificationDisabled: false,
        company: 'Empresa ABC Ltda'
      },
      {
        id: 'cus_004',
        name: 'Pedro Oliveira',
        email: 'pedro@email.com',
        phone: '(11) 66666-6666',
        mobilePhone: '(11) 66666-6666',
        cpfCnpj: '111.222.333-44',
        personType: 'FISICA',
        dateCreated: '2024-04-05',
        notificationDisabled: true
      },
      {
        id: 'cus_005',
        name: 'Consultoria XYZ',
        email: 'contato@consultoriaxyz.com',
        phone: '(11) 55555-5555',
        cpfCnpj: '98.765.432/0001-10',
        personType: 'JURIDICA',
        dateCreated: '2024-05-12',
        notificationDisabled: false,
        company: 'Consultoria XYZ Ltda'
      }
    ];
  }

  async getCustomers(): Promise<Customer[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getMockCustomers();
  }

  async createCustomer(customerData: Omit<Customer, 'id' | 'dateCreated'>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      ...customerData,
      id: `cus_${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0]
    };
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...customerData, id } as Customer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
}

const customerService = new CustomerService();

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cpfCnpj.includes(searchTerm)
  );

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

  const getPersonTypeLabel = (type: 'FISICA' | 'JURIDICA') => {
    return type === 'FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica';
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
            Gerenciar Clientes
          </h1>
          <p className="text-gray-600">
            Visualize, adicione e edite informações dos seus clientes.
          </p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Cliente
            </button>
          </div>
        </div>

        {/* Customers List */}
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
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatCpfCnpj(customer.cpfCnpj)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.personType === 'FISICA' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {getPersonTypeLabel(customer.personType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.dateCreated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          customer.notificationDisabled 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {customer.notificationDisabled ? 'Inativo' : 'Ativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Visualizar"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingCustomer(customer)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Tem certeza que deseja excluir este cliente?')) {
                                // Implementar exclusão
                                console.log('Excluir cliente:', customer.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Excluir"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos de busca.' 
                  : 'Comece adicionando seu primeiro cliente.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                >
                  <PlusIcon className="h-5 w-5" />
                  Adicionar Cliente
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => !c.notificationDisabled).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pessoa Jurídica</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.personType === 'JURIDICA').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pessoa Física</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.personType === 'FISICA').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
} 