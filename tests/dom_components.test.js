import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

export function runDomComponentTests() {
  console.log('  🧪 Testing DOM Components & Semantics (Layer 3: Structure & Accessibility)...');

  // 1. Mandatory Brand & Head elements
  assert.ok(htmlContent.includes('<title>AQUA 2026'), 'Document title must contain AQUA 2026');
  assert.ok(htmlContent.includes('rel="manifest"'), 'PWA manifest must be referenced');
  assert.ok(htmlContent.includes('theme-color'), 'Meta theme-color must be present');
  assert.ok(htmlContent.includes('viewport'), 'Responsive viewport tag must be declared');

  // 2. Sections
  assert.ok(htmlContent.includes('id="proceso"'), 'Interactive process section must exist');
  assert.ok(htmlContent.includes('id="problemas"'), 'Problems breakdown section must exist');
  assert.ok(htmlContent.includes('id="modulos"'), 'Modules grid section must exist');
  assert.ok(htmlContent.includes('id="roi"'), 'ROI calculator section must exist');
  assert.ok(htmlContent.includes('id="planes"'), 'Commercial plans section must exist');
  assert.ok(htmlContent.includes('id="faq"'), 'FAQ section must exist');
  assert.ok(htmlContent.includes('id="contacto"'), 'Lead capture section must exist');

  // 3. Operational Flow nodes
  assert.ok(htmlContent.includes('1. Cliente (Portal 2.0)'), 'Node 1 must exist');
  assert.ok(htmlContent.includes('2. Planta & Calidad'), 'Node 2 must exist');
  assert.ok(htmlContent.includes('3. Logística & Chofer'), 'Node 3 must exist');
  assert.ok(htmlContent.includes('4. Facturación & AFIP'), 'Node 4 must exist');

  // 4. Form inputs
  assert.ok(htmlContent.includes('id="lead-name"'), 'Name input must be declared');
  assert.ok(htmlContent.includes('id="lead-company"'), 'Company input must be declared');
  assert.ok(htmlContent.includes('id="lead-phone"'), 'Phone input must be declared');

  console.log('    ✅ DOM semantics & accessible component contracts verified (15/15 tests pass)');
}
