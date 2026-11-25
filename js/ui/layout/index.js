import { buildTerminalRoute } from '../../data/navigation.js';
import { renderHeader } from './header.js';
import { renderFooter } from './footer.js';
import { renderTerminal } from './terminal.js';
import { renderGlobalModals } from './modals.js';

const TOOL_MODALS_URL = 'partials/modales-herramientas.html';
let toolModalsPromise = null;

function markModals(root) {
  root.querySelectorAll('.modal-overlay').forEach((modal) => {
    if (!modal.classList.contains('active')) {
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

function mountGlobalModals() {
  const root = document.getElementById('site-modals');
  if (!root || root.dataset.mounted === 'true') return root;
  root.insertAdjacentHTML('afterbegin', renderGlobalModals());
  root.dataset.mounted = 'true';
  markModals(root);
  return root;
}

export function mountLayout({ page } = {}) {
  const pageId = page || document.body.dataset.page || 'index';
  document.body.dataset.page = pageId;

  const header = document.getElementById('site-header');
  const terminal = document.getElementById('site-terminal');
  const footer = document.getElementById('site-footer');
  const route = buildTerminalRoute(pageId);

  if (header) header.innerHTML = renderHeader();
  if (terminal) terminal.innerHTML = renderTerminal(route);
  if (footer) footer.innerHTML = renderFooter();
  mountGlobalModals();

  const logo = document.querySelector('[data-logo]');
  if (logo) {
    logo.addEventListener('error', () => {
      logo.hidden = true;
    }, { once: true });
  }

  return { route, page: pageId };
}

export function refreshTerminal() {
  const terminal = document.getElementById('site-terminal');
  if (!terminal) return null;
  const route = buildTerminalRoute();
  terminal.innerHTML = renderTerminal(route);
  return route;
}

export async function loadToolModals() {
  const root = document.getElementById('site-modals');
  if (!root) return false;
  if (root.dataset.toolsMounted === 'true') return true;

  if (!toolModalsPromise) {
    toolModalsPromise = fetch(TOOL_MODALS_URL, {
      credentials: 'same-origin',
      headers: { Accept: 'text/html' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .catch((error) => {
        console.error('No se pudieron cargar las herramientas:', error);
        toolModalsPromise = null;
        return '';
      });
  }

  const html = await toolModalsPromise;
  if (!html) return false;

  root.insertAdjacentHTML('beforeend', html);
  root.dataset.toolsMounted = 'true';
  markModals(root);
  return true;
}
