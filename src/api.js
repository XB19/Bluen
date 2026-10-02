const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'bluen_token';

export const tokenStore = {
  get: () => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (t) => {
    try {
      if (t) localStorage.setItem(TOKEN_KEY, t);
      else localStorage.removeItem(TOKEN_KEY);
    } catch { /* stockage indisponible */ }
  },
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || 'Une erreur est survenue. Veuillez réessayer.');
    this.status = status;
    this.errors = body?.errors || {};
  }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export async function api(path, { method = 'GET', body, params } = {}) {
  const url = new URL(BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
  }
  const headers = {};
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(url, { method, headers, body: isForm ? body : body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, { message: 'Serveur injoignable. Vérifiez votre connexion.' });
  }

  if (res.status === 401 && token) onUnauthorized();
  if (res.status === 204) return null;
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  if (res.ok && !isJson) {
    throw new ApiError(res.status, { message: 'Le serveur a renvoyé une réponse inattendue. Vérifiez la configuration de l’API.' });
  }
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok && !data && res.status >= 502) {
    throw new ApiError(res.status, { message: 'Le serveur est momentanément indisponible. Réessayez dans un instant.' });
  }
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

export async function downloadFile(path, fallbackName) {
  const token = tokenStore.get();
  const res = await fetch(BASE + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data);
  }
  const disposition = res.headers.get('content-disposition') || '';
  const match = disposition.match(/filename\*=UTF-8''([^;]+)/) || disposition.match(/filename="([^"]+)"/);
  const name = match ? decodeURIComponent(match[1]) : fallbackName;
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const uploadFile = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api('/admin/uploads', { method: 'POST', body: form });
};
