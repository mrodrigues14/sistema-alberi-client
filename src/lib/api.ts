const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const fetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${API_URL}${url}`, options);

  if (!response.ok) {
    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};
