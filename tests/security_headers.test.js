import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fbPath = path.resolve(__dirname, '../firebase.json');
const fbRaw = fs.readFileSync(fbPath, 'utf8');

export function runSecurityHeaderTests() {
  console.log('  🧪 Testing Security Headers & CSP (Layer 4: AppSec Guardian & Invariants)...');

  // Verify UTF-8 clean without BOM
  assert.ok(!fbRaw.startsWith('\uFEFF'), 'firebase.json must NOT contain UTF-8 BOM');

  const fbConfig = JSON.parse(fbRaw);
  assert.ok(fbConfig.hosting, 'firebase.json must declare hosting config');
  assert.ok(Array.isArray(fbConfig.hosting.headers), 'firebase.json must declare headers array');

  // Find /sw.js anti-stale header
  const swHeaderEntry = fbConfig.hosting.headers.find(h => h.source === '/sw.js');
  assert.ok(swHeaderEntry, 'firebase.json must declare anti-stale header for /sw.js');
  const swCacheControl = swHeaderEntry.headers.find(h => h.key === 'Cache-Control');
  assert.ok(swCacheControl, 'Cache-Control header for /sw.js must be present');
  assert.ok(swCacheControl.value.includes('no-cache'), 'Cache-Control must contain no-cache');
  assert.ok(swCacheControl.value.includes('must-revalidate'), 'Cache-Control must contain must-revalidate');

  // Find universal wildcard headers
  const allHeadersEntry = fbConfig.hosting.headers.find(h => h.source === '**');
  assert.ok(allHeadersEntry, 'Universal wildcard ** headers must be declared');

  const csp = allHeadersEntry.headers.find(h => h.key === 'Content-Security-Policy');
  assert.ok(csp, 'Content-Security-Policy header must be declared');
  assert.ok(!csp.value.includes("'unsafe-eval'"), 'CSP must NOT contain unsafe-eval');
  assert.ok(!csp.value.includes('http://'), 'CSP must NOT allow insecure http:// origins');

  const xfo = allHeadersEntry.headers.find(h => h.key === 'X-Frame-Options');
  assert.equal(xfo?.value, 'DENY', 'X-Frame-Options must be DENY');

  const nosniff = allHeadersEntry.headers.find(h => h.key === 'X-Content-Type-Options');
  assert.equal(nosniff?.value, 'nosniff', 'X-Content-Type-Options must be nosniff');

  const hsts = allHeadersEntry.headers.find(h => h.key === 'Strict-Transport-Security');
  assert.ok(hsts?.value.includes('max-age'), 'Strict-Transport-Security must be configured');

  console.log('    ✅ AppSec security headers & anti-stale cache invariants verified (12/12 tests pass)');
}
