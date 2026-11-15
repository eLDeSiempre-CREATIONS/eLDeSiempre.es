import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';

export const generarPayload = () => {
  const tipo = $('#payload-tipo').value;
  const result = $('#payload-result');
  let payload = '';
  if (tipo === 'xss') payload = `<script>alert(1)</script>`;
  else if (tipo === 'sqli') payload = `' OR '1'='1' -- -`;
  else if (tipo === 'lfi') payload = `../../../../etc/passwd`;
  result.textContent = payload;
  result.style.color = 'var(--neon-green)';
};

export const abrirCanarytoken = (tipo) => {
  window.open('https://canarytokens.org/generate', '_blank');
};

export const buscarCVE = async () => {
  const query = $('#cve-input').value.trim();
  const result = $('#cve-result');
  if (!query) return mostrarToast("Introduce un término", "error");
  result.innerHTML = 'Buscando...';
  try {
    const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.vulnerabilities && data.vulnerabilities.length > 0) {
      result.innerHTML = data.vulnerabilities.slice(0, 3).map(v => `<div><strong style="color:var(--danger)">${v.cve.id}</strong><br>${v.cve.descriptions.find(d => d.lang === 'en')?.value.substring(0, 80)}...</div>`).join('<hr>');
      result.style.color = 'var(--text-main)';
    } else { result.innerHTML = 'No encontrado.'; result.style.color = 'var(--neon-gold)'; }
  } catch { result.innerHTML = 'Error.'; result.style.color = 'var(--danger)'; }
};
