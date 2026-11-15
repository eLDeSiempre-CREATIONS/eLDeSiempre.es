import { estructuraHerramientas } from '../data/tools-registry.js';
import { abrirModal } from '../core/modal.js';

export function renderToolsHome(contenedor) {
  let html = `<div class="breadcrumb"><a href="biblioteca.html">Biblioteca</a> / <span>Herramientas</span></div><h2>Laboratorio de Herramientas</h2><p style="margin-bottom: 20px; color: var(--text-muted);">Selecciona una categoría para explorar.</p><div class="folder-grid">`;
  for (const [slug, data] of Object.entries(estructuraHerramientas)) {
      html += `
          <a href="biblioteca.html?tipo=herramientas&cat=${slug}" class="folder">
              <div class="folder-icon">${data.icon}</div>
              <h3>${data.titulo}</h3>
              <p>${data.desc}</p>
              <span class="folder-badge">${data.herramientas.length} herramientas</span>
          </a>
      `;
  }
  html += `</div>`;
  contenedor.innerHTML = html;
}

export function renderToolsCategory(contenedor, categoriaActual) {
  const dataCat = estructuraHerramientas[categoriaActual];
  if (!dataCat) { 
    contenedor.innerHTML = "<p>Categoría no encontrada.</p>"; 
    return; 
  }

  let html = `
      <div class="breadcrumb">
          <a href="biblioteca.html">Biblioteca</a> / <a href="biblioteca.html?tipo=herramientas">Herramientas</a> / <span>${dataCat.titulo}</span>
      </div>
      <div class="category-header">
          <h2>${dataCat.icon} ${dataCat.titulo}</h2>
          <p>${dataCat.desc}</p>
          <input type="text" id="buscador-herramientas" class="tool-input" placeholder="🔍 Buscar herramienta..." oninput="filtrarHerramientas()">
      </div>
      <div class="grid-cards" id="lista-herramientas">
  `;

  dataCat.herramientas.forEach(h => {
      html += `
          <div class="card" data-titulo="${h.titulo.toLowerCase()}" onclick="abrirModal('modal-${h.id}')">
              <h3>${h.titulo}</h3>
              <p>${h.desc}</p>
              <p style="color: var(--neon-gold); font-size: 0.85rem; font-weight: bold; margin-top: auto;">Ideal para: ${h.ideal}</p>
          </div>
      `;
  });

  html += `</div>`;
  contenedor.innerHTML = html;

  window.filtrarHerramientas = () => {
    const input = document.getElementById('buscador-herramientas').value.toLowerCase();
    const items = document.querySelectorAll('#lista-herramientas .card');
    items.forEach(item => {
        const titulo = item.getAttribute('data-titulo');
        item.style.display = titulo.includes(input) ? 'flex' : 'none';
    });
  };
}
