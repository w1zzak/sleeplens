const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface FetchOptions extends RequestInit {
  data?: unknown;
}

export const api = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { data, headers: customHeaders, ...restOptions } = options;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type') && data && !(data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const responseData: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || 'Ocurrió un error en la solicitud');
  }

  return responseData.data;
};
