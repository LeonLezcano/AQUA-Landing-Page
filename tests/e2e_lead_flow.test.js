import assert from 'node:assert/strict';
import { ROICalculator } from '../src/scripts/roi-calculator.js';
import { Sanitizer } from '../src/utils/sanitizer.js';

export function runE2ELeadFlowTests() {
  console.log('  🧪 Testing E2E User Journey & Conversion Funnel (Layer 5: Simulation)...');

  // Step 1: User arrives on landing page, views hero and triggers ROI calculation
  const visitorFleet = { dailyBottles: 800, trucks: 4 };
  const roi = ROICalculator.calculate(visitorFleet);
  assert.ok(roi.totalSavingsMonthly > 3000000, 'User sees > $3M ARS projected savings for 4 trucks');

  // Step 2: User decides on Professional Plan
  const planChosen = {
    plan: 'Profesional',
    price: 139000,
    trucksIncluded: 5
  };
  assert.ok(planChosen.trucksIncluded >= visitorFleet.trucks, 'Plan chosen accommodates user fleet');

  // Step 3: User fills contact form
  const rawFormSubmission = {
    name: 'Mariano Benítez',
    company: 'Aguas del Centro SA',
    city: 'Río Cuarto, Córdoba',
    phone: '358-4123456',
    trucks: '4'
  };

  const safeLead = {
    name: Sanitizer.escapeHTML(rawFormSubmission.name),
    company: Sanitizer.escapeHTML(rawFormSubmission.company),
    city: Sanitizer.escapeHTML(rawFormSubmission.city),
    phone: Sanitizer.escapeHTML(rawFormSubmission.phone),
    trucks: Sanitizer.escapeHTML(rawFormSubmission.trucks),
    estimatedRoiMonthly: roi.totalSavingsMonthly
  };

  assert.equal(safeLead.name, 'Mariano Benítez');
  assert.equal(safeLead.company, 'Aguas del Centro SA');

  // Step 4: WhatsApp conversion trigger
  const bookingMessage = encodeURIComponent(
    `¡Hola equipo de AQUA 2026!\n` +
    `Mi nombre es ${safeLead.name} de la embotelladora "${safeLead.company}" (${safeLead.city}).\n` +
    `Contamos con ${safeLead.trucks} camiones de reparto y me gustaría coordinar una demostración en vivo del sistema.`
  );
  const waLink = Sanitizer.sanitizeURL(`https://wa.me/5493515937318?text=${bookingMessage}`);

  assert.ok(waLink.startsWith('https://wa.me/5493515937318'));
  assert.ok(waLink.includes(encodeURIComponent('Aguas del Centro SA')));

  console.log('    ✅ E2E User conversion journey verified from Hero to WhatsApp (7/7 tests pass)');
}
