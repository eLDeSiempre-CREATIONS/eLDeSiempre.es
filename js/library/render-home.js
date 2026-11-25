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
    <div class="folder-grid">
      <a class="folder" href="biblioteca.html">
        <div class="folder-icon">📚</div>
        <h3>Biblioteca</h3>
        <p>Recursos, plataformas, certificaciones y documentación organizados por especialidad.</p>
        <span class="folder-badge">Directorio privado</span>
      </a>
      <a class="folder" href="herramientas.html" style="border-color: var(--neon-green);">
        <div class="folder-icon">🧰</div>
        <h3>Herramientas</h3>
        <p>${toolCount()} utilidades interactivas de OSINT, redes, criptografía y análisis.</p>
        <span class="folder-badge" style="background: var(--neon-green); color: var(--bg-color);">Laboratorio público</span>
      </a>
      <a class="folder" href="rutas.html">
        <div class="folder-icon">🎓</div>
        <h3>Rutas de aprendizaje</h3>
        <p>Empieza por los fundamentos y continúa por programación, sistemas, hardware, redes o ensamblador.</p>
        <span class="folder-badge">Progreso por cuenta</span>
      </a>
      <a class="folder" href="biblioteca.html?tipo=cve">
        <div class="folder-icon">🚨</div>
        <h3>CVE en tiempo real</h3>
        <p>Últimas vulnerabilidades publicadas y enlaces a la documentación oficial.</p>
        <span class="folder-badge">Requiere login</span>
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
