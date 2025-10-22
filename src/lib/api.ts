// Garante URL base correta (sem barra final repetida)
let base = process.env.NEXT_PUBLIC_API_URL || "https://api.albericonsult.com.br";
if (base.endsWith('/')) base = base.slice(0, -1);
const API_URL = base;


export const fetcher = async (url: string, options?: RequestInit) => {
  // Configurar headers padrão
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Mesclar headers padrão com os fornecidos
  const finalOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  // Evita duplicar domínio caso url já venha absoluta ou com protocolo
  const finalUrl = /^https?:\/+/.test(url) ? url : `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;

  const response = await fetch(finalUrl, finalOptions);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [Fetcher] Erro na resposta:', response.status, errorText);
    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
  }

  const json = await response.json();
  return json;
};
