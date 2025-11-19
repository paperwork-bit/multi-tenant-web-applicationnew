#!/usr/bin/env tsx

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface ArgMap {
  [key: string]: string | undefined;
}

const argv = process.argv.slice(2);
const argMap: ArgMap = argv.reduce((acc, item, idx, arr) => {
  if (item.startsWith('--')) {
    const key = item;
    const next = arr[idx + 1];
    if (next && !next.startsWith('--')) {
      acc[key] = next;
    } else {
      acc[key] = 'true';
    }
  }
  return acc;
}, {} as ArgMap);

const inputPath = resolve(process.cwd(), argMap['--input'] || 'data/local-storage.json');
const apiBase = (argMap['--api'] || process.env.CF_API_BASE || 'http://127.0.0.1:8787/api').replace(/\/+$/, '');
const token = argMap['--token'] || process.env.CF_MIGRATION_TOKEN;
const dryRun = argv.includes('--dry-run');

async function main() {
  const raw = await readFile(inputPath, 'utf-8');
  const parsed = JSON.parse(raw);
  const entries = normalizeEntries(parsed);
  if (!entries.length) {
    console.log('No entries detected in input payload.');
    return;
  }

  console.log(`Processing ${entries.length} localStorage keys from ${inputPath}`);

  for (const [key, value] of entries) {
    if (!key.startsWith('xtr_')) {
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] Would migrate ${key} (${value.length} bytes)`);
      continue;
    }
    const res = await fetch(`${apiBase}/storage/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to persist ${key} (${res.status}): ${text}`);
    }
    console.log(`Migrated ${key}`);
  }

  console.log('Migration complete!');
}

function normalizeEntries(input: unknown): [string, string][] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
          return [String(item.key), String((item as any).value)];
        }
        return null;
      })
      .filter((entry): entry is [string, string] => Array.isArray(entry));
  }
  if (typeof input === 'object') {
    if ('keys' in input && typeof (input as any).keys === 'object') {
      return normalizeEntries((input as any).keys);
    }
    return Object.entries(input as Record<string, unknown>).map(([key, value]) => [key, String(value ?? '')]);
  }
  return [];
}

main().catch((error) => {
  console.error('[migrate-local-to-d1] Migration failed:', error);
  process.exitCode = 1;
});


