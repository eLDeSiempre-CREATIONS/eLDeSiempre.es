import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { abrirModal } from '../core/modal.js';
import { $, escapeHTML } from '../core/dom.js';
import { loadCategoryTree } from '../data/categories.js';
import { estructuraHerramientas } from '../data/tools-registry.js';
import { NAV_ITEMS } from '../data/navigation.js';

let guidePromise = null;
let categoryIndexPromise = null;

function buildStaticIndex() {
  const index = [];

  NAV_ITEMS.forEach((item) => {
    index.push({ title: item.label, type: 'Sección', description: item.description, url: item.href });
  });

  Object.entries(estructuraHerramientas).forEach(([cat, data]) => {
    data.herramientas.forEach((tool) => {
      index.push({
        title: tool.titulo,
        type: `Herramienta · ${data.titulo}`,
        description: tool.desc,
        url: `herramientas.html?cat=${encodeURIComponent(cat)}&tool=${encodeURIComponent(tool.id)}`,
      });
    });
  });

  return index;
}

function loadCategoryIndex() {
  if (!categoryIndexPromise) {
    categoryIndexPromise = loadCategoryTree()
      .then((categories) => categories.flatMap((category) => [
        {
          title: category.nombre,
          type: 'Directorio',
          description: category.descripcion,
          url: `biblioteca.html?tipo=recursos&cat=${encodeURIComponent(category.slug)}`,
        },
        ...category.children.map((child) => ({
          title: child.nombre,
          type: `Directorio · ${category.nombre}`,
          description: child.descripcion,
          url: `biblioteca.html?tipo=recursos&cat=${encodeURIComponent(category.slug)}&subcat=${encodeURIComponent(child.slug)}`,
        })),
      ]))
      .catch((error) => {
        console.error('No se pudieron cargar las categorías para la búsqueda:', error);
        return [];
      });
  }

  return categoryIndexPromise;
}

function loadGuides() {
  if (!guidePromise) {
    guidePromise = http.get(CONFIG.ENDPOINTS.obtenerGuias, { timeout: 6000 })
      .then((result) => {
        const data = Array.isArray(result.data) ? result.data : [];
        return data.map((guia) => ({
          title: guia.titulo,
          type: 'Guía',
          description: guia.nivel || '',
          url: `guia.html?id=${encodeURIComponent(guia.slug)}`,
        }));
      })
      .catch(() => []);
  }
  return guidePromise;
}

function renderResults(results, query) {
  const container = $('#global-search-results');
  if (!container) return;

  if (!results.length) {
    container.innerHTML = `<p class="search-empty">No se encontraron resultados para “${escapeHTML(query)}”.</p>`;
    return;
  }

  container.innerHTML = results.slice(0, 20).map((item) => `
    <a class="search-result" href="${item.url}" data-close-modal="modal-global-search">
      <span class="search-result-title">${escapeHTML(item.title)}</span>
      <span class="search-result-type">${escapeHTML(item.type)}</span>
      <span class="search-result-desc">${escapeHTML(item.description || '')}</span>
    </a>
  `).join('');
}

export function initGlobalSearch() {
  const modal = $('#modal-global-search');
  if (!modal) return;

  const input = $('#global-search-input');
  const open = () => {
    abrirModal('modal-global-search');
    if (input) {
      input.value = '';
      input.focus();
    }
  };

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      open();
    }
  });

  const trigger = $('#nav-search-btn');
  if (trigger) trigger.addEventListener('click', open);

  if (!input) return;
  const staticIndex = buildStaticIndex();
  let sequence = 0;

  input.addEventListener('input', async (e) => {
    const query = String(e.target.value || '').trim();
    const current = ++sequence;

    if (query.length < 2) {
      const results = $('#global-search-results');
      if (results) results.innerHTML = '<p class="search-hint">Escribe al menos 2 letras...</p>';
      return;
    }

    const [guides, categories] = await Promise.all([loadGuides(), loadCategoryIndex()]);
    if (current !== sequence) return;

    const normalized = query.toLowerCase();
    const all = [...staticIndex, ...categories, ...guides];
    const filtered = all.filter((item) => (
      item.title.toLowerCase().includes(normalized)
      || item.description.toLowerCase().includes(normalized)
      || item.type.toLowerCase().includes(normalized)
    ));

    filtered.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(normalized) ? 0 : 1;
      const bStarts = b.title.toLowerCase().startsWith(normalized) ? 0 : 1;
      return aStarts - bStarts || a.title.localeCompare(b.title, 'es');
    });

    renderResults(filtered, query);
  });
}
