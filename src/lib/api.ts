const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.albericonsult.com.br";


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

  console.log('🔍 [Fetcher] URL:', `${API_URL}${url}`);
  console.log('🔍 [Fetcher] Options:', finalOptions);
  console.log('🔍 [Fetcher] Body:', finalOptions.body);

  const response = await fetch(`${API_URL}${url}`, finalOptions);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ [Fetcher] Erro na resposta:', response.status, errorText);
    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};
