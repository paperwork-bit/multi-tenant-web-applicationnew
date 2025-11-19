import type { D1Database, D1PreparedStatement, PagesFunction } from '@cloudflare/workers-types';

type Env = {
  D1_DB: D1Database;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return withCors(new Response('ok', { status: 204 }));
  }

  try {
    const response = await routeRequest(request, env);
    return withCors(response);
  } catch (error) {
    console.error('[worker] Unhandled error', error);
    return withCors(json({ error: 'Internal Server Error' }, 500));
  }
};

async function routeRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  let pathname = url.pathname;
  if (pathname !== '/' && pathname.endsWith('/')) pathname = pathname.slice(0, -1);

  if (!pathname.startsWith('/api')) {
    return json({ error: 'Not Found' }, 404);
  }

  const subPath = pathname.slice(4) || '/';

  // Health
  if (subPath === '' || subPath === '/') {
    return json({ ok: true });
  }
  if (subPath === '/health') {
    return json({ ok: true, ts: new Date().toISOString() });
  }

  // Xero endpoints
  if (subPath.startsWith('/xero')) {
    return handleXero(request, env, subPath);
  }

  // Storage endpoints
  if (subPath === '/storage/snapshot' && request.method === 'GET') {
    return getStorageSnapshot(env);
  }
  if (subPath.startsWith('/storage/')) {
    const key = decodeURIComponent(subPath.replace('/storage/', ''));
    return handleStorage(request, env, key);
  }

  // Projects + installation detail
  if (subPath === '/projects') {
    return handleProjectsCollection(request, env);
  }
  if (subPath.startsWith('/projects/')) {
    const parts = subPath.split('/').filter(Boolean); // ['projects', ':id', maybe 'installation']
    const projectId = decodeURIComponent(parts[1] ?? '');
    if (!projectId) return json({ error: 'Project id required' }, 400);
    if (parts.length === 2) {
      return handleProjectItem(request, env, projectId);
    }
    if (parts.length === 3 && parts[2] === 'installation') {
      return handleProjectInstallation(request, env, projectId);
    }
  }

  // Resources
  if (subPath === '/resources') {
    return handleResourcesCollection(request, env);
  }
  if (subPath.startsWith('/resources/')) {
    const resourceId = decodeURIComponent(subPath.replace('/resources/', ''));
    return handleResourceItem(request, env, resourceId);
  }

  return json({ error: 'Not Found' }, 404);
}

