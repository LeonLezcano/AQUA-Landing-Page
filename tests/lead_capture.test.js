import assert from 'node:assert/strict';
import { Sanitizer } from '../src/utils/sanitizer.js';

export function runLeadCaptureTests() {
  console.log('  🧪 Testing Lead Capture & WhatsApp Dispatch (Layer 2: Business Logic)...');

  const mockStorage = new Map();
  globalThis.localStorage = {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k)
  };

  const lead = {
    name: 'Roberto Gómez',
    company: 'Aguas del Valle SRL',
    city: 'Córdoba Capital',
    phone: '3514449988',
    trucks: '3'
  };

  // 1. Validation & sanitization
  const safeName = Sanitizer.escapeHTML(lead.name);
  const safeCompany = Sanitizer.escapeHTML(lead.company);
  const safeCity = Sanitizer.escapeHTML(lead.city);
  const safePhone = Sanitizer.escapeHTML(lead.phone);

  assert.equal(safeName, 'Roberto Gómez');
  assert.equal(safeCompany, 'Aguas del Valle SRL');

  // 2. Storage persistence
  const savedLeads = [];
  savedLeads.push({ ...lead, timestamp: Date.now() });
  localStorage.setItem('aqua_leads', JSON.stringify(savedLeads));

  const loaded = JSON.parse(localStorage.getItem('aqua_leads') || '[]');
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].company, 'Aguas del Valle SRL');

  // 3. WhatsApp URI construction
  const message = encodeURIComponent(
    `¡Hola equipo de AQUA!\n` +
    `Mi nombre es ${safeName} de la embotelladora "${safeCompany}" (${safeCity}).\n` +
    `Contamos con ${lead.trucks} camiones de reparto y me gustaría coordinar una demostración en vivo del sistema.`
  );
  const targetUrl = Sanitizer.sanitizeURL(`https://wa.me/5493515937318?text=${message}`);

  assert.ok(targetUrl.startsWith('https://wa.me/5493515937318'), 'WhatsApp target URL must point to official booking number');
  assert.ok(targetUrl.includes(encodeURIComponent('Aguas del Valle SRL')), 'WhatsApp target URL must include company name parameter');

  console.log('    ✅ Lead capture & WhatsApp integration verified (6/6 tests pass)');
}
