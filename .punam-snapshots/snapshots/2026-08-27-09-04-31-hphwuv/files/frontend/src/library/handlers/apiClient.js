/** Lightweight fetch wrapper — swap baseURL when backend is ready */
const baseURL = import.meta.env.VITE_API_URL || '';

export async function apiClient(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(`${baseURL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || res.statusText || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}
