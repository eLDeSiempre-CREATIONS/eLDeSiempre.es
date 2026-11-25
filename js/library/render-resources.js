import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { loadCategoryTree } from '../data/categories.js';
import { estructuraHerramientas } from '../data/tools-registry.js';
import { getBadgeClass } from '../core/badges.js';
import { escapeHTML, safeUrl } from '../core/dom.js';
import { sanitizeHTML } from '../core/sanitize.js';
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
      <div class="terminal-prompt">root@eldesiempre:/biblioteca# <span>${prompt}</span></div>
      ${body}
    </div>
  `;
}

function backLink(href, text) {
  return `<a class="btn-back" href="${href}"><span aria-hidden="true">←</span> ${text}</a>`;
}

function toolGroupsForCategory(categorySlug, rootSlug) {
  return Object.entries(estructuraHerramientas)
    .filter(([, group]) => group.categorySlug === categorySlug && group.ramaSlug === rootSlug);
}

function renderDirectoryItem(category, rootSlug) {
  const count = Number(category.total_recursos) || 0;
  return `
    <li class="dir-item">
      <a href="biblioteca.html?tipo=recursos&cat=${encodeURIComponent(rootSlug)}&subcat=${encodeURIComponent(category.slug)}" class="dir-link">${escapeHTML(category.nombre)}/</a>
      <span class="dir-desc">${escapeHTML(category.descripcion || `${count} recursos`)}</span>
    </li>
  `;
}

export async function renderResourcesHome(contenedor) {
  if (!contenedor) return;

  const tools = Object.values(estructuraHerramientas);
  const toolTotal = tools.reduce((total, group) => total + group.herramientas.length, 0);
  contenedor.innerHTML = '<p class="loading-line">[+] Cargando categorías del directorio...</p>';

  try {
    const categories = await loadCategoryTree();
    const folders = categories.map((category) => `
      <a href="biblioteca.html?tipo=recursos&cat=${encodeURIComponent(category.slug)}" class="folder">
        <div class="folder-icon">${escapeHTML(category.icono || '📁')}</div>
        <h3>${escapeHTML(category.nombre)}</h3>
        <p>${escapeHTML(category.descripcion || '')}</p>
        <span class="folder-badge">${category.children.length} subdirectorios</span>
      </a>
    `).join('');

    contenedor.innerHTML = `
      ${terminalWindow('ls -la ./directorio', `
        <h2 class="terminal-title">Directorio de Recursos</h2>
        <p class="terminal-intro">Explora la base de conocimiento. Selecciona una categoría:</p>
        <div class="folder-grid">${folders}</div>
        <div class="folder-grid" style="margin-top: 20px;">
          <a href="herramientas.html" class="folder" style="border-color: var(--neon-green);">
            <div class="folder-icon">🧰</div>
            <h3>Laboratorio de Herramientas</h3>
            <p>${toolTotal} utilidades interactivas, públicas y sin instalación.</p>
            <span class="folder-badge" style="background: var(--neon-green); color: var(--bg-color);">Abrir laboratorio</span>
          </a>
          <a href="biblioteca.html?tipo=cve" class="folder" style="border-color: var(--neon-gold);">
            <div class="folder-icon">🚨</div>
            <h3>CVE en Tiempo Real</h3>
            <p>Últimas vulnerabilidades y publicaciones oficiales de seguridad.</p>
            <span class="folder-badge" style="background: var(--neon-gold); color: var(--bg-color);">Ver alertas</span>
          </a>
        </div>
      `)}
    `;
  } catch (error) {
    contenedor.innerHTML = `<p class="empty-state">[!] No se pudieron cargar las categorías: ${escapeHTML(error.message)}</p>`;
  }
}

function renderCategoryDirectory(container, category) {
  const children = category.children.map((child) => renderDirectoryItem(child, category.slug));
  const emptyState = children.length
    ? ''
    : '<li class="empty-state">[!] Esta categoría todavía no tiene subdirectorios.</li>';

  container.innerHTML = `
    ${backLink('biblioteca.html?tipo=recursos', 'cd ../directorio')}
    ${terminalWindow(`cat ${encodeURIComponent(category.slug)}.txt`, `
      <h2 class="terminal-title">${escapeHTML(category.icono || '📁')} ${escapeHTML(category.nombre)}</h2>
      <p class="terminal-intro">${escapeHTML(category.descripcion || '')}</p>
      <p class="dir-hint">Selecciona un subdirectorio:</p>
      <ul class="dir-tree">${children.join('')}${emptyState}</ul>
    `)}
  `;
}

function renderFlipperContent(container, category, root) {
  container.innerHTML = `
    ${backLink(`biblioteca.html?tipo=recursos&cat=${encodeURIComponent(root.slug)}`, 'cd ..')}
    ${terminalWindow(`ls ./${encodeURIComponent(category.slug)}`, `
      <h2 class="terminal-title">${escapeHTML(category.icono || '🐬')} ${escapeHTML(category.nombre)}</h2>
      <p class="terminal-intro">${escapeHTML(category.descripcion || '')}</p>
      <div class="flipper-tree">
        <div>📁 payload/</div>
        <div class="flipper-branch">├── 📁 ascii/ <span>(ASCII art)</span></div>
        <div class="flipper-branch">├── 📁 pranks-win/ <span>(Pranks Windows)</span></div>
        <div class="flipper-branch">├── 📁 pranks-mac/ <span>(Pranks macOS)</span></div>
        <div class="flipper-branch">├── 📁 goodusb-mac/ <span>(Utilidades macOS)</span></div>
        <div class="flipper-branch">├── 📁 recon-local-mac/ <span>(Recon local macOS)</span></div>
        <div class="flipper-branch">└── 📁 chromeos/ <span>(ChromeOS)</span></div>
      </div>
      <p class="terminal-note">Usa estos payloads únicamente en dispositivos propios o con autorización. Instrucciones completas en el <a href="FlipperZero/payload/README.md">README del payload</a>.</p>
    `)}
  `;
}

function renderResourceItems(resources, votes) {
  return resources.map((resource) => {
    const badge = resource.tipo
      ? `<span class="badge ${getBadgeClass(resource.tipo)}">${escapeHTML(resource.tipo)}</span>`
      : '';
    const voted = votes.includes(Number(resource.id));
    const url = safeUrl(resource.url);
    const link = url !== '#'
      ? `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow" class="btn-link">[Ir al recurso]</a>`
      : '<span class="btn-link is-disabled">[Enlace no disponible]</span>';
    const stepByStep = sanitizeHTML(resource.paso_a_paso || '');

    return `
      <li class="resource-item" data-search="${escapeHTML(`${resource.titulo} ${resource.descripcion || ''} ${resource.tipo || ''}`.toLowerCase())}">
        <div class="resource-header">
          <span class="resource-title">&gt; ${escapeHTML(resource.titulo)}</span>
          ${badge}
        </div>
        <div class="resource-desc">${escapeHTML(resource.descripcion || '')}</div>
        <div class="resource-details">
          <p class="resource-ideal"><strong>Ideal para:</strong> ${escapeHTML(resource.ideal_para || 'Aprender y practicar')}</p>
          ${stepByStep || '<p>Consulta la documentación oficial del recurso para empezar.</p>'}
        </div>
        <div class="resource-actions">
          ${link}
          <button class="btn-voto ${voted ? 'votado' : ''}" type="button" data-vote-id="${Number(resource.id)}" aria-pressed="${voted ? 'true' : 'false'}">⭐ <span>${Number(resource.votos) || 0}</span></button>
        </div>
      </li>
    `;
  }).join('');
}