async function handleXero(request: Request, env: Env, subPath: string) {
  switch (subPath) {
    case '/xero/status': {
      const status = await getXeroState(env);
      return json(status);
    }
    case '/xero/connect': {
      const state = await getXeroState(env);
      const updated = {
        ...state,
        connected: true,
        connectedAt: new Date().toISOString(),
      };
      await persistXeroState(env, updated);
      return json(updated);
    }
    case '/xero/disconnect': {
      if (request.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
      const state = await getXeroState(env);
      const updated = { ...state, connected: false };
      await persistXeroState(env, updated);
      return json(updated);
    }
    case '/xero/sync/payroll': {
      if (request.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
      const state = await getXeroState(env);
      if (!state.connected) {
        return json({ error: 'Not connected to Xero' }, 400);
      }
      const updated = {
        ...state,
        lastPayrollSync: new Date().toISOString(),
      };
      await persistXeroState(env, updated);
      return json({ ok: true, syncedAt: updated.lastPayrollSync });
    }
    case '/xero/sync/reimbursements': {
      if (request.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
      const state = await getXeroState(env);
      if (!state.connected) {
        return json({ error: 'Not connected to Xero' }, 400);
      }
      const updated = {
        ...state,
        lastReimbSync: new Date().toISOString(),
      };
      await persistXeroState(env, updated);
      return json({ ok: true, syncedAt: updated.lastReimbSync });
    }
    default:
      return json({ error: 'Not Found' }, 404);
  }
}

async function getXeroState(env: Env) {
  const row = await env.D1_DB.prepare('SELECT data FROM xero_status WHERE key = ?1').bind('global').first<{ data: string }>();
  if (!row) {
    return {
      connected: false,
      lastPayrollSync: null,
      lastReimbSync: null,
    };
  }
  try {
    return JSON.parse(row.data);
  } catch {
    return {
      connected: false,
      lastPayrollSync: null,
      lastReimbSync: null,
    };
  }
}

async function persistXeroState(env: Env, state: Record<string, unknown>) {
  const payload = JSON.stringify(state);
  await env.D1_DB.prepare(
    `INSERT INTO xero_status (key, data, updated_at)
     VALUES (?1, ?2, ?3)
     ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
  ).bind('global', payload, new Date().toISOString()).run();
}

async function getStorageSnapshot(env: Env) {
  const result = await env.D1_DB.prepare('SELECT key, payload FROM documents').all<{ results: { key: string; payload: string }[] }>();
  const payload: Record<string, string> = {};
  for (const row of result.results || []) {
    payload[row.key] = row.payload;
  }
  return json({ keys: payload });
}

async function handleStorage(request: Request, env: Env, key: string) {
  if (request.method === 'GET') {
    const record = await env.D1_DB.prepare('SELECT payload FROM documents WHERE key = ?1').bind(key).first<{ payload: string }>();
    if (!record) return json({ key, value: null });
    return json({ key, value: record.payload });
  }

  if (request.method === 'DELETE') {
    await env.D1_DB.prepare('DELETE FROM documents WHERE key = ?1').bind(key).run();
    return json({ ok: true });
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const body = await readJson<{ value?: unknown; payload?: unknown }>(request);
    if (!body || (typeof body.value === 'undefined' && typeof body.payload === 'undefined')) {
      return json({ error: 'value is required' }, 400);
    }
    const rawValue = String(body.value ?? body.payload ?? '');
    await persistDocument(env, key, rawValue);
    return json({ ok: true });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function persistDocument(env: Env, key: string, rawValue: string) {
  const now = new Date().toISOString();
  await env.D1_DB.prepare(
    `INSERT INTO documents (key, payload, updated_at)
     VALUES (?1, ?2, ?3)
     ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`
  ).bind(key, rawValue, now).run();
  await fanOutDocument(env, key, rawValue, now);
}

async function fanOutDocument(env: Env, key: string, rawValue: string, updatedAt: string) {
  if (key === 'xtr_projects') {
    await syncProjectsTable(env, rawValue, updatedAt);
    return;
  }
  if (key.startsWith('xtr_installation_')) {
    await syncInstallationBucket(env, key, rawValue, updatedAt);
    return;
  }
  if (key === 'xtr_resources') {
    await syncResourcesTable(env, rawValue, updatedAt);
    return;
  }
  if (key === 'xtr_leads_state_columns') {
    await env.D1_DB.prepare(
      `INSERT INTO leads_pipeline (doc_id, columns, updated_at)
       VALUES ('columns', ?1, ?2)
       ON CONFLICT(doc_id) DO UPDATE SET columns = excluded.columns, updated_at = excluded.updated_at`
    ).bind(rawValue, updatedAt).run();
    return;
  }
  if (key === 'xtr_site_visits') {
    await syncSiteVisits(env, rawValue, updatedAt);
    return;
  }
  if (key === 'xtr_onfield_assessments' || key === 'xtr_retailer_site_visit_assessments') {
    await syncOnFieldAssessments(env, rawValue, updatedAt);
    return;
  }
  if (key.startsWith('xtr_attendance_records_')) {
    await syncAttendanceRecords(env, key, rawValue, updatedAt);
    return;
  }
  if (key === 'xtr_leave_approvals') {
    await syncLeaveRequests(env, rawValue, updatedAt);
    return;
  }
  if (key === 'xtr_reimbursement_requests') {
    await syncReimbursements(env, rawValue, updatedAt);
  }
}

async function syncProjectsTable(env: Env, rawValue: string, updatedAt: string) {
  let projects: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) projects = parsed;
  } catch {
    return;
  }
  const ids = projects.map((p) => String(p.id || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const project of projects) {
    const id = String(project.id || '');
    if (!id) continue;
    const status = String(project.status ?? '');
    const priority = String(project.priority ?? '');
    const tenant = String(project.tenant || 'default');
    const assignee = String(project.assignee || project.assignees?.[0] || '');
    const payload = JSON.stringify(project);
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO projects (id, tenant, status, priority, assignee, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
         ON CONFLICT(id) DO UPDATE SET
            tenant = excluded.tenant,
            status = excluded.status,
            priority = excluded.priority,
            assignee = excluded.assignee,
            payload = excluded.payload,
            updated_at = excluded.updated_at`
      ).bind(id, tenant, status, priority, assignee, payload, updatedAt)
    );
  }
  if (statements.length) {
    await env.D1_DB.batch(statements);
  }
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM projects').run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(`DELETE FROM projects WHERE id NOT IN (${placeholders})`).bind(...ids).run();
  }
}

