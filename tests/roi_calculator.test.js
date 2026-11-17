import assert from 'node:assert/strict';
import { ROICalculator } from '../src/scripts/roi-calculator.js';

export function runROICalculatorTests() {
  console.log('  🧪 Testing ROI Calculator & Financial Algorithms (Layer 1: Unit & Boundary)...');

  // Standard benchmark: 500 bottles/day, 3 trucks
  const res = ROICalculator.calculate({ dailyBottles: 500, trucks: 3 });

  assert.ok(res.totalSavingsMonthly > 0, 'Total monthly savings must be strictly positive');
  assert.ok(res.totalSavingsAnnual === res.totalSavingsMonthly * 12, 'Annual savings must equal monthly * 12');
  assert.ok(res.bottlesSaved > 0, 'Prevented bottle loss count must be positive');
  assert.ok(res.kmSavedMonthly > 0, 'Optimized fuel km must be positive');
  assert.ok(res.adminHoursSaved > 0, 'Admin hours saved must be positive');

  // Verify formatted strings
  assert.ok(res.formatted.totalMonthly.includes('$'), 'Formatted monthly string must include currency symbol');
  assert.ok(res.formatted.bottlesSavedCount.includes('bidones/mes'), 'Formatted bottles must specify units');
  assert.ok(res.formatted.kmSavedCount.includes('km/mes'), 'Formatted km must specify units');

  // Boundary conditions
  const zeroInput = ROICalculator.calculate({ dailyBottles: 0, trucks: 0 });
  assert.ok(zeroInput.dailyBottles >= 50, 'Minimum floor for bottles should be enforced');
  assert.ok(zeroInput.trucks >= 1, 'Minimum floor for trucks should be enforced');

  const largeInput = ROICalculator.calculate({ dailyBottles: 10000, trucks: 50 });
  assert.ok(largeInput.totalSavingsMonthly > res.totalSavingsMonthly, 'Large fleet must generate higher savings than small fleet');

  // Negative inputs should gracefully clamp
  const negativeInput = ROICalculator.calculate({ dailyBottles: -500, trucks: -2 });
  assert.ok(negativeInput.totalSavingsMonthly > 0, 'Negative input must be clamped safely without throwing');

  console.log('    ✅ ROI Calculator algorithms & boundaries verified (11/11 tests pass)');
}
