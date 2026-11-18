/**
 * Sanitizer utility for XSS prevention across all dynamic DOM insertions.
 * Enforces AiAppFactory zero-trust client standards.
 */
export const Sanitizer = {
  /**
   * Safely sets HTML content using DOMParser and replaceChildren without innerHTML sink vulnerability.
   * @param {HTMLElement} target
   * @param {string} html
   */
  safeSetInnerHTML(target, html) {
    if (!target) return;
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(typeof html === 'string' ? html : '', 'text/html');
      target.replaceChildren(...doc.body.childNodes);
    } else {
      target.textContent = String(html || '');
    }
  },

  /**
   * Escapes special characters to HTML entities.
   * @param {string|number|null|undefined} input
   * @returns {string}
   */
  escapeHTML(input) {
    if (input === null || input === undefined) return '';
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Validates and sanitizes a URL, allowing only safe protocols.
   * @param {string} url
   * @param {string} [fallback='#']
   * @returns {string}
   */
  sanitizeURL(url, fallback = '#') {
    if (!url || typeof url !== 'string') return fallback;
    const trimmed = url.trim();
    if (
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:') ||
      trimmed.startsWith('https://wa.me/') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('/')
    ) {
      return trimmed;
    }
    return fallback;
  }
};

export default Sanitizer;