async function syncInstallationBucket(env: Env, key: string, rawValue: string, updatedAt: string) {
  const match = key.match(/^xtr_installation_([a-z_]+)_(.+)$/i);
  if (!match) return;
  const section = match[1];
  const projectId = match[2];
  const allowedColumns = new Map<string, string>([
    ['checklist', 'checklist'],
    ['notes', 'notes'],
    ['expenses', 'expenses'],
    ['breaks', 'breaks'],
    ['photos', 'photos'],
    ['customer_notes', 'customer_notes'],
    ['job_status', 'job_status'],
    ['total_hours', 'total_hours'],
  ]);
  const column = allowedColumns.get(section);
  if (!column) return;
  await env.D1_DB.prepare(
    `INSERT INTO project_installation (project_id, ${column}, updated_at)
     VALUES (?1, ?2, ?3)
     ON CONFLICT(project_id) DO UPDATE SET ${column} = excluded.${column}, updated_at = excluded.updated_at`
  ).bind(projectId, rawValue, updatedAt).run();
}

async function syncResourcesTable(env: Env, rawValue: string, updatedAt: string) {
  let resources: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) resources = parsed;
  } catch {
    return;
  }
  const ids = resources.map((r) => String(r.id || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const resource of resources) {
    const id = String(resource.id || '');
    if (!id) continue;
    const name = String(resource.name || '');
    const role = String(resource.role || '');
    const department = String(resource.department || '');
    const status = String(resource.status || '');
    const payload = JSON.stringify(resource);
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO resources (id, name, role, department, status, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           role = excluded.role,
           department = excluded.department,
           status = excluded.status,
           payload = excluded.payload,
           updated_at = excluded.updated_at`
      ).bind(id, name, role, department, status, payload, updatedAt)
    );
  }
  if (statements.length) {
    await env.D1_DB.batch(statements);
  }
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM resources').run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(`DELETE FROM resources WHERE id NOT IN (${placeholders})`).bind(...ids).run();
  }
}

async function syncSiteVisits(env: Env, rawValue: string, updatedAt: string) {
  let visits: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) visits = parsed;
  } catch {
    return;
  }
  const ids = visits.map((v) => String(v.id || v.leadId || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const visit of visits) {
    const id = String(visit.id || visit.leadId || '');
    if (!id) continue;
    const leadId = String(visit.leadId || '');
    const type = String(visit.type || visit.category || '');
    const status = String(visit.status || visit.state || '');
    const payload = JSON.stringify(visit);
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO site_visits (id, lead_id, type, status, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)
         ON CONFLICT(id) DO UPDATE SET
            lead_id = excluded.lead_id,
            type = excluded.type,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at`
      ).bind(id, leadId, type, status, payload, updatedAt)
    );
  }
  if (statements.length) await env.D1_DB.batch(statements);
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM site_visits').run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(`DELETE FROM site_visits WHERE id NOT IN (${placeholders})`).bind(...ids).run();
  }
}

