const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory token store (replace with secure storage in production)
let xeroState = {
  connected: false,
  lastPayrollSync: null,
  lastReimbSync: null,
};

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Connection status
app.get('/api/xero/status', (_req, res) => {
  res.json({
    connected: xeroState.connected,
    lastPayrollSync: xeroState.lastPayrollSync,
    lastReimbSync: xeroState.lastReimbSync,
  });
});

// Begin OAuth (placeholder)
app.get('/api/xero/connect', (_req, res) => {
  xeroState.connected = true;
  res.json({ connected: true, note: 'OAuth not wired yet - simulated connection' });
});

// Disconnect
app.post('/api/xero/disconnect', (_req, res) => {
  xeroState.connected = false;
  res.json({ connected: false });
});

// Sync payroll (stub)
app.post('/api/xero/sync/payroll', async (_req, res) => {
  if (!xeroState.connected) return res.status(400).json({ error: 'Not connected to Xero' });
  xeroState.lastPayrollSync = new Date().toISOString();
  res.json({ ok: true, syncedAt: xeroState.lastPayrollSync });
});

// Sync reimbursements (stub)
app.post('/api/xero/sync/reimbursements', async (_req, res) => {
  if (!xeroState.connected) return res.status(400).json({ error: 'Not connected to Xero' });
  xeroState.lastReimbSync = new Date().toISOString();
  res.json({ ok: true, syncedAt: xeroState.lastReimbSync });
});

module.exports = app;


