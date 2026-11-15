import { CONFIG } from '../core/config.js';

export function renderCVEHome(contenedor) {
  let html = `
      <div class="breadcrumb">
          <a href="biblioteca.html">Biblioteca</a> / <span>CVE en Tiempo Real</span>
      </div>
      <div class="category-header">
          <h2>🚨 Alertas de Vulnerabilidad</h2>
          <p>Últimas publicaciones oficiales de CVE (Common Vulnerabilities and Exposures).</p>
      </div>
      <div id="cve-lista" style="display: flex; flex-direction: column; gap: 15px;">
          <p style="text-align: center; color: var(--text-muted);">Cargando alertas...</p>
      </div>
  `;
  contenedor.innerHTML = html;
  cargarCVE();
}

async function cargarCVE() {
  const lista = document.getElementById('cve-lista');
  if (!lista) return;

  const CACHE_KEY = CONFIG.STORAGE_KEYS.cveCache;
  const cached = localStorage.getItem(CACHE_KEY);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CONFIG.CVE_CACHE_TTL) {
      pintarCVE(lista, data);
      return;
    }
  }

  try {
    const response = await fetch('https://cve.circl.lu/api/last/20');
    const data = await response.json();

    if (data && data.length > 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
      pintarCVE(lista, data);
    } else {
      lista.innerHTML = `<p style="text-align: center; color: var(--text-muted);">No hay alertas disponibles en este momento.</p>`;
    }
  } catch (error) {
    lista.innerHTML = `<p style="text-align: center; color: var(--danger);">Error al cargar las alertas. Inténtalo más tarde.</p>`;
  }
}

function pintarCVE(lista, data) {
  let html = '';
  data.forEach(cve => {
      const desc = cve.summary ? cve.summary.substring(0, 200) + '...' : 'Sin descripción disponible.';
      const fecha = cve.Published ? new Date(cve.Published).toLocaleDateString() : 'Fecha desconocida';
      html += `
          <div class="resource-item" style="border-left: 4px solid var(--danger);">
              <div class="resource-header">
                  <span class="resource-title" style="color: var(--danger);">${cve.id}</span>
                  <span class="badge badge-sistema">${fecha}</span>
              </div>
              <div class="resource-desc">${desc}</div>
              <div class="resource-actions">
                  <a href="https://nvd.nist.gov/vuln/detail/${cve.id}" target="_blank" rel="noopener noreferrer" class="btn-link">[Ver detalles en NVD]</a>
              </div>
          </div>
      `;
  });
  lista.innerHTML = html;
}