async function syncOnFieldAssessments(env: Env, rawValue: string, updatedAt: string) {
  let assessments: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) assessments = parsed;
  } catch {
    return;
  }
  const ids = assessments.map((a) => String(a.id || a.leadId || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const assessment of assessments) {
    const id = String(assessment.id || assessment.leadId || '');
    if (!id) continue;
    const leadId = String(assessment.leadId || '');
    const status = String(assessment.status || '');
    const payload = JSON.stringify(assessment);
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO onfield_assessments (id, lead_id, status, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
            lead_id = excluded.lead_id,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at`
      ).bind(id, leadId, status, payload, updatedAt)
    );
  }
  if (statements.length) await env.D1_DB.batch(statements);
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM onfield_assessments').run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(`DELETE FROM onfield_assessments WHERE id NOT IN (${placeholders})`).bind(...ids).run();
  }
}

async function syncAttendanceRecords(env: Env, key: string, rawValue: string, updatedAt: string) {
  const employeeId = key.replace('xtr_attendance_records_', '');
  if (!employeeId) return;
  let records: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) records = parsed;
  } catch {
    return;
  }
  const ids = records.map((r) => String(r.id || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const record of records) {
    const id = String(record.id || '');
    if (!id) continue;
    const status = String(record.status || '');
    const payload = JSON.stringify({ ...record, employeeId });
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO attendance_records (id, employee_id, status, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
            employee_id = excluded.employee_id,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at`
      ).bind(id, employeeId, status, payload, updatedAt)
    );
  }
  if (statements.length) await env.D1_DB.batch(statements);
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM attendance_records WHERE employee_id = ?1').bind(employeeId).run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(
      `DELETE FROM attendance_records WHERE employee_id = ?${ids.length + 1} AND id NOT IN (${placeholders})`
    ).bind(...ids, employeeId).run();
  }
}

