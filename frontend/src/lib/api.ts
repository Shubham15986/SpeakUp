import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const apiFetch = async (input: RequestInfo, init?: RequestInit) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  if (url.startsWith('http://localhost:5001')) {
    url = url.replace('http://localhost:5001', API_BASE_URL);
  } else if (!url.startsWith('http')) {
    url = `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  const headers = new Headers(init?.headers);
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  return fetch(url, {
    ...init,
    headers,
  });
};
