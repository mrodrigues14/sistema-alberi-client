import { useState, useEffect, useCallback } from 'react';
import { fetcher } from "../api";

// Interfaces
export interface Customer {
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

export interface Payment {
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

export interface Subscription {
  id: string;
  customer: string;
  value: number;
  nextDueDate: string;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OVERDUE' | 'CANCELLED';
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'DEPOSIT' | 'PIX';
  endDate?: string;
  maxPayments?: number;
  fine: {
    value: number;
  };
  interest: {
    value: number;
  };
  discount: {
    value: number;
    dueDateLimitDays: number;
  };
  dateCreated: string;
  deleted: boolean;
}

export interface Invoice {
  id: string;
  customer: string;
  payment: string;
  value: number;
  netValue: number;
  originalValue?: number;
  interestValue?: number;
  fineValue?: number;
  discountValue?: number;
  description?: string;
  status: 'SCHEDULED' | 'ISSUED' | 'CANCELLED';
  issueDate?: string;
  dueDate: string;
  dateCreated: string;
  deleted: boolean;
  municipalServiceId?: string;
  municipalServiceCode?: string;
  municipalServiceName?: string;
  observations?: string;
  externalReference?: string;
}

export interface DashboardStats {
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

export interface ApiStatus {
  status: boolean;
  message: string;
}

// Hook principal
export function useAsaas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar clientes
  const getCustomers = useCallback(async (limit = 100, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher(`/asaas/customers?limit=${limit}&offset=${offset}`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar clientes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar cobranças/pagamentos
  const getPayments = useCallback(async (limit = 100, offset = 0, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const statusParam = status ? `&status=${status}` : '';
      const data = await fetcher(`/asaas/payments?limit=${limit}&offset=${offset}${statusParam}`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar pagamentos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar estatísticas do dashboard
  const getDashboardStats = useCallback(async (): Promise<DashboardStats> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher('/asaas/dashboard-stats');
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar estatísticas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar atividades recentes
  const getRecentActivities = useCallback(async (): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher('/asaas/recent-activities');
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar atividades recentes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar status da API
  const checkApiStatus = useCallback(async (): Promise<ApiStatus> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher('/asaas/status');
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao verificar status da API';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar cliente
  const createCustomer = useCallback(async (customerData: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher('/asaas/customers', { 
        method: 'POST', 
        body: JSON.stringify(customerData) 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar cliente
  const updateCustomer = useCallback(async (customerId: string, customerData: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/customers/${customerId}`, { 
        method: 'POST', 
        body: JSON.stringify(customerData) 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar cliente
  const deleteCustomer = useCallback(async (customerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/customers/${customerId}`, { 
        method: 'DELETE' 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar cliente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar cobrança
  const createPayment = useCallback(async (paymentData: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher('/asaas/payments', { 
        method: 'POST', 
        body: JSON.stringify(paymentData) 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar cobrança';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const deletePayment = useCallback(async (paymentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/payments/${paymentId}`, { 
        method: 'DELETE' 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar cobrança';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Métodos para Assinaturas
  const getSubscriptions = useCallback(async (limit = 100, offset = 0, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const statusParam = status ? `&status=${status}` : '';
      const data = await fetcher(`/asaas/subscriptions?limit=${limit}&offset=${offset}${statusParam}`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar assinaturas';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubscription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher(`/asaas/subscriptions/${id}`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar assinatura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (subscriptionData: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher('/asaas/subscriptions', { 
        method: 'POST', 
        body: JSON.stringify(subscriptionData) 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar assinatura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubscription = useCallback(async (id: string, subscriptionData: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/subscriptions/${id}`, { 
        method: 'POST', 
        body: JSON.stringify(subscriptionData) 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar assinatura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSubscription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/subscriptions/${id}`, { 
        method: 'DELETE' 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao deletar assinatura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Métodos adicionais para cobranças
  const getPayment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher(`/asaas/payments/${id}`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar cobrança';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = useCallback(async (id: string, paymentData: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/payments/${id}`, { 
        method: 'POST', 
        body: JSON.stringify(paymentData) 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar cobrança';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const restorePayment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetcher(`/asaas/payments/${id}/restore`, { 
        method: 'POST' 
      });
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao restaurar cobrança';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getBankSlip = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher(`/asaas/payments/${id}/bankSlip`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar boleto';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPixQrCode = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetcher(`/asaas/payments/${id}/pixQrCode`);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar QR Code PIX';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Notas Fiscais
  const getInvoices = useCallback(async (limit: number = 100, offset: number = 0, filters?: any) => {
    try {
      const response = await fetcher(`/asaas/invoices?limit=${limit}&offset=${offset}${filters?.customer ? `&customer=${filters.customer}` : ''}${filters?.status ? `&status=${filters.status}` : ''}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      throw error;
    }
  }, [fetcher]);

  const getInvoice = useCallback(async (invoiceId: string) => {
    try {
      const response = await fetcher(`/asaas/invoices/${invoiceId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar nota fiscal:', error);
      throw error;
    }
  }, [fetcher]);

  const createInvoice = useCallback(async (invoiceData: any) => {
    try {
      const response = await fetcher('/asaas/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      throw error;
    }
  }, [fetcher]);

  const updateInvoice = useCallback(async (invoiceId: string, invoiceData: any) => {
    try {
      const response = await fetcher(`/asaas/invoices/${invoiceId}`, {
        method: 'PUT',
        body: JSON.stringify(invoiceData),
      });
      return response;
    } catch (error) {
      console.error('Erro ao atualizar nota fiscal:', error);
      throw error;
    }
  }, [fetcher]);

  const issueInvoice = useCallback(async (invoiceId: string) => {
    try {
      const response = await fetcher(`/asaas/invoices/${invoiceId}/issue`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Erro ao emitir nota fiscal:', error);
      throw error;
    }
  }, [fetcher]);

  const cancelInvoice = useCallback(async (invoiceId: string) => {
    try {
      const response = await fetcher(`/asaas/invoices/${invoiceId}/cancel`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal:', error);
      throw error;
    }
  }, [fetcher]);

  const getCustomerInvoices = useCallback(async (customerId: string, limit: number = 100, offset: number = 0) => {
    try {
      const response = await fetcher(`/asaas/invoices?limit=${limit}&offset=${offset}&customer=${customerId}`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar notas fiscais do cliente:', error);
      throw error;
    }
  }, [fetcher]);

  // Configurações de Notas Fiscais das Assinaturas
  const getSubscriptionInvoiceSettings = useCallback(async (subscriptionId: string) => {
    try {
      const response = await fetcher(`/asaas/subscriptions/${subscriptionId}/invoiceSettings`);
      return response;
    } catch (error) {
      console.error('Erro ao buscar configurações de NF da assinatura:', error);
      throw error;
    }
  }, []);

  const createSubscriptionInvoiceSettings = useCallback(async (subscriptionId: string, settings: any) => {
    try {
      const response = await fetcher(`/asaas/subscriptions/${subscriptionId}/invoiceSettings`, {
        method: 'POST',
        body: JSON.stringify(settings)
      });
      return response;
    } catch (error) {
      console.error('Erro ao criar configurações de NF da assinatura:', error);
      throw error;
    }
  }, []);

  const updateSubscriptionInvoiceSettings = useCallback(async (subscriptionId: string, settings: any) => {
    try {
      const response = await fetcher(`/asaas/subscriptions/${subscriptionId}/invoiceSettings`, {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      return response;
    } catch (error) {
      console.error('Erro ao atualizar configurações de NF da assinatura:', error);
      throw error;
    }
  }, []);

  const deleteSubscriptionInvoiceSettings = useCallback(async (subscriptionId: string) => {
    try {
      const response = await fetcher(`/asaas/subscriptions/${subscriptionId}/invoiceSettings`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Erro ao remover configurações de NF da assinatura:', error);
      throw error;
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    getCustomers,
    getPayments,
    getDashboardStats,
    getRecentActivities,
    checkApiStatus,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createPayment,
    deletePayment,
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getPayment,
    updatePayment,
    restorePayment,
    getBankSlip,
    getPixQrCode,
    getInvoices,
    getInvoice,
    createInvoice,
    issueInvoice,
    cancelInvoice,
    getCustomerInvoices,
    getSubscriptionInvoiceSettings,
    createSubscriptionInvoiceSettings,
    updateSubscriptionInvoiceSettings,
    deleteSubscriptionInvoiceSettings
  };
}

// Hook específico para dashboard
export function useAsaasDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Payment[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const { getDashboardStats, getRecentActivities, checkApiStatus } = useAsaas();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar status da API
      const status = await checkApiStatus();
      setApiStatus(status);
      
      if (status.status) {
        // Carregar estatísticas do dashboard
        const stats = await getDashboardStats();
        setDashboardStats(stats);
        
        // Carregar atividades recentes
        const activities = await getRecentActivities();
        setRecentActivities(activities);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      setApiStatus({ status: false, message: 'Erro ao conectar com a API' });
    } finally {
      setLoading(false);
    }
  }, [getDashboardStats, getRecentActivities, checkApiStatus]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const refreshData = useCallback(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    dashboardStats,
    recentActivities,
    apiStatus,
    loading,
    refreshData,
  };
}
