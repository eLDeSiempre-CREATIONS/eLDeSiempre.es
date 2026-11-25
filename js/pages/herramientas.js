import { initPage } from '../core/page.js';
import { $ } from '../core/dom.js';
import { abrirModal } from '../core/modal.js';
import { mostrarToast } from '../core/toast.js';
import { estructuraHerramientas } from '../data/tools-registry.js';
import { renderToolsHome, renderToolsCategory } from '../library/render-tools.js';

function findTool(id) {
  for (const [cat, data] of Object.entries(estructuraHerramientas)) {
    const tool = data.herramientas.find((item) => item.id === id);
    if (tool) return { ...tool, cat };
  }
  return null;
}

function openTool(id, cat) {
  if (!id) return false;
  const tool = findTool(id);
  if (!tool) {
    mostrarToast('Herramienta no encontrada.', 'error');
    return false;
  }
  const modalId = `modal-${tool.id}`;
  if (!document.getElementById(modalId)) {
    mostrarToast('Esta herramienta todavía no está disponible.', 'error');
    return false;
  }
  abrirModal(modalId);
  return true;
}

function initToolsPage() {
  const container = $('#contenedor-herramientas');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  const tool = params.get('tool');

  if (cat) renderToolsCategory(container, cat);
  else renderToolsHome(container);

  container.addEventListener('click', (event) => {
    const card = event.target instanceof Element ? event.target.closest('[data-tool-id]') : null;
    if (!card) return;
    event.preventDefault();
    openTool(card.getAttribute('data-tool-id'));
  });

  if (tool) {
    const found = findTool(tool);
    if (!found) {
      mostrarToast('Herramienta no encontrada.', 'error');
      return;
    }
    if (!cat) renderToolsCategory(container, found.cat);
    openTool(tool);
  }
}

initPage({ page: 'herramientas', tools: true, onReady: initToolsPage });