function renderExternalTools(resources) {
  const cards = resources.map((resource) => {
    const url = safeUrl(resource.url);
    if (url === '#') return '';
    return `
      <a class="card external-resource-card" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer nofollow">
        <span class="tool-card-cat">Servicio externo</span>
        <h4>${escapeHTML(resource.titulo)}</h4>
        <p>${escapeHTML(resource.desc)}</p>
        <span class="guia-cta">Abrir sitio externo ↗</span>
      </a>
    `;
  }).join('');

  if (!cards) return '';
  return `
    <section class="home-section external-tools-section">
      <h3>Herramientas web externas</h3>
      <p class="terminal-note">Estos servicios son de terceros. Consulta sus políticas y no introduzcas datos privados; utiliza la información solo sobre sistemas propios o autorizados.</p>
      <div class="grid-cards">${cards}</div>
    </section>
  `;
}

async function renderCategoryContents(container, category, root) {
  const relatedTools = toolGroupsForCategory(category.slug, root.slug);
  const externalTools = relatedTools.flatMap(([, group]) => group.recursosWeb || []);
  container.innerHTML = `
    ${backLink(`biblioteca.html?tipo=recursos&cat=${encodeURIComponent(root.slug)}`, 'cd ..')}
    ${terminalWindow(`ls ./${encodeURIComponent(category.slug)}`, `
      <h2 class="terminal-title">${escapeHTML(category.icono || '📁')} ${escapeHTML(category.nombre)}</h2>
      <p class="terminal-intro">${escapeHTML(category.descripcion || '')}</p>
      <div id="recursos-panel"><p class="loading-line">[+] Buscando recursos en la base de datos...</p></div>
    `)}
  `;

  const panel = container.querySelector('#recursos-panel');
  let resources = [];
  let votes = [];
  let errorMessage = '';

  try {
    const result = await http.get(`${CONFIG.ENDPOINTS.obtenerRecursos}?slug=${encodeURIComponent(category.slug)}`);
    if (!result.success) {
      errorMessage = result.message || 'La API no pudo devolver los recursos.';
    } else {
      resources = Array.isArray(result.data) ? result.data : [];
      votes = Array.isArray(result.votos) ? result.votos.map(Number) : [];
    }
  } catch (error) {
    errorMessage = error.message;
  }

  const toolsHTML = relatedTools.map(([slug, group]) => `
    <section class="home-section">
      <h3>${escapeHTML(group.icon || '🧰')} ${escapeHTML(group.titulo)}</h3>
      <div class="grid-cards">${toolCardsHTML(slug)}</div>
    </section>
  `).join('');
  const externalToolsHTML = renderExternalTools(externalTools);

  const resourceHTML = resources.length
    ? `
      <input type="text" id="buscador-recursos" class="tool-input" placeholder="grep 'recurso'..." aria-label="Filtrar recursos">
      <ul class="resource-list" id="lista-recursos">${renderResourceItems(resources, votes)}</ul>
    `
    : '';
  const errorHTML = errorMessage
    ? `<p class="empty-state">[!] Error al cargar los recursos: ${escapeHTML(errorMessage)}</p>`
    : '';
  const emptyHTML = !resources.length && !relatedTools.length && !externalTools.length && !errorMessage
    ? '<p class="empty-state">[!] No hay recursos publicados en este directorio.</p>'
    : '';

  panel.innerHTML = `${errorHTML}${resourceHTML}${toolsHTML}${externalToolsHTML}${emptyHTML}`;

  const input = panel.querySelector('#buscador-recursos');
  if (input) {
    bindTextFilter(input, () => Array.from(panel.querySelectorAll('#lista-recursos .resource-item')));
  }
}

