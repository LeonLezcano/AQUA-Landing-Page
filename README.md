# 💧 AQUA 2026 — Landing Page Oficial

> **Plataforma Enterprise Integral para Embotelladoras de Agua, Sifonerías y Dispensers Frío-Calor.**  
> Landing page comercial de alta conversión diseñada para captación B2B de plantas embotelladoras, fábricas de soda y distribuidoras con flota propia.

---

## 🚀 Arquitectura y Tecnologías
- **Stack:** Vite 5 + Vanilla JavaScript (ESM) + Modern CSS Glassmorphism.
- **PWA & Offline:** Service Worker (`sw.js`) con caché atómica versionada (`aqua-landing-cache-vX.Y.ZZ`), anti-stale headers y manifest PWA instalable.
- **Simulador Interactivo en Tiempo Real:** Wire dinámico SVG con gradiente cyan-blue pulsante y streaming log operativo de eventos de planta (`Cliente` $\to$ `Planta & Calidad` $\to$ `Logística` $\to$ `Facturación AFIP`).
- **Calculadora Interactiva de ROI:** Estimación dinámica de ahorro en combustible (TSP 2-Opt), reducción de horas administrativas y prevención de fuga de bidones retornables.
- **Arnés de Pruebas Multi-Capa (66 Tests en 5 Capas):**
  - Capa 1: Unitarias & Fuzzing (`sanitizer.test.js`, `roi_calculator.test.js`).
  - Capa 2: Integración & Estado (`flow_simulator.test.js`, `lead_capture.test.js`).
  - Capa 3: Componentes & DOM (`dom_components.test.js`).
  - Capa 4: Seguridad & Cabeceras CSP (`security_headers.test.js`).
  - Capa 5: E2E Funnel de Conversión (`e2e_lead_flow.test.js`).
- **Seguridad:** AppSec Guardian con 0 vulnerabilidades críticas, CSP estricta y neutralización XSS.

---

## 🛠️ Comandos de Desarrollo (Exclusivo PNPM)

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor local
pnpm run dev

# Ejecutar suite de pruebas (5 capas)
pnpm test

# Ejecutar auditoría de seguridad
pnpm run security:full

# Compilar para producción
pnpm run build

# Incrementar versión (esquema vX.Y.ZZ)
pnpm run version:bump
```

---

## 🌐 Ecosistema de Repositorios Relacionados
- [`Aqua`](https://github.com/LeonLezcano/Aqua): Software SaaS Multi-Tenant central con todas las funciones, `superadmin` y motores de planta.
- [`Dispen`](https://github.com/LeonLezcano/Dispen): Versión Enterprise Single-Tenant para venta directa y adaptación a medida.
- [`Regondi`](https://github.com/LeonLezcano/Regondi): Sistema de piso de planta industrial de embotellado (Neuquén/Ballerini).
- [`AQUA-Landing-Page`](https://github.com/LeonLezcano/AQUA-Landing-Page): Esta landing page comercial.
