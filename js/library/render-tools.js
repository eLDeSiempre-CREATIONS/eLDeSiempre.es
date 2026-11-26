import { estructuraHerramientas } from '../data/tools-registry.js';
import { buildTerminalRoute } from '../data/navigation.js';
import { escapeHTML, safeUrl } from '../core/dom.js';
import { bindTextFilter } from './filter.js';
import { toolCardsHTML } from './tool-cards.js';

function terminalWindow(prompt, body) {
  return `
    <div class="terminal-container">
      <div class="terminal-header">
        <span class="terminal-dot dot-red"></span>
        <span class="terminal-dot dot-yellow"></span>
        <span class="terminal-dot dot-green"></span>
      </div>
      <div class="terminal-prompt">root@eldesiempre:/herramientas# <span>${prompt}</span></div>
      ${body}
    </div>
  `;
}

function webResourceCardsHTML(resources) {
  return resources.map((resource) => {
    const url = safeUrl(resource.url);
    if (url === '#') return '';
    return `
      <a class="card tool-card external-resource-card" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer nofollow"
        data-search="${escapeHTML(`${resource.titulo} ${resource.desc}`.toLowerCase())}">
        <span class="tool-card-cat">Servicio externo</span>
        <h3>${escapeHTML(resource.titulo)}</h3>
        <p>${escapeHTML(resource.desc)}</p>
        <span class="guia-cta">Abrir sitio externo ↗</span>
      </a>
    `;
  }).join('');
}

export function renderToolsHome(contenedor) {
  if (!contenedor) return;

  const categories = Object.entries(estructuraHerramientas).map(([slug, data]) => `
    <a href="herramientas.html?cat=${encodeURIComponent(slug)}" class="folder">
      <div class="folder-icon">${data.icon}</div>
      <h3>${escapeHTML(data.titulo)}</h3>
      <p>${escapeHTML(data.desc)}</p>
      <span class="folder-badge">${data.herramientas.length} herramientas</span>
    </a>
  `).join('');

  contenedor.innerHTML = terminalWindow('ls ./laboratorio', `
    <p class="section-kicker">DIRECTORIO <span>/</span> HERRAMIENTAS</p>
    <h2 class="terminal-title">Herramientas técnicas</h2>
    <p class="terminal-intro">Utilidades para explorar conceptos y realizar tareas técnicas desde el navegador. Revisa cada herramienta y úsala únicamente en sistemas y entornos autorizados.</p>
    <div class="folder-grid">${categories}</div>
  `);
}

export function renderToolsCategory(contenedor, categoriaActual) {
  if (!contenedor) return;

  const dataCat = estructuraHerramientas[categoriaActual];
  if (!dataCat) {
    contenedor.innerHTML = `
      <a class="btn-back" href="herramientas.html">← cd ..</a>
      <p class="empty-state">[!] Categoría de herramientas no encontrada.</p>
    `;
    return;
  }

  const route = buildTerminalRoute('herramientas');
  const backUrl = route.parent || 'herramientas.html';

  contenedor.innerHTML = `
    <a class="btn-back" href="${backUrl}">← cd ..</a>
    ${terminalWindow(`ls ./${escapeHTML(categoriaActual)}`, `
      <div class="category-header">
        <h2 class="terminal-title">${dataCat.icon} ${escapeHTML(dataCat.titulo)}</h2>
        <p class="terminal-intro">${escapeHTML(dataCat.desc)}</p>
      </div>
      <input type="text" id="buscador-herramientas" class="tool-input" placeholder="grep 'herramienta'..." aria-label="Filtrar herramientas">
      <div class="grid-cards" id="lista-herramientas">${toolCardsHTML(categoriaActual)}${webResourceCardsHTML(dataCat.recursosWeb || [])}</div>
    `)}
  `;

  const input = contenedor.querySelector('#buscador-herramientas');
  bindTextFilter(input, () => Array.from(contenedor.querySelectorAll('#lista-herramientas .tool-card')));
}
