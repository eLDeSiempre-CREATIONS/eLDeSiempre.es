import { mostrarToast } from '../core/toast.js';
import { $, escapeHTML } from '../core/dom.js';

export const generarPayload = () => {
  const tipo = $('#payload-tipo')?.value || 'xss';
  const result = $('#payload-result');
  if (!result) return;

  const payloads = {
    xss: '<script>alert(1)</script>',
    sqli: "' OR '1'='1' -- -",
    lfi: '../../../../etc/passwd',
  };

  result.textContent = payloads[tipo] || '';
  result.style.color = 'var(--neon-green)';
};

export const abrirCanarytoken = () => {
  window.open('https://canarytokens.org/generate', '_blank', 'noopener,noreferrer');
};

export const buscarCVE = async () => {
  const query = $('#cve-input')?.value.trim() || '';
  const result = $('#cve-result');
  if (!result) return;
  if (!query) return mostrarToast('Introduce un término', 'error');

  result.textContent = 'Buscando...';
  try {
    const response = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(query)}`);
    const data = await response.json();
    const vulnerabilities = Array.isArray(data.vulnerabilities) ? data.vulnerabilities.slice(0, 3) : [];

    if (vulnerabilities.length) {
      result.innerHTML = vulnerabilities.map((item) => {
        const cve = item.cve || {};
        const description = Array.isArray(cve.descriptions)
          ? cve.descriptions.find((entry) => entry.lang === 'en')?.value || ''
          : '';
        return `<div><strong class="cve-id">${escapeHTML(cve.id || 'CVE')}</strong><br>${escapeHTML(description.slice(0, 120))}...</div>`;
      }).join('<hr>');
      result.style.color = 'var(--text-main)';
    } else {
      result.textContent = 'No encontrado.';
      result.style.color = 'var(--neon-gold)';
    }
  } catch {
    result.textContent = 'Error.';
    result.style.color = 'var(--danger)';
  }
};
