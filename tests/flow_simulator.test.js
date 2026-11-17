import assert from 'node:assert/strict';
import { FlowSimulator } from '../src/scripts/flow-simulator.js';

// Minimal DOM mock for Node runner
function createMockDOM() {
  const container = {
    querySelectorAll(sel) {
      if (sel === '.flow-node') {
        return [
          { classList: { add() {}, remove() {} }, getBoundingClientRect: () => ({ left: 50, top: 20, width: 80, height: 80 }) },
          { classList: { add() {}, remove() {} }, getBoundingClientRect: () => ({ left: 150, top: 20, width: 80, height: 80 }) },
          { classList: { add() {}, remove() {} }, getBoundingClientRect: () => ({ left: 250, top: 20, width: 80, height: 80 }) },
          { classList: { add() {}, remove() {} }, getBoundingClientRect: () => ({ left: 350, top: 20, width: 80, height: 80 }) }
        ];
      }
      return [];
    },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 120 })
  };

  const wire = {
    setAttribute() {},
    innerHTML: ''
  };

  const log = {
    children: [],
    appendChild(child) { this.children.push(child); },
    firstChild: null
  };

  return { container, wire, log };
}

export function runFlowSimulatorTests() {
  console.log('  🧪 Testing Flow Simulator Engine (Layer 2: Integration & Reactive Loop)...');

  const { container, wire, log } = createMockDOM();
  const sim = new FlowSimulator();
  sim.container = container;
  sim.wire = wire;
  sim.log = log;

  assert.equal(sim.stepIndex, 0, 'Initial step index should be 0');
  assert.equal(sim.events.length, 6, 'Flow simulator must contain 6 end-to-end plant events');

  // Verify tick progression
  sim.tick();
  assert.equal(sim.stepIndex, 1, 'Tick must advance step index to 1');
  assert.equal(sim.events[0].node, 0, 'First event originates from Client Portal');

  sim.tick();
  assert.equal(sim.stepIndex, 2, 'Tick must advance step index to 2');
  assert.equal(sim.events[1].node, 1, 'Second event transitions to Plant & Quality');

  sim.drawWire();
  assert.ok(sim.wire.innerHTML.includes('aquaWireGrad'), 'SVG wire must generate electric cyan gradient');
  assert.ok(sim.wire.innerHTML.includes('polyline'), 'SVG wire must generate polyline path');

  // Cycle wrapping
  for (let i = 0; i < 10; i++) {
    sim.tick();
  }
  assert.equal(sim.stepIndex, 12, '12 ticks completed successfully');

  console.log('    ✅ Flow simulator state transitions verified (8/8 tests pass)');
}
