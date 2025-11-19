const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/+$/, '') || '/api';

const endpoint = (path: string) => `${API_BASE}${path}`;

export async function getXeroStatus() {
  try {
    const res = await fetch(endpoint('/xero/status'));
    return await res.json();
  } catch {
    return { connected: false };
  }
}

export async function connectXero() {
  const res = await fetch(endpoint('/xero/connect'));
  return await res.json();
}

export async function disconnectXero() {
  const res = await fetch(endpoint('/xero/disconnect'), { method: 'POST' });
  return await res.json();
}

export async function syncPayroll() {
  const res = await fetch(endpoint('/xero/sync/payroll'), { method: 'POST' });
  return await res.json();
}

export async function syncReimbursements() {
  const res = await fetch(endpoint('/xero/sync/reimbursements'), { method: 'POST' });
  return await res.json();
}


