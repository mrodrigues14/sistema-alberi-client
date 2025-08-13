'use client';

import { useAsaas } from '@/lib/hooks/useAsaas';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ConfigStatus() {
  const { checkApiStatus } = useAsaas();
  const [asaasStatus, setAsaasStatus] = useState<{ status: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await checkApiStatus();
        setAsaasStatus(status);
      } catch (error) {
        setAsaasStatus({ status: false, message: 'Erro ao conectar' });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [checkApiStatus]);

  const asaasConfigured = asaasStatus?.status || false;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Configurações</h3>
      
      <div className="space-y-4">
        {/* Status do Asaas */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          asaasConfigured ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className="flex items-center">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2" />
            ) : asaasConfigured ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-900">API Asaas</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            asaasConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {loading ? 'Verificando...' : asaasConfigured ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Node Environment */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Node Environment</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {process.env.NODE_ENV || 'development'}
          </span>
        </div>

        {/* Informações de Configuração */}
        {!asaasConfigured && !loading && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Configuração Necessária</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Para conectar com a API do Asaas, configure as variáveis de ambiente no backend:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-gray-100 p-2 rounded">
                <strong>ASAAS_ENVIRONMENT=sandbox</strong> (ou production)
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <strong>ASAAS_API_KEY_SANDBOX=sua_chave_sandbox</strong>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <strong>ASAAS_API_KEY_PRODUCTION=sua_chave_producao</strong>
              </div>
            </div>
          </div>
        )}

        {asaasConfigured && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">✅ API Conectada</h4>
            <p className="text-sm text-green-700">
              Conectado com sucesso à API do Asaas. Os dados reais serão carregados automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 