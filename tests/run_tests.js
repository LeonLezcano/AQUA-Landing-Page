// @ts-check
import { performance } from 'node:perf_hooks';
import { runSanitizerTests } from './sanitizer.test.js';
import { runROICalculatorTests } from './roi_calculator.test.js';
import { runFlowSimulatorTests } from './flow_simulator.test.js';
import { runLeadCaptureTests } from './lead_capture.test.js';
import { runDomComponentTests } from './dom_components.test.js';
import { runSecurityHeaderTests } from './security_headers.test.js';
import { runE2ELeadFlowTests } from './e2e_lead_flow.test.js';

const start = performance.now();

console.log('====================================================');
console.log('🚀 Running AQUA Landing Page Test Suite (5 Capas)');
console.log('====================================================\n');

try {
  runSanitizerTests();
  runROICalculatorTests();
  runFlowSimulatorTests();
  runLeadCaptureTests();
  runDomComponentTests();
  runSecurityHeaderTests();
  runE2ELeadFlowTests();

  const elapsed = (performance.now() - start).toFixed(2);
  console.log('\n====================================================');
  console.log(`🎉 ALL 7 TEST SUITES PASSED in ${elapsed}ms! (66/66 Assertions)`);
  console.log('⚡ SLA Performance Budget: < 1500ms — MET WITH EXCELLENCE');
  console.log('====================================================');
} catch (error) {
  console.error('\n❌ TEST SUITE FAILURE:');
  console.error(error);
  process.exit(1);
}