export async function renderResourcesCategory(contenedor, categoriaActual) {
  if (!contenedor) return;

  contenedor.innerHTML = '<p class="loading-line">[+] Cargando categoría...</p>';

  try {
    const categories = await loadCategoryTree();
    const params = new URLSearchParams(window.location.search);
    const subcategorySlug = params.get('subcat');
    const root = categories.find((category) => category.slug === categoriaActual);

    if (!root) {
      contenedor.innerHTML = `
        ${backLink('biblioteca.html?tipo=recursos', 'cd ../directorio')}
        <p class="empty-state">[!] Categoría no encontrada.</p>
      `;
      return;
    }

    if (!subcategorySlug) {
      renderCategoryDirectory(contenedor, root);
      return;
    }

    const category = root.children.find((child) => child.slug === subcategorySlug);
    if (!category) {
      contenedor.innerHTML = `
        ${backLink(`biblioteca.html?tipo=recursos&cat=${encodeURIComponent(root.slug)}`, 'cd ..')}
        <p class="empty-state">[!] Subcategoría no encontrada.</p>
      `;
      return;
    }

    if (category.slug === 'flipper-zero') {
      renderFlipperContent(contenedor, category, root);
      return;
    }

    await renderCategoryContents(contenedor, category, root);
  } catch (error) {
    contenedor.innerHTML = `<p class="empty-state">[!] No se pudo cargar la categoría: ${escapeHTML(error.message)}</p>`;
  }
}
