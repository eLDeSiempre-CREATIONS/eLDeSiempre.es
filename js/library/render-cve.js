import { CONFIG } from '../core/config.js';
import { escapeHTML } from '../core/dom.js';

export function renderCVEHome(contenedor) {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="breadcrumb">
      <a href="biblioteca.html">Biblioteca</a> / <span>CVE en Tiempo Real</span>
    </div>
    <div class="category-header">
      <h2>🚨 Alertas de Vulnerabilidad</h2>
      <p>Últimas publicaciones oficiales de CVE (Common Vulnerabilities and Exposures).</p>
    </div>
    <div id="cve-lista" class="cve-list" aria-live="polite">
      <p class="loading-line">Cargando alertas...</p>
    </div>
  `;
  cargarCVE();
}

function readCache() {
  try {
    const cached = localStorage.getItem(CONFIG.STORAGE_KEYS.cveCache);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Array.isArray(parsed.data) && Date.now() - parsed.timestamp < CONFIG.CVE_CACHE_TTL) {
      return parsed.data;
    }
  } catch {
    return null;
  }
  return null;
}

async function cargarCVE() {
  const lista = document.getElementById('cve-lista');
  if (!lista) return;

  const cached = readCache();
  if (cached) {
    pintarCVE(lista, cached);
    return;
  }

  try {
    const response = await fetch('https://cve.circl.lu/api/last/20', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.cveCache, JSON.stringify({ data, timestamp: Date.now() }));
      } catch {}
      pintarCVE(lista, data);
    } else {
      lista.innerHTML = '<p class="empty-state">No hay alertas disponibles en este momento.</p>';
    }
  } catch {
    lista.innerHTML = '<p class="empty-state">[!] Error al cargar las alertas. Inténtalo más tarde.</p>';
  }
}

function pintarCVE(lista, data) {
  const items = data.map((cve) => {
    const id = String(cve.id || 'CVE-?');
    const desc = cve.summary
      ? `${String(cve.summary).slice(0, 200)}...`
      : 'Sin descripción disponible.';
    const fecha = cve.Published
      ? new Date(cve.Published).toLocaleDateString('es-ES')
      : 'Fecha desconocida';

    return `
      <div class="resource-item cve-item-row">
        <div class="resource-header">
          <span class="resource-title cve-id">${escapeHTML(id)}</span>
          <span class="badge badge-sistema">${escapeHTML(fecha)}</span>
        </div>
        <div class="resource-desc">${escapeHTML(desc)}</div>
        <div class="resource-actions">
          <a href="https://nvd.nist.gov/vuln/detail/${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer nofollow" class="btn-link">[Ver detalles en NVD]</a>
        </div>
      </div>
    `;
  }).join('');

  lista.innerHTML = items;
}
