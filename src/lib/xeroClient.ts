export async function getXeroStatus() {
  try {
    const res = await fetch('/api/xero/status');
    return await res.json();
  } catch {
    return { connected: false };
  }
}

export async function connectXero() {
  const res = await fetch('/api/xero/connect');
  return await res.json();
}

export async function disconnectXero() {
  const res = await fetch('/api/xero/disconnect', { method: 'POST' });
  return await res.json();
}

export async function syncPayroll() {
  const res = await fetch('/api/xero/sync/payroll', { method: 'POST' });
  return await res.json();
}

export async function syncReimbursements() {
  const res = await fetch('/api/xero/sync/reimbursements', { method: 'POST' });
  return await res.json();
}


