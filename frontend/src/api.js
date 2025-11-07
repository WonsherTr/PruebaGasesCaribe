const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export async function api(path, opts = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  try { return await res.json(); } catch { return {}; }
}
export function authHeader(){
  const t = localStorage.getItem('token');
  return t ? { Authorization: 'Bearer ' + t } : {};
}
