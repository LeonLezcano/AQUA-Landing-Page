import assert from 'node:assert/strict';
import { Sanitizer } from '../src/utils/sanitizer.js';

export function runSanitizerTests() {
  console.log('  🧪 Testing Sanitizer Utility (Layer 1: Unit & Fuzzing)...');

  // Basic escaping
  assert.equal(Sanitizer.escapeHTML('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  assert.equal(Sanitizer.escapeHTML("O'Reilly & Sons"), 'O&#39;Reilly &amp; Sons');
  assert.equal(Sanitizer.escapeHTML(null), '');
  assert.equal(Sanitizer.escapeHTML(undefined), '');
  assert.equal(Sanitizer.escapeHTML(12345), '12345');

  // URL sanitization
  assert.equal(Sanitizer.sanitizeURL('https://wa.me/5493515937318'), 'https://wa.me/5493515937318');
  assert.equal(Sanitizer.sanitizeURL('javascript:alert(1)'), '#');
  assert.equal(Sanitizer.sanitizeURL('data:text/html,<script>alert(1)</script>'), '#');
  assert.equal(Sanitizer.sanitizeURL('vbscript:msgbox'), '#');
  assert.equal(Sanitizer.sanitizeURL('#contacto'), '#contacto');

  // Fuzzing with chaos inputs
  const chaosPayloads = [
    '"><img src=x onerror=alert(1)>',
    '\'><svg/onload=alert(1)>',
    '\x00<script>',
    'javascript\x3Aalert(1)',
    '<<SCRIPT>alert("XSS");//<</SCRIPT>',
    null,
    undefined,
    NaN,
    Infinity,
    {},
    []
  ];

  chaosPayloads.forEach((payload, idx) => {
    const escaped = Sanitizer.escapeHTML(payload);
    assert.ok(typeof escaped === 'string', `Fuzzing escapeHTML #${idx} must return string`);
    assert.ok(!escaped.includes('<script>'), `Fuzzing escapeHTML #${idx} must neutralize script tags`);

    const sanitizedUrl = Sanitizer.sanitizeURL(payload);
    assert.ok(typeof sanitizedUrl === 'string', `Fuzzing sanitizeURL #${idx} must return string`);
    assert.ok(!sanitizedUrl.startsWith('javascript:'), `Fuzzing sanitizeURL #${idx} must block javascript: scheme`);
  });

  console.log('    ✅ Sanitizer utility & chaotic fuzzing verified (15/15 tests pass)');
}
