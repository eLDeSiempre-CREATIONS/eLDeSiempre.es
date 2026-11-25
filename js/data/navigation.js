export const NAV_ITEMS = Object.freeze([
  { id: 'inicio', label: 'Inicio', href: 'index.html', description: 'Portada y rutas de aprendizaje' },
  { id: 'rutas', label: 'Rutas', href: 'rutas.html', description: 'Rutas de aprendizaje secuenciales' },
  { id: 'biblioteca', label: 'Biblioteca', href: 'biblioteca.html', description: 'Directorio de recursos' },
  { id: 'herramientas', label: 'Herramientas', href: 'herramientas.html', description: 'Laboratorio interactivo' },
  { id: 'guias', label: 'Guías', href: 'index.html#rutas', description: 'Rutas y guías' },
  { id: 'contacto', label: 'Contacto', href: 'contacto.html', description: 'Contacto y soporte' },
]);

export const PAGE_CONFIG = Object.freeze({
  index: { nav: 'inicio', label: 'inicio', parent: null, command: 'pwd' },
  biblioteca: { nav: 'biblioteca', label: 'biblioteca', parent: 'index.html', command: 'ls' },
  herramientas: { nav: 'herramientas', label: 'herramientas', parent: 'index.html', command: 'ls' },
  rutas: { nav: 'rutas', label: 'rutas', parent: 'index.html', command: 'ls ./rutas' },
  guia: { nav: 'guias', label: 'guia', parent: 'index.html#rutas', command: 'cat guia.md' },
  contacto: { nav: 'contacto', label: 'contacto', parent: 'index.html', command: 'mail -s contacto' },
  login: { nav: null, label: 'login', parent: 'index.html', command: 'su -' },
  reset: { nav: null, label: 'reset', parent: 'index.html', command: 'passwd' },
  perfil: { nav: null, label: 'perfil', parent: 'index.html', command: 'whoami' },
  admin: { nav: null, label: 'admin', parent: 'index.html', command: 'sudo -i' },
});

const ROOT_SEGMENT = Object.freeze({ label: '/', href: 'index.html' });

function pageId() {
  const fromBody = document.body?.dataset?.page;
  if (fromBody && PAGE_CONFIG[fromBody]) return fromBody;
  const file = window.location.pathname.split('/').pop() || 'index.html';
  const name = file.replace(/\.html$/, '');
  return PAGE_CONFIG[name] ? name : 'index';
}

function segment(label, href) {
  return { label, href };
}

function bibliotecaRoute(params, config) {
  const tipo = params.get('tipo');
  const cat = params.get('cat');
  const subcat = params.get('subcat');
  const segments = [ROOT_SEGMENT, segment('biblioteca', 'biblioteca.html')];
  let cwd = '/biblioteca';

  if (tipo === 'herramientas') {
    segments.push(segment('herramientas', 'biblioteca.html?tipo=herramientas'));
    cwd += '/herramientas';
  } else if (tipo === 'recursos' || (!tipo && cat)) {
    segments.push(segment('recursos', 'biblioteca.html?tipo=recursos'));
    cwd += '/recursos';
  } else if (tipo === 'cve') {
    segments.push(segment('cve', 'biblioteca.html?tipo=cve'));
    cwd += '/cve';
  }

  if (cat) {
    const catBase = tipo === 'herramientas' ? 'herramientas' : 'recursos';
    const catHref = `biblioteca.html?tipo=${catBase}&cat=${encodeURIComponent(cat)}`;
    if (!segments.some((item) => item.href === catHref)) {
      segments.push(segment(cat, catHref));
    }
    cwd += `/${cat}`;
  }

  if (subcat) {
    const subHref = `biblioteca.html?tipo=recursos&cat=${encodeURIComponent(cat || '')}&subcat=${encodeURIComponent(subcat)}`;
    segments.push(segment(subcat, subHref));
    cwd += `/${subcat}`;
  }

  return {
    page: 'biblioteca',
    cwd,
    command: config.command,
    segments,
    parent: segments.length > 1 ? segments[segments.length - 2].href : config.parent,
  };
}

function herramientasRoute(params, config) {
  const cat = params.get('cat');
  const tool = params.get('tool');
  const segments = [ROOT_SEGMENT, segment('herramientas', 'herramientas.html')];
  let cwd = '/herramientas';

  if (cat) {
    segments.push(segment(cat, `herramientas.html?cat=${encodeURIComponent(cat)}`));
    cwd += `/${cat}`;
  }
  if (tool) {
    segments.push(segment(tool, `herramientas.html?cat=${encodeURIComponent(cat || '')}&tool=${encodeURIComponent(tool)}`));
    cwd += `/${tool}`;
  }

  return {
    page: 'herramientas',
    cwd,
    command: config.command,
    segments,
    parent: segments.length > 1 ? segments[segments.length - 2].href : config.parent,
  };
}

function guiaRoute(params, config) {
  const id = params.get('id');
  const segments = [
    ROOT_SEGMENT,
    segment('guias', 'index.html#rutas'),
    segment(id || 'guia', id ? `guia.html?id=${encodeURIComponent(id)}` : 'guia.html'),
  ];
  return {
    page: 'guia',
    cwd: id ? `/guias/${id}` : '/guias',
    command: config.command,
    segments,
    parent: config.parent,
  };
}

function rutasRoute(params, config) {
  const path = params.get('ruta');
  const lesson = params.get('leccion');
  const segments = [ROOT_SEGMENT, segment('rutas', 'rutas.html')];
  let cwd = '/rutas';

  if (path) {
    segments.push(segment(path, `rutas.html?ruta=${encodeURIComponent(path)}`));
    cwd += `/${path}`;
  }
  if (lesson) {
    segments.push(segment(lesson, `rutas.html?ruta=${encodeURIComponent(path || '')}&leccion=${encodeURIComponent(lesson)}`));
    cwd += `/${lesson}`;
  }

  return {
    page: 'rutas',
    cwd,
    command: config.command,
    segments,
    parent: segments.length > 1 ? segments[segments.length - 2].href : config.parent,
  };
}

function simpleRoute(page, params, config) {
  return {
    page,
    cwd: `/${config.label}`,
    command: config.command,
    segments: [ROOT_SEGMENT, segment(config.label, `${page}.html`)],
    parent: config.parent,
  };
}

export function buildTerminalRoute(page = pageId(), params = new URLSearchParams(window.location.search)) {
  const config = PAGE_CONFIG[page] || PAGE_CONFIG.index;
  if (page === 'index') {
    return {
      page,
      cwd: '~',
      command: config.command,
      segments: [ROOT_SEGMENT],
      parent: null,
    };
  }
  if (page === 'biblioteca') return bibliotecaRoute(params, config);
  if (page === 'herramientas') return herramientasRoute(params, config);
  if (page === 'rutas') return rutasRoute(params, config);
  if (page === 'guia') return guiaRoute(params, config);
  return simpleRoute(page, params, config);
}

export function getNavItem(id) {
  return NAV_ITEMS.find((item) => item.id === id) || null;
}

export function getPageNav(page = pageId()) {
  return PAGE_CONFIG[page]?.nav || null;
}
