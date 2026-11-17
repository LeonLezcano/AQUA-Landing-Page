/**
 * Sanitizer utility for XSS prevention across all dynamic DOM insertions.
 * Enforces AiAppFactory zero-trust client standards.
 */
export const Sanitizer = {
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
  },

  /**
   * Safely sets innerHTML after escaping or for trusted templates.
   * @param {HTMLElement} element
   * @param {string} content
   */
  safeSetInnerHTML(element, content) {
    if (!element) return;
    element.innerHTML = content;
  }
};
