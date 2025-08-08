// Configurações do sistema baseadas em variáveis de ambiente

export const config = {
  // Ambiente
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Configurações do Asaas
  asaas: {
    environment: process.env.ASAAS_ENVIRONMENT || 'sandbox',
    apiUrl: process.env.ASAAS_ENVIRONMENT === 'production' 
      ? process.env.ASAAS_API_URL_PRODUCTION 
      : process.env.ASAAS_API_URL_SANDBOX,
    apiKey: process.env.ASAAS_ENVIRONMENT === 'production'
      ? process.env.ASAAS_API_KEY_PRODUCTION
      : process.env.ASAAS_API_KEY_SANDBOX,
    isSandbox: process.env.ASAAS_ENVIRONMENT === 'sandbox',
    isProduction: process.env.ASAAS_ENVIRONMENT === 'production'
  },

  // Configurações do Backend
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  },

  // Configurações do NextAuth
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000'
  },

  // Configurações do Banco de Dados
  database: {
    url: process.env.DATABASE_URL
  },

  // Configurações de Log
  log: {
    level: process.env.LOG_LEVEL || 'info'
  },

  // Configurações de Segurança
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY
  },

  // Configurações de Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },

  // Configurações de Monitoramento
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN
  }
};

// Função para validar se todas as configurações necessárias estão presentes
export function validateConfig() {
  const requiredConfigs = [
    'NEXTAUTH_SECRET',
    'ASAAS_API_KEY_SANDBOX',
    'ASAAS_API_KEY_PRODUCTION'
  ];

  const missingConfigs = requiredConfigs.filter(key => !process.env[key]);

  if (missingConfigs.length > 0) {
    console.warn('⚠️ Configurações ausentes:', missingConfigs);
    console.warn('Por favor, configure as variáveis de ambiente necessárias.');
  }

  return missingConfigs.length === 0;
}

// Função para obter a URL da API do Asaas baseada no ambiente
export function getAsaasApiUrl(): string {
  if (config.asaas.isProduction) {
    return config.asaas.apiUrl || 'https://api.asaas.com/';
  }
  return config.asaas.apiUrl || 'https://api-sandbox.asaas.com/';
}

// Função para obter a chave da API do Asaas baseada no ambiente
export function getAsaasApiKey(): string {
  if (config.asaas.isProduction) {
    return config.asaas.apiKey || '';
  }
  return config.asaas.apiKey || '';
}

// Função para verificar se a API do Asaas está configurada
export function isAsaasConfigured(): boolean {
  return !!(getAsaasApiUrl() && getAsaasApiKey());
} 