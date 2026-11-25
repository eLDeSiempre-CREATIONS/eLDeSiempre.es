import { estructuraHerramientas } from '../data/tools-registry.js';
import { escapeHTML } from '../core/dom.js';

export function toolCardsHTML(catSlug, { base = 'herramientas.html' } = {}) {
  const data = estructuraHerramientas[catSlug];
  if (!data) return '<p class="empty-state">[!] Categoría de herramientas no encontrada.</p>';

  return data.herramientas.map((tool) => {
    const href = `${base}?cat=${encodeURIComponent(catSlug)}&tool=${encodeURIComponent(tool.id)}`;
    return `
      <a class="card tool-card" href="${href}" data-tool-id="${escapeHTML(tool.id)}" data-search="${escapeHTML(`${tool.titulo} ${tool.desc} ${tool.ideal || ''}`.toLowerCase())}">
        <span class="tool-card-cat">${escapeHTML(data.titulo)}</span>
        <h3>${escapeHTML(tool.titulo)}</h3>
        <p>${escapeHTML(tool.desc)}</p>
        <span class="tool-card-ideal">Ideal para: ${escapeHTML(tool.ideal || 'Aprender y practicar')}</span>
        <span class="guia-cta">Abrir herramienta →</span>
      </a>
    `;
  }).join('');
}

export function renderToolCards(container, catSlug) {
  if (!container) return;
  container.innerHTML = toolCardsHTML(catSlug);
}
