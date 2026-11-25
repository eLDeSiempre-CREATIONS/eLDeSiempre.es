import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $, $$, escapeHTML } from '../core/dom.js';
import { getLevelBadgeClass } from '../core/badges.js';
import { bindLevelFilter } from './filter.js';

export function normalizeLevel(nivel) {
  const value = String(nivel || '').toLowerCase();
  if (value.includes('principiante') || value.includes('fácil') || value.includes('facil') || value.includes('básico') || value.includes('basico')) {
    return 'principiante';
  }
  if (value.includes('medio') || value.includes('intermedio')) return 'intermedio';
  if (value.includes('difícil') || value.includes('dificil') || value.includes('experto') || value.includes('avanzado')) {
    return 'avanzado';
  }
  return 'otros';
}

function guideCard(guia) {
  const level = normalizeLevel(guia.nivel);
  const requiresLogin = Number(guia.requiere_login) === 1;
  return `
    <a class="card guia-item" href="guia.html?id=${encodeURIComponent(guia.slug)}" data-nivel="${level}">
      <span class="badge ${getLevelBadgeClass(guia.nivel)} guia-level">${escapeHTML(guia.nivel || 'Guía')}</span>
      <h3>${escapeHTML(guia.titulo)}</h3>
      <p>${requiresLogin ? 'Contenido protegido: inicia sesión para acceder.' : 'Contenido público. Empieza cuando quieras.'}</p>
      <span class="guia-cta">${requiresLogin ? 'Requiere login →' : 'Empezar →'}</span>
    </a>
  `;
}

export async function renderGuideList(container) {
  if (!container) return;

  container.innerHTML = '<p class="loading-line">[+] Cargando guías desde la API...</p>';

  try {
    const result = await http.get(CONFIG.ENDPOINTS.obtenerGuias);
    const guias = Array.isArray(result.data) ? result.data : [];

    if (!result.success || guias.length === 0) {
      container.innerHTML = '<p class="empty-state">[!] No hay guías publicadas todavía.</p>';
      return;
    }

    container.innerHTML = guias.map(guideCard).join('');
  } catch (error) {
    container.innerHTML = `<p class="empty-state">[!] No se pudieron cargar las guías: ${escapeHTML(error.message)}</p>`;
  }
}

export function initGuideFilters() {
  const buttons = $$('.filter-container [data-level]');
  const apply = bindLevelFilter(buttons, () => $$('#lista-guias .guia-item'));
  const current = buttons.find((button) => button.classList.contains('active-filter'));
  apply(current?.getAttribute('data-level') || 'todos');
}