async function syncLeaveRequests(env: Env, rawValue: string, updatedAt: string) {
  let requests: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) requests = parsed;
  } catch {
    return;
  }
  const ids = requests.map((r) => String(r.id || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const request of requests) {
    const id = String(request.id || '');
    if (!id) continue;
    const employeeId = String(request.employeeEmail || request.employeeId || '');
    const status = String(request.status || 'pending');
    const payload = JSON.stringify(request);
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO leave_requests (id, employee_id, status, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
            employee_id = excluded.employee_id,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at`
      ).bind(id, employeeId, status, payload, updatedAt)
    );
  }
  if (statements.length) await env.D1_DB.batch(statements);
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM leave_requests').run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(`DELETE FROM leave_requests WHERE id NOT IN (${placeholders})`).bind(...ids).run();
  }
}

async function syncReimbursements(env: Env, rawValue: string, updatedAt: string) {
  let reimbursements: any[] = [];
  try {
    const parsed = JSON.parse(rawValue);
    if (Array.isArray(parsed)) reimbursements = parsed;
  } catch {
    return;
  }
  const ids = reimbursements.map((r) => String(r.id || '')).filter(Boolean);
  const statements: D1PreparedStatement[] = [];
  for (const reimbursement of reimbursements) {
    const id = String(reimbursement.id || '');
    if (!id) continue;
    const employeeId = String(reimbursement.employeeEmail || reimbursement.employeeId || '');
    const status = String(reimbursement.status || 'pending');
    const payload = JSON.stringify(reimbursement);
    statements.push(
      env.D1_DB.prepare(
        `INSERT INTO reimbursements (id, employee_id, status, payload, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(id) DO UPDATE SET
            employee_id = excluded.employee_id,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at`
      ).bind(id, employeeId, status, payload, updatedAt)
    );
  }
  if (statements.length) await env.D1_DB.batch(statements);
  if (!ids.length) {
    await env.D1_DB.prepare('DELETE FROM reimbursements').run();
  } else {
    const placeholders = ids.map((_, index) => `?${index + 1}`).join(',');
    await env.D1_DB.prepare(`DELETE FROM reimbursements WHERE id NOT IN (${placeholders})`).bind(...ids).run();
  }
}

async function handleProjectsCollection(request: Request, env: Env) {
  if (request.method === 'GET') {
    const rows = await env.D1_DB.prepare('SELECT payload FROM projects ORDER BY updated_at DESC').all<{ results: { payload: string }[] }>();
    const projects = (rows.results || []).map((row) => {
      try {
        return JSON.parse(row.payload);
      } catch {
        return null;
      }
    }).filter(Boolean);
    return json({ projects });
  }

  if (request.method === 'POST') {
    const body = await readJson<any>(request);
    if (!body || !body.id) return json({ error: 'Project id required' }, 400);
    await saveProjectRecord(env, body);
    return json({ ok: true });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function handleProjectItem(request: Request, env: Env, projectId: string) {
  if (request.method === 'GET') {
    const row = await env.D1_DB.prepare('SELECT payload FROM projects WHERE id = ?1').bind(projectId).first<{ payload: string }>();
    if (!row) return json({ error: 'Not Found' }, 404);
    try {
      return json(JSON.parse(row.payload));
    } catch {
      return json({ error: 'Corrupt record' }, 500);
    }
  }

  if (request.method === 'PUT' || request.method === 'PATCH') {
    const body = await readJson<any>(request);
    if (!body) return json({ error: 'Body required' }, 400);
    body.id = projectId;
    await saveProjectRecord(env, body);
    return json({ ok: true });
  }

  if (request.method === 'DELETE') {
    await deleteProjectRecord(env, projectId);
    return json({ ok: true });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function handleProjectInstallation(request: Request, env: Env, projectId: string) {
  if (request.method === 'GET') {
    const row = await env.D1_DB.prepare('SELECT * FROM project_installation WHERE project_id = ?1').bind(projectId).first();
    if (!row) return json({ projectId, checklist: null, notes: null, expenses: null, breaks: null, photos: null, customerNotes: null, jobStatus: null, totalHours: null });
    return json({
      projectId,
      checklist: safeParse(row.checklist),
      notes: safeParse(row.notes),
      expenses: safeParse(row.expenses),
      breaks: safeParse(row.breaks),
      photos: safeParse(row.photos),
      customerNotes: safeParse(row.customer_notes),
      jobStatus: safeParse(row.job_status),
      totalHours: safeParse(row.total_hours),
    });
  }

  if (request.method === 'PUT' || request.method === 'PATCH') {
    const body = await readJson<any>(request);
    if (!body) return json({ error: 'Body required' }, 400);
    const now = new Date().toISOString();
    await env.D1_DB.prepare(
      `INSERT INTO project_installation (project_id, checklist, notes, expenses, breaks, photos, customer_notes, job_status, total_hours, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
       ON CONFLICT(project_id) DO UPDATE SET
          checklist = excluded.checklist,
          notes = excluded.notes,
          expenses = excluded.expenses,
          breaks = excluded.breaks,
          photos = excluded.photos,
          customer_notes = excluded.customer_notes,
          job_status = excluded.job_status,
          total_hours = excluded.total_hours,
          updated_at = excluded.updated_at`
    ).bind(
      projectId,
      JSON.stringify(body.checklist ?? null),
      JSON.stringify(body.notes ?? null),
      JSON.stringify(body.expenses ?? null),
      JSON.stringify(body.breaks ?? null),
      JSON.stringify(body.photos ?? null),
      JSON.stringify(body.customerNotes ?? null),
      JSON.stringify(body.jobStatus ?? null),
      JSON.stringify(body.totalHours ?? null),
      now
    ).run();
    return json({ ok: true });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function handleResourcesCollection(request: Request, env: Env) {
  if (request.method === 'GET') {
    const rows = await env.D1_DB.prepare('SELECT payload FROM resources ORDER BY updated_at DESC').all<{ results: { payload: string }[] }>();
    const resources = (rows.results || []).map((row) => safeParse(row.payload)).filter(Boolean);
    return json({ resources });
  }

  if (request.method === 'POST') {
    const body = await readJson<any>(request);
    if (!body || !body.id) return json({ error: 'Resource id required' }, 400);
    await saveResourceRecord(env, body);
    return json({ ok: true });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function handleResourceItem(request: Request, env: Env, resourceId: string) {
  if (request.method === 'GET') {
    const row = await env.D1_DB.prepare('SELECT payload FROM resources WHERE id = ?1').bind(resourceId).first<{ payload: string }>();
    if (!row) return json({ error: 'Not Found' }, 404);
    return json(safeParse(row.payload));
  }

  if (request.method === 'PUT' || request.method === 'PATCH') {
    const body = await readJson<any>(request);
    if (!body) return json({ error: 'Body required' }, 400);
    body.id = resourceId;
    await saveResourceRecord(env, body);
    return json({ ok: true });
  }

  if (request.method === 'DELETE') {
    await env.D1_DB.prepare('DELETE FROM resources WHERE id = ?1').bind(resourceId).run();
    await persistDocument(env, 'xtr_resources', await snapshotResources(env));
    return json({ ok: true });
  }

  return json({ error: 'Method Not Allowed' }, 405);
}

async function snapshotProjects(env: Env) {
  const rows = await env.D1_DB.prepare('SELECT payload FROM projects ORDER BY updated_at DESC').all<{ results: { payload: string }[] }>();
  return JSON.stringify((rows.results || []).map((row) => safeParse(row.payload)).filter(Boolean));
}

async function snapshotResources(env: Env) {
  const rows = await env.D1_DB.prepare('SELECT payload FROM resources ORDER BY updated_at DESC').all<{ results: { payload: string }[] }>();
  return JSON.stringify((rows.results || []).map((row) => safeParse(row.payload)).filter(Boolean));
}

async function saveProjectRecord(env: Env, body: any) {
  const now = new Date().toISOString();
  const payload = JSON.stringify(body);
  await env.D1_DB.prepare(
    `INSERT INTO projects (id, tenant, status, priority, assignee, payload, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(id) DO UPDATE SET
       tenant = excluded.tenant,
       status = excluded.status,
       priority = excluded.priority,
       assignee = excluded.assignee,
       payload = excluded.payload,
       updated_at = excluded.updated_at`
  ).bind(
    String(body.id),
    String(body.tenant || 'default'),
    String(body.status || ''),
    String(body.priority || ''),
    String(body.assignee || body.assignees?.[0] || ''),
    payload,
    now
  ).run();
  await persistDocument(env, 'xtr_projects', await snapshotProjects(env));
}

async function deleteProjectRecord(env: Env, projectId: string) {
  await env.D1_DB.prepare('DELETE FROM projects WHERE id = ?1').bind(projectId).run();
  await env.D1_DB.prepare('DELETE FROM project_installation WHERE project_id = ?1').bind(projectId).run();
  await persistDocument(env, 'xtr_projects', await snapshotProjects(env));
}

async function saveResourceRecord(env: Env, body: any) {
  const now = new Date().toISOString();
  const payload = JSON.stringify(body);
  await env.D1_DB.prepare(
    `INSERT INTO resources (id, name, role, department, status, payload, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       role = excluded.role,
       department = excluded.department,
       status = excluded.status,
       payload = excluded.payload,
       updated_at = excluded.updated_at`
  ).bind(
    String(body.id),
    String(body.name || ''),
    String(body.role || ''),
    String(body.department || ''),
    String(body.status || ''),
    payload,
    now
  ).run();
  await persistDocument(env, 'xtr_resources', await snapshotResources(env));
}

async function readJson<T>(request: Request): Promise<T | null> {
  try {
    const text = await request.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function safeParse<T = unknown>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function withCors(response: Response) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}


