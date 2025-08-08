'use client';

import { isAsaasConfigured, config } from '@/lib/config';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function ConfigStatus() {
  const asaasConfigured = isAsaasConfigured();
  const environment = config.asaas.environment;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Configurações</h3>
      
      <div className="space-y-4">
        {/* Status do Asaas */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          asaasConfigured ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className="flex items-center">
            {asaasConfigured ? (
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-900">API Asaas</span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            asaasConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {asaasConfigured ? 'Configurada' : 'Não Configurada'}
          </span>
        </div>

        {/* Ambiente */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Ambiente</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {environment === 'production' ? 'Produção' : 'Sandbox'}
          </span>
        </div>

        {/* Node Environment */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-900">Node Environment</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {config.nodeEnv}
          </span>
        </div>

        {/* Informações de Configuração */}
        {!asaasConfigured && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Configuração Necessária</h4>
            <p className="text-sm text-yellow-700 mb-3">
              Para conectar com a API real do Asaas, configure as seguintes variáveis de ambiente:
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
            <h4 className="font-semibold text-green-800 mb-2">✅ API Configurada</h4>
            <p className="text-sm text-green-700">
              Conectado ao ambiente {environment} do Asaas. Os dados reais serão carregados automaticamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 