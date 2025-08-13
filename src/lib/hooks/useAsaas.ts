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
    deletePayment
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
