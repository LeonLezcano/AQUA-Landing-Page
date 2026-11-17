/**
 * Interactive SVG Wire & Real-Time Production Flow Simulator for AQUA 2026.
 * Reconstructed & enhanced from the reverse-engineered Glidex process widget,
 * adapted to water bottling plant operations (Clients, Plant Floor, Logistics, AFIP).
 */
export class FlowSimulator {
  /**
   * @param {Object} options
   * @param {string} [options.containerSelector='#flow-container']
   * @param {string} [options.wireSelector='#wire-svg']
   * @param {string} [options.logSelector='#flow-log']
   * @param {number} [options.intervalMs=2200]
   */
  constructor({
    containerSelector = '#flow-container',
    wireSelector = '#wire-svg',
    logSelector = '#flow-log',
    intervalMs = 2200
  } = {}) {
    this.container = typeof document !== 'undefined' ? document.querySelector(containerSelector) : null;
    this.wire = typeof document !== 'undefined' ? document.querySelector(wireSelector) : null;
    this.log = typeof document !== 'undefined' ? document.querySelector(logSelector) : null;
    this.intervalMs = intervalMs;
    this.intervalId = null;
    this.stepIndex = 0;

    this.events = [
      { node: 0, text: 'Cliente en Córdoba pide <b>4 bidones 20L + 2 sifones</b> desde el Portal Web' },
      { node: 1, text: '<span class="badge-ok">✓</span> Planta valida lote: <b>Pastilla de cloro OK</b> · Ozono 0.4 ppm' },
      { node: 2, text: '<span class="badge-ok">✓</span> Optimizador 2-Opt: asignado a <b>Camión 2 (Zona Norte)</b>' },
      { node: 0, text: 'Cliente recibe aviso proactivo por WhatsApp: <b>Camión a 450 metros</b>' },
      { node: 2, text: '<span class="badge-ok">✓</span> Entrega confirmada en calle y cobro con <b>QR Mercado Pago</b>' },
      { node: 3, text: '<span class="badge-ok">✓</span> Envases recuperados, stock al día y <b>factura AFIP emitida</b>' }
    ];
  }

  /**
   * Initializes the simulator, sets up SVG wire geometry and starts the cycle.
   */
  init() {
    if (!this.container || !this.wire || !this.log) return;

    this.drawWire();
    window.addEventListener('resize', () => this.drawWire());

    // Populate initial lines
    for (let i = 0; i < 3; i++) {
      this.tick();
    }

    this.start();
  }

  /**
   * Draws the SVG wire connecting all 4 operational nodes.
   */
  drawWire() {
    if (!this.container || !this.wire) return;
    const nodes = this.container.querySelectorAll('.flow-node');
    if (!nodes.length) return;

    const r = this.container.getBoundingClientRect();
    const pts = Array.from(nodes).map((n) => {
      const b = n.getBoundingClientRect();
      return [
        Math.round(b.left - r.left + b.width / 2),
        Math.round(b.top - r.top + b.height / 2)
      ];
    });

    this.wire.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    const polylinePts = pts.map((p) => p.join(',')).join(' ');

    this.wire.innerHTML = `
      <defs>
        <linearGradient id="aquaWireGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#00C2FF" />
          <stop offset="100%" stop-color="#0072FF" />
        </linearGradient>
      </defs>
      <polyline points="${polylinePts}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="2" />
      <polyline class="wire-pulse" points="${polylinePts}" fill="none" stroke="url(#aquaWireGrad)" stroke-width="3" stroke-linecap="round" stroke-dasharray="80 1200" />
    `;
  }

  /**
   * Advances the simulation by one operational step.
   */
  tick() {
    const current = this.events[this.stepIndex % this.events.length];
    const nodes = this.container?.querySelectorAll('.flow-node') || [];

    // Highlight active node
    nodes.forEach((node, idx) => {
      if (idx === current.node) {
        node.classList.add('node-active');
      } else {
        node.classList.remove('node-active');
      }
    });

    // Add entry to streaming log
    if (this.log) {
      const line = typeof document !== 'undefined'
        ? document.createElement('div')
        : { className: '', innerHTML: '' };
      line.className = 'log-item';
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8);
      line.innerHTML = `<time>${timeStr}</time><span>${current.text}</span>`;
      this.log.appendChild(line);

      while (this.log.children.length > 5) {
        if (typeof this.log.firstChild?.remove === 'function') {
          this.log.firstChild.remove();
        } else {
          this.log.children.shift();
        }
      }
    }

    this.stepIndex++;
  }

  /**
   * Starts automatic execution loop.
   */
  start() {
    this.stop();
    this.intervalId = setInterval(() => this.tick(), this.intervalMs);
  }

  /**
   * Stops execution loop.
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
