import { $ } from '../core/dom.js';
import { renderHome } from './render-home.js';
import { renderToolsHome, renderToolsCategory } from './render-tools.js';
import { renderResourcesHome, renderResourcesCategory } from './render-resources.js';
import { renderCVEHome } from './render-cve.js';

export function initLibraryRouter() {
  const contenedor = $('#contenedor-biblioteca');
  if (!contenedor) return;

  const urlParams = new URLSearchParams(window.location.search);
  const tipo = urlParams.get('tipo');
  const cat = urlParams.get('cat');

  if (!tipo && !cat) {
    renderHome(contenedor);
  } else if (tipo === 'herramientas') {
    cat ? renderToolsCategory(contenedor, cat) : renderToolsHome(contenedor);
  } else if (tipo === 'recursos') {
    cat ? renderResourcesCategory(contenedor, cat) : renderResourcesHome(contenedor);
  } else if (tipo === 'cve') {
    renderCVEHome(contenedor);
  }
}
