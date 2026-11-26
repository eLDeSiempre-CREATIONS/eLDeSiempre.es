import { estructuraHerramientas } from '../data/tools-registry.js';
import { escapeHTML } from '../core/dom.js';

const FEATURED = ['dorks', 'ip', 'hash', 'pass', 'exif', 'wifi'];

function findTool(id) {
  for (const [cat, data] of Object.entries(estructuraHerramientas)) {
    const tool = data.herramientas.find((item) => item.id === id);
    if (tool) return { ...tool, cat, catTitle: data.titulo };
  }
  return null;
}

function toolCount() {
  return Object.values(estructuraHerramientas).reduce((total, data) => total + data.herramientas.length, 0);
}

export function renderQuickAccess(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="folder-grid directory-shortcuts">
      <a class="folder directory-shortcut" href="biblioteca.html">
        <span class="directory-shortcut-index">01 / RECURSOS</span>
        <div class="folder-icon" aria-hidden="true">📚</div>
        <h3>Biblioteca técnica</h3>
        <p>Documentación, formación, referencias y herramientas externas por especialidad.</p>
        <span class="folder-badge">Explorar categorías <span aria-hidden="true">→</span></span>
      </a>
      <a class="folder directory-shortcut" href="index.html#rutas">
        <span class="directory-shortcut-index">02 / CONSULTA</span>
        <div class="folder-icon" aria-hidden="true">📖</div>
        <h3>Guías de referencia</h3>
        <p>Respuestas organizadas por tema para consultar conceptos y buenas prácticas.</p>
        <span class="folder-badge">Ver guías <span aria-hidden="true">→</span></span>
      </a>
      <a class="folder directory-shortcut" href="rutas.html">
        <span class="directory-shortcut-index">03 / APRENDIZAJE</span>
        <div class="folder-icon" aria-hidden="true">🎓</div>
        <h3>Rutas formativas</h3>
        <p>Itinerarios secuenciales para avanzar desde fundamentos hasta temas técnicos.</p>
        <span class="folder-badge">Elegir una ruta <span aria-hidden="true">→</span></span>
      </a>
      <a class="folder directory-shortcut" href="herramientas.html">
        <span class="directory-shortcut-index">04 / UTILIDADES</span>
        <div class="folder-icon" aria-hidden="true">🧰</div>
        <h3>Herramientas</h3>
        <p>${toolCount()} utilidades interactivas para tareas técnicas y aprendizaje.</p>
        <span class="folder-badge">Abrir laboratorio <span aria-hidden="true">→</span></span>
      </a>
    </div>
  `;
}

export function renderFeaturedTools(container) {
  if (!container) return;
  const tools = FEATURED.map(findTool).filter(Boolean);

  container.innerHTML = `
    <div class="grid-cards">
      ${tools.map((tool) => `
        <a class="card tool-card" href="herramientas.html?cat=${encodeURIComponent(tool.cat)}&tool=${encodeURIComponent(tool.id)}">
          <span class="tool-card-cat">${escapeHTML(tool.catTitle)}</span>
          <h3>${escapeHTML(tool.titulo)}</h3>
          <p>${escapeHTML(tool.desc)}</p>
          <span class="guia-cta">Abrir herramienta →</span>
        </a>
      `).join('')}
    </div>
    <p class="section-more"><a class="btn-secondary" href="herramientas.html">Ver las ${toolCount()} herramientas</a></p>
  `;
}

export function renderHome(container) {
  if (!container) return;
  renderQuickAccess(container);
}
