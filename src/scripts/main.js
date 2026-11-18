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

  // 2. Mobile Navigation Drawer & Hamburger Toggle
  const navToggle = document.getElementById('nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function setDrawerOpen(isOpen) {
    if (!mobileDrawer || !navToggle) return;
    if (isOpen) {
      mobileDrawer.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      document.body.style.overflow = '';
    }
  }

  navToggle?.addEventListener('click', () => {
    const isCurrentlyOpen = mobileDrawer?.classList.contains('active');
    setDrawerOpen(!isCurrentlyOpen);
  });

  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setDrawerOpen(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      setDrawerOpen(false);
    }
  });

  // 3. Initialize ROI Calculator
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

  // 4. Commercial Plan Selection connected to Lead Form
  const planButtons = document.querySelectorAll('.btn-plan-select');
  const leadPlanInput = document.getElementById('lead-plan');
  const selectedPlanBadge = document.getElementById('selected-plan-badge');
  const leadTrucks = document.getElementById('lead-trucks');

  planButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan') || 'Profesional';
      if (leadPlanInput) leadPlanInput.value = planName;
      if (selectedPlanBadge) {
        selectedPlanBadge.textContent = `Plan Seleccionado: ${planName}`;
      }

      // Pre-adjust recommended truck fleet for the selected plan
      if (leadTrucks) {
        if (planName === 'Starter') leadTrucks.value = '1';
        else if (planName === 'Profesional') leadTrucks.value = '2-3';
        else if (planName === 'Enterprise') leadTrucks.value = '7+';
      }
    });
  });

  // 5. Initialize Accessible FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((f) => {
        f.classList.remove('open');
        f.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 6. Lead Capture Form Submission (Direct to WhatsApp + Storage & Fallback)
  const leadForm = document.getElementById('lead-form');
  const formFeedback = document.getElementById('form-feedback');

  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('lead-name');
    const companyInput = document.getElementById('lead-company');
    const cityInput = document.getElementById('lead-city');
    const phoneInput = document.getElementById('lead-phone');
    const trucksInput = document.getElementById('lead-trucks');
    const planInput = document.getElementById('lead-plan');

    const name = Sanitizer.escapeHTML(nameInput?.value.trim());
    const company = Sanitizer.escapeHTML(companyInput?.value.trim());
    const city = Sanitizer.escapeHTML(cityInput?.value.trim());
    const rawPhone = phoneInput?.value.trim() || '';
    const phone = Sanitizer.escapeHTML(rawPhone);
    const trucks = Sanitizer.escapeHTML(trucksInput?.value.trim());
    const plan = Sanitizer.escapeHTML(planInput?.value.trim() || 'Profesional');

    // Validation
    if (!name || !company || !phone) {
      if (formFeedback) {
        formFeedback.textContent = 'Por favor complete todos los campos obligatorios.';
        formFeedback.style.color = '#F87171';
      }
      return;
    }

    // Phone digit length check (minimum 8 numbers)
    const phoneDigits = rawPhone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      if (formFeedback) {
        formFeedback.textContent = 'Por favor ingrese un número de teléfono válido (mínimo 8 dígitos).';
        formFeedback.style.color = '#F87171';
      }
      phoneInput?.focus();
      return;
    }

    const leadData = {
      name,
      company,
      city,
      phone,
      trucks,
      plan,
      timestamp: Date.now()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('aqua_leads') || '[]');
      existing.push(leadData);
      localStorage.setItem('aqua_leads', JSON.stringify(existing));
    } catch {}

    const message = encodeURIComponent(
      `¡Hola equipo de AQUA 2026!\n` +
      `Mi nombre es ${name} de la embotelladora "${company}" (${city}).\n` +
      `Contamos con ${trucks} camiones de reparto y me gustaría coordinar una demostración en vivo del sistema.\n` +
      `Plan de interés: ${plan}\n` +
      `WhatsApp de contacto: ${phone}`
    );

    const waURL = Sanitizer.sanitizeURL(`https://wa.me/5493515937318?text=${message}`);

    if (formFeedback) {
      while (formFeedback.firstChild) {
        formFeedback.removeChild(formFeedback.firstChild);
      }
      formFeedback.style.color = 'var(--accent-cyan)';

      const successNotice = document.createElement('div');
      successNotice.style.fontWeight = '700';
      successNotice.style.color = '#10B981';
      successNotice.textContent = '✓ ¡Solicitud registrada con éxito! Redirigiendo a WhatsApp oficial...! 🚀';
      formFeedback.appendChild(successNotice);

      const fallbackNotice = document.createElement('p');
      fallbackNotice.style.fontSize = '0.85rem';
      fallbackNotice.style.color = 'var(--text-muted)';
      fallbackNotice.style.marginTop = '0.4rem';
      fallbackNotice.textContent = 'Si la ventana de chat no se abrió automáticamente, hacé clic en el botón:';
      formFeedback.appendChild(fallbackNotice);

      const fallbackBtn = document.createElement('a');
      fallbackBtn.className = 'fallback-wa-btn';
      fallbackBtn.href = waURL;
      fallbackBtn.target = '_blank';
      fallbackBtn.rel = 'noopener noreferrer';
      fallbackBtn.textContent = 'Abrir WhatsApp Ahora 📲';
      formFeedback.appendChild(fallbackBtn);
    }

    setTimeout(() => {
      window.open(waURL, '_blank');
    }, 450);
  });

  // 7. Register Service Worker (PWA Ready)
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration bypassed:', err?.message);
      });
    });
  }
});
