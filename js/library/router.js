import { $ } from '../core/dom.js';
import { renderToolsHome, renderToolsCategory } from './render-tools.js';
import { renderResourcesHome, renderResourcesCategory } from './render-resources.js';
import { renderCVEHome } from './render-cve.js';

export function initLibraryRouter() {
  const contenedor = $('#contenedor-biblioteca');
  if (!contenedor) return;

  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get('cat');
  const tipo = urlParams.get('tipo') || (cat ? 'recursos' : null);

  if (!tipo) {
    renderResourcesHome(contenedor);
    return;
  }

  if (tipo === 'herramientas') {
    if (cat) renderToolsCategory(contenedor, cat);
    else renderToolsHome(contenedor);
    return;
  }

  if (tipo === 'recursos') {
    if (cat) renderResourcesCategory(contenedor, cat);
    else renderResourcesHome(contenedor);
    return;
  }

  if (tipo === 'cve') {
    renderCVEHome(contenedor);
    return;
  }

  renderResourcesHome(contenedor);
}
