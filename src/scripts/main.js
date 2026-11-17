import { FlowSimulator } from './flow-simulator.js';
import { ROICalculator } from './roi-calculator.js';
import { Sanitizer } from '../utils/sanitizer.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Flow Simulator (Glidex Wire Reverse Engineered)
  const simulator = new FlowSimulator({
    containerSelector: '#flow-container',
    wireSelector: '#wire-svg',
    logSelector: '#flow-log',
    intervalMs: 2400
  });
  simulator.init();

  // 2. Initialize ROI Calculator
  const sliderBottles = document.getElementById('slider-bottles');
  const sliderTrucks = document.getElementById('slider-trucks');
  const labelBottles = document.getElementById('label-bottles');
  const labelTrucks = document.getElementById('label-trucks');

  const metricMonthly = document.getElementById('metric-monthly');
  const metricBottles = document.getElementById('metric-bottles');
  const metricKm = document.getElementById('metric-km');
  const metricHours = document.getElementById('metric-hours');

  function updateROI() {
    const dailyBottles = Number(sliderBottles?.value) || 500;
    const trucks = Number(sliderTrucks?.value) || 3;

    if (labelBottles) labelBottles.textContent = String(dailyBottles);
    if (labelTrucks) labelTrucks.textContent = String(trucks);

    const result = ROICalculator.calculate({ dailyBottles, trucks });

    if (metricMonthly) metricMonthly.textContent = result.formatted.totalMonthly;
    if (metricBottles) metricBottles.textContent = result.formatted.bottlesSavedCount;
    if (metricKm) metricKm.textContent = result.formatted.kmSavedCount;
    if (metricHours) metricHours.textContent = result.formatted.hoursSavedCount;
  }

  sliderBottles?.addEventListener('input', updateROI);
  sliderTrucks?.addEventListener('input', updateROI);
  updateROI();

  // 3. Initialize FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((f) => f.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // 4. Lead Capture Form Submission (Direct to WhatsApp)
  const leadForm = document.getElementById('lead-form');
  const formFeedback = document.getElementById('form-feedback');

  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const companyInput = document.getElementById('lead-company');
    const cityInput = document.getElementById('lead-city');
    const phoneInput = document.getElementById('lead-phone');
    const trucksInput = document.getElementById('lead-trucks');

    const name = Sanitizer.escapeHTML(nameInput?.value.trim());
    const company = Sanitizer.escapeHTML(companyInput?.value.trim());
    const city = Sanitizer.escapeHTML(cityInput?.value.trim());
    const phone = Sanitizer.escapeHTML(phoneInput?.value.trim());
    const trucks = Sanitizer.escapeHTML(trucksInput?.value.trim());

    if (!name || !company || !phone) {
      if (formFeedback) formFeedback.textContent = 'Por favor complete los campos obligatorios.';
      return;
    }

    const leadData = {
      name,
      company,
      city,
      phone,
      trucks,
      timestamp: Date.now()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('aqua_leads') || '[]');
      existing.push(leadData);
      localStorage.setItem('aqua_leads', JSON.stringify(existing));
    } catch {}

    const message = encodeURIComponent(
      `¡Hola equipo de AQUA 2026! 👋\n` +
      `Mi nombre es ${name} de la embotelladora "${company}" (${city}).\n` +
      `Contamos con ${trucks} camiones de reparto y me gustaría coordinar una demostración en vivo del sistema.`
    );

    const waURL = Sanitizer.sanitizeURL(`https://wa.me/5493515937318?text=${message}`);

    if (formFeedback) {
      formFeedback.textContent = '¡Redirigiendo a WhatsApp oficial...';
    }

    setTimeout(() => {
      window.open(waURL, '_blank');
    }, 400);
  });

  // 5. Register Service Worker (PWA Ready)
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration bypassed:', err?.message);
      });
    });
  }
});
